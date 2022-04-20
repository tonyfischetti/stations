'use strict';

import * as utils from './utils.js';


const makeFlagTestClosure = (flagPosition) => {
  let tmpFun = (flagField) => {
    let mask = 1 << flagPosition;
    let check = flagField & mask;
    return check!==0x0000;
  };
  return tmpFun;
};

const makeFlagSetClosure = (flagPosition) => {
  let tmpFun = (flagField) => {
    let mask = 1 << flagPosition;
    return flagField | mask;
  };
  return tmpFun;
};

const spec_bcastCheckSystem = makeFlagTestClosure(15);
const spec_bcastSetSystem = makeFlagSetClosure(15);
const spec_bcastCheckDeleted = makeFlagTestClosure(14);
const spec_bcastSetDeleted = makeFlagSetClosure(14);
const spec_bcastCheckThatsMyJam = makeFlagTestClosure(2);

export const makeBroadcastPrettier = (bcast) => {
  let [broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata] = bcast;
  broadcastID = broadcastID.toNumber();
  unixTimestamp = unixTimestamp.toNumber();
  parent = parent.toNumber();
  reference_count = reference_count.toNumber();
  return {broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata};
};


export const insertBroadcast = (stationState, bcast) => {
  if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
    return;
  }
  else if(spec_bcastCheckSystem(+bcast.broadcastFlags)){
    return;
  }
  insertBroadcast_Delegator(stationState, bcast);
};


const insertBroadcast_Delegator = (stationState, bcast) => {
  switch (bcast.broadcastType) {
    case "0x0010":
      insertBroadcast_ThatsMyJam(stationState, bcast);
      break;
    case "0x0000":
      if (bcast.parent != 0){
        insertBroadcast_HTML_reply(stationState, bcast);
      } else {
        insertBroadcast_HTML(stationState, bcast);
      }
      break;
  }
}


// TODO: these need, sorely, to be re-written

const makeHTMLString_common_top = (stationState, bcast, customClasses="") => {
  let pfp_p = stationState.allUsers[bcast.author]?.user_metadata?.profilePic;
  pfp_p = pfp_p ? `<div class="bcast-profile-pic-container"> <img class="bcast-profile-pic" src="${pfp_p}"> </div>` : ``;
  let handle = stationState.allUsers[bcast.author]?.username ?? utils.make_smaller_address(bcast.author);

  return `
    <div id=bid${bcast.broadcastID}
         class="broadcast ${customClasses}">
      <div class="broadcast-header ${customClasses}">
        ${pfp_p}
        <div class="username ${customClasses}"
             style="background-color:
                    ${stationState.allUsers[bcast.author]?.
                      user_metadata?.
                      themeSettings?.
                      generations?.
                      usernameBoxColor ?? "darkcyan"}">
          ${handle}
        </div>
        <div class="broadcast-timestamp ${customClasses}">
          ${utils.formatTimestamp(bcast.unixTimestamp)}
        </div>
      </div>`;
};

const makeHTMLString_common_bottom = (bcast, customClasses="") => {
  return `
      <div class="broadcast-actions-container ${customClasses}">
      </div>
      <div class="broadcast-footer ${customClasses}"></div>
    </div>`;
};

const makeHTMLString_HTML = (stationState, bcast, customClasses="") => {
  return `
    ${makeHTMLString_common_top(stationState, bcast, customClasses)}
      <div class="broadcast-content-container ${customClasses}">
        <label class="broadcast-content ${customClasses}">
          ${bcast.content}
        </label>
      </div>
    ${makeHTMLString_common_bottom(bcast, customClasses)}`;
};

// TODO: verify that it's sane (and throw error if not)
const makeHTMLString_ThatsMyJam = (stationState, bcast, customClasses="") => {
  let theJSON = JSON.parse(bcast.content);
  let videoSlug = theJSON.youtubelink.match(/v=([\w\-]+)\W*.*$/)[1]
  let embedLink = `https://www.youtube.com/embed/${videoSlug}`;
  return `
    ${makeHTMLString_common_top(stationState, bcast, customClasses)}
      <div class="broadcast-content-container ${customClasses}">
        <label class="broadcast-content ${customClasses}">
          <blockquote class="thats-my-jam-lyrics">
            ${theJSON.lyrics}
          </blockquote>
          <object data="${embedLink}" class="thats-my-jam-video">
          </object>
          <b>${theJSON.artist}</b> - ${theJSON.title}
        </label>
      </div>
    ${makeHTMLString_common_bottom(bcast, customClasses)}`;
};


// TODO: does the templating make this unsafe?
const insertBroadcast_HTML = (stationState, bcast) => {
  let containerElement = document.getElementById("broadcasts-holder");
  let htmlString = makeHTMLString_HTML(stationState, bcast);
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

const insertBroadcast_ThatsMyJam = (stationState, bcast) => {
  let containerElement = document.getElementById("broadcasts-holder");
  let htmlString = makeHTMLString_ThatsMyJam(stationState, bcast);
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

// TODO: make this "dry"-er
const insertBroadcast_HTML_reply = (stationState, bcast) => {
  let containerElement =
    document.querySelector(`#bid${bcast.parent}>.broadcast-footer`);
  let htmlString = makeHTMLString_HTML(stationState, bcast, "reply");
  containerElement.insertAdjacentHTML("beforebegin", htmlString);
};




