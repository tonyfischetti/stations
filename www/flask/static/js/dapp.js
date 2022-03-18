
// TODO: react to network changes

'use strict';

// REPLACE

let stationState                      = {};
stationState["stationInfo"]           = {};
stationState.contract                 = {};
stationState.contract.chain           = getDocAttr(document, "chain");
stationState.contract.address         = getDocAttr(document, "contract");
stationState["allUsers"]              = {};
stationState["allBroadcasts"]         = [];
stationState["clientInfo"]            = {};
stationState.clientInfo.clientVersion = 0.7;
stationState.clientInfo.currentRPC    = RPC_URL_MAP[stationState.contract.chain];
stationState.clientInfo.debug_p       = getDocAttr(document, "debug");

const SCROLL_TO                       = getDocAttr(document, "scrollto");
const BASE_ABI_VERSION                = "v9";
let   _DEBUG;                           // global debug function
let   web3;
let   myContract;



const reconstructMyContractVar = (version, address, gasPrice=null) => {
  if(gasPrice){
    myContract = new web3.eth.Contract(STATION_ABIS[version], address,
      { gasPrice: gasPrice });
  } else{
    myContract = new web3.eth.Contract(STATION_ABIS[version], address);
  }
};



/* ---------------------------------------------------------------- */

/*************************************/
/* runs when DOM is finished loading */
/*************************************/
const startDapp = async () => {

  makeDebugFunction();

  _DEBUG("document ready");
  _DEBUG("chain:            " + stationState.contract.chain);
  _DEBUG("contract address: " + stationState.contract.address);
  _DEBUG("");

  MetaMaskClientCheck();

  web3 = new Web3(stationState.clientInfo.currentRPC);
  _DEBUG("made new web3 object. attempting to connect to contract");
  reconstructMyContractVar(BASE_ABI_VERSION, stationState.contract.address);
  _DEBUG("made contract object with base ABI before knowing station version");

  await myContract.methods.station_info().call({}, getStationInfo);
  /* now that we know the stations version, we can use the correct ABI */
  reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                           stationState.contract.address);
  // TODO: dynamically load correct JS here (microblog.js)
  _DEBUG("recontructed myContract var with correct station version");
  await myContract.methods.get_all_users().call({}, getUserInfo);
  await getAllBroadcasts();

  /* _now_ we can enable the export button */
  let exportButton = document.getElementById("export-button");
  exportButton.disabled = false;
  exportButton.onclick = exportBroadcasts;

  /* we can't handle big network changes, right now...    *
   * just reload                                          */
  window.ethereum.on('networkChanged', handleBigMetamaskChange);
  window.ethereum.on('accountsChanged', handleBigMetamaskChange);
  window.ethereum.on('chainChanged', handleBigMetamaskChange);

  const bcastHolder = document.getElementById('broadcasts-holder');
  bcastHolder.addEventListener('click', (event) => {
    if(event.target.nodeName !== 'BUTTON'){
      return;
    }

    if(event.target.classList.contains("bcast-action-edit")){
      beginEdit(+(event.target.attributes.bid.value.replace(/^bid/, "")));
    }
    if(event.target.classList.contains("bcast-action-reply")){
      beginReply(+(event.target.attributes.bid.value.replace(/^bid/, "")));
    }
    if(event.target.classList.contains("bcast-action-delete")){
      beginDelete(+(event.target.attributes.bid.value.replace(/^bid/, "")));
    }
  });


  /****************/
  /* Modal things */
  /****************/

  /* composition modal things */
  const compositionModal = document.getElementById("composition-modal");
  const composeButton = document.getElementById("compose-button");
  const compositionModalClose = document.getElementById("composition-modal-close");
  composeButton.onclick = () => {
    compositionModal.style.display = "block";
  };
  compositionModalClose.onclick = () => { compositionModal.style.display = "none"; };

  /* edit modal things */
  const editModal = document.getElementById("edit-modal");
  const editModalClose = document.getElementById("edit-modal-close");
  editModalClose.onclick = () => { editModal.style.display = "none"; };

  /* reply modal things */
  const replyModal = document.getElementById("reply-modal");
  const replyModalClose = document.getElementById("reply-modal-close");
  replyModalClose.onclick = () => { replyModal.style.display = "none"; };

  /* debug modal things */
  const debugConsoleModal = document.getElementById("debug-console-modal");
  const debugConsoleButton = document.getElementById("debug-console-button");
  const debugConsoleModalClose = document.getElementById("debug-console-modal-close");
  debugConsoleButton.onclick = () => { debugConsoleModal.style.display = "block"; };
  debugConsoleModalClose.onclick = () => { debugConsoleModal.style.display = "none"; };

  /* import modal things */
  const importModal = document.getElementById("import-modal");
  const importButton = document.getElementById("import-button");
  const importModalClose = document.getElementById("import-modal-close");
  importButton.onclick = () => { importModal.style.display = "block"; };
  importModalClose.onclick = () => { importModal.style.display = "none"; };

  /* change user metadata modal things */
  const changeUserMetadataModal =
    document.getElementById("change-user-metadata-modal");
  const changeUserMetadataButton =
    document.getElementById("change-user-metadata-button");
  const changeUserMetadataModalClose =
    document.getElementById("change-user-metadata-modal-close");
  changeUserMetadataButton.onclick = () =>
    { changeUserMetadataModal.style.display = "block"; };
  changeUserMetadataModalClose.onclick = () =>
    { changeUserMetadataModal.style.display = "none"; };

  window.onclick = (event) => {
    _DEBUG(`[window click event] target: ${event.target}`);
    if (event.target == debugConsoleModal ||
        event.target == compositionModal ||
        event.target == editModal ||
        event.target == replyModal ||
        event.target == importModal ||
        event.target == changeUserMetadataModal) {
      debugConsoleModal.style.display = "none";
      compositionModal.style.display = "none";
      editModal.style.display = "none";
      replyModal.style.display = "none";
      importModal.style.display = "none";
      changeUserMetadataModal.style.display = "none";
    }
  };


  if (SCROLL_TO !== "None"){
    waitForElement(SCROLL_TO, () => {
      scrollToBroadcastID(SCROLL_TO);
      callAttentionToElement(SCROLL_TO);
    }, 1000, 30000);
  }

};

/* ---------------------------------------------------------------- */


// TODO: make sure the JSON parses!
// TODO: this is bad. The textarea should be set beforehand
const beginChangeUserMetadata = async () => {
  console.log("HERE");
  let address = window.ethereum.selectedAddress;
  try {
    document.getElementById("user-metadata-area").value =
      JSON.stringify(stationState.allUsers[address].user_metadata);
  } catch {
  }

  let toBroadcast = document.getElementById("user-metadata-area").value;
  let rawXact = myContract.methods.replace_user_metadata(toBroadcast);
  // rawXact.estimateGas( { from: window.ethereum.selectedAddress } );
  rawXact.send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("!UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
  });
};

const beginEdit = async (anid) => {
  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "block";
  document.getElementById("edit-area").value = stationState.allBroadcasts[anid].content
  const editButton = document.getElementById("edit-button");
  editButton.onclick = async () => {
    let toBroadcast = document.getElementById("edit-area").value;
    let sig = await getSignature(toBroadcast);
    _DEBUG("attempting to edit broadcast: " + anid +
           " with new signature: " + sig);
    myContract.methods.edit_broadcast(anid, toBroadcast, sig).send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          return;
        }
        console.log(result);
      });
  };
};

const beginReply = async (anid) => {
  const replyModal = document.getElementById("reply-modal");
  replyModal.style.display = "block";

  // hist is what?
  document.getElementById("reply-area").placeholder =
    `response to: "${stationState.allBroadcasts[anid].content}"`;
  const replyButton = document.getElementById("reply-button");

  replyButton.onclick = async () => {
    let toBroadcast = document.getElementById("reply-area").value;
    let sig = await getSignature(toBroadcast);
    _DEBUG("attempting to reply to broadcast: " + anid +
           " with signature: " + sig);
    let rawXact = myContract.methods.do_broadcast(toBroadcast, sig, anid,
                                                  "0x0000", "0x0000", "", 0);
    // console.log(rawXact);
    // rawXact.estimateGas( { from: window.ethereum.selectedAddress } );
    rawXact.send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          return;
        }
        console.log(result);
      });
  };
};

const beginDelete = async (anid) => {
  _DEBUG("attempting to delete broadcast " + anid);
  let rawXact = myContract.methods.delete_broadcast(anid);
  // console.log(rawXact);
  // rawXact.estimateGas( { from: window.ethereum.selectedAddress } );
  rawXact.send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("!UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
    });
};




const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

const MetaMaskClientCheck = () => {
  const connectButton = document.getElementById("connect-button");
  _DEBUG("checking for metamask client");
  if (!isMetaMaskInstalled()) {
    _DEBUG("metamask not found");
    connectButton.innerText = "connect";
    connectButton.onclick = connectButtonClicked_Onboard;
  } else {
    _DEBUG("metamask detected");
    connectButton.innerText = 'Connect';
    connectButton.onclick = connectButtonClicked_Connect;
    connectButton.disabled = false;
  }
};

const ADD_ACTIONS = () => {
  // TODO: PUT SOMEWERE ELSE
  // TODO: maybe add broadcast actions here?
  // TODO: check permissions before adding
  // TODO: PERMISSIONS, YO!
  let allBroadcastEls = Array.from(document.getElementsByClassName("broadcast"));
  allBroadcastEls.map((it) => {
    // TODO: if allowed
    let tmp = it.getElementsByClassName("broadcast-actions-container")[0];
    tmp.insertAdjacentHTML("afterbegin",
      `<button bid="${it.id}"
               class="bcast-action bcast-action-edit">
         edit
        </button>`);
    tmp.insertAdjacentHTML("afterbegin",
      `<button bid="${it.id}"
               class="bcast-action bcast-action-reply">
         reply
        </button>`);
    tmp.insertAdjacentHTML("afterbegin",
      `<button bid="${it.id}"
               class="bcast-action bcast-action-delete">
         delete
        </button>`);
  });
};

const setUpLoggedInElements = () => {
  let connectButton = document.getElementById("connect-button");
  let address = window.ethereum.selectedAddress;
  connectButton.innerText =
    `log out  (${address.substring(0, 7)}...${address.substring(39)})`;
  // TODO: this is better done as a tear-down script
  connectButton.onclick = () => { window.location.reload(); };

  // // TODO do i need? (tmp todo)
  let doImportButton = document.getElementById("do-import-button");
  doImportButton.onclick = firstTryImport;
  let doChangeUserMetdataButton =
    document.getElementById("do-change-user-metadata-button");
  console.log("button: " + doChangeUserMetdataButton);
  doChangeUserMetdataButton.onclick = beginChangeUserMetadata;

  /* have to use metamask provider now--so we'll change the web3 var */
  replaceWeb3andMyContractAfterLogin();

  // console.log("supposed to make compose visible now");
  document.getElementById("compose-button").style.display = "inline";
  document.getElementById("change-user-metadata-button").style.display = "inline";
  // document.getElementById("importButton").style.display = "inline";

  let specifiedButton = document.getElementById("rawHTML_broadcast-button");
  specifiedButton.onclick = makeRawHTMLBroadcast;

  specifiedButton = document.getElementById("jam_broadcast-button");
  specifiedButton.onclick = makeJamBroadcast;

  ADD_ACTIONS();

};

const replaceWeb3andMyContractAfterLogin = () => {
  web3 = new Web3(window.ethereum);
  // TODO: fix this ugliness
  if(stationState.contract.chain=="polygon"){
    reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                             stationState.contract.address,
                             "60000000000"); // 60 gwei
  } else {
    reconstructMyContractVar(`v${stationState.stationInfo.stationVersion}`,
                             stationState.contract.address);
  }
};

const connectButtonClicked_Connect = async () => {
  let ret = false;
  try {
    _DEBUG("\nattempting to connect to metamask client");
    let connectButton = document.getElementById("connect-button");
    await ethereum.request({ method: 'eth_requestAccounts' });
    let currentChainId = ethereum.networkVersion;
    let detectedChain = CHAIN_ID_MAPPING[currentChainId];
    _DEBUG("selected address: " + window.ethereum.selectedAddress);
    _DEBUG("network version: " + currentChainId);
    if(PROVIDER_PARAMS[stationState.contract.chain].chainName===detectedChain){
      _DEBUG("we appear to be on the right blockchain");
      ret = true;
      // setUpLoggedInElements();
    } else {
      let ermes = makeWrongChainMessage(currentChainId, detectedChain,
        PROVIDER_PARAMS[stationState.contract.chain].chainName);
      if(confirm(ermes)){
        _DEBUG("switching to the correct network");
        await addOrSwitchNetwork(stationState.contract.chain);
      } else {
        _DEBUG("user declined to change networks... bailing out");
        ret = false;
      }
    }
  } catch (error) {
    alert("UNHANDLED ERROR:\n" + error);
    ret = false;
  }
  if(ret)
    setUpLoggedInElements();
  return ret;
};

const connectButtonClicked_Info = () => {
  alert("NOT IMPLEMENTED (connection info)");
};

const connectButtonClicked_Onboard = () => {
  alert("NOT IMPLEMENTED (onboarding)");
};

const makeDebugFunction = () => {
  /* if debug is true, this constructs the a working _DEBUG
   * function. If not, it's a no-op function */
  let tmp = document.getElementById("debug-container");
  tmp.style.display = "block";
  let area = document.getElementById("debug-area");
  if(stationState.clientInfo.debug_p==="true"){
    console.log("debug is true");
    area.value = "";
    _DEBUG = (msg) => {
      let tmp = area.value;
      area.value = tmp + "\n" + msg;
    };
  } else{
    area.value = "(debug mode is off)";
    _DEBUG = (msg) => { return; }
  }
};

function fillStationInfoOnDOM(){
  document.title = "[stations.network] " + stationState.stationInfo.stationName;
  const elStationName           = document.getElementById("station-name");
  const elStationDescription    = document.getElementById("station-description");
  elStationName.textContent = stationState.stationInfo.stationName;
  elStationDescription.textContent = stationState.stationInfo.stationDescription;
}

function getStationInfo(error, objFromChain){
  if (error){ alert("!UNHANDLED ERROR:\n" + error); return; }

  stationState.stationInfo = {
    stationName:          objFromChain["0"],
    stationFrequency:     objFromChain["1"],
    stationDescription:   objFromChain["2"],
    stationVersion:       objFromChain["3"],
    stationMinorVersion:  objFromChain["4"],
    creator:              objFromChain["5"],
    createdOn:            objFromChain["6"],
    stationType:          objFromChain["7"],
    stationFlags:         objFromChain["8"],
    stationMetadata:      objFromChain["9"],
    stationNumUsers:      objFromChain["10"],
    stationNumBroadcasts: objFromChain["11"],
  };

  fillStationInfoOnDOM();
  _DEBUG("got station info");
}

function getUserInfo(error, objFromChain){
  if (error){ alert("UNHANDLED ERROR:\n" + error); return; }

  objFromChain.map(it => {
    if(it[1]!=="uncaused-cause"){
      let tmpaddress =  it[0]; // .toUpperCase();
      stationState.allUsers[tmpaddress] = {
        username:       it[1],
        time_joined:    it[2],
        // user_metadata:  it[3]
      };
      try {
        stationState.allUsers[tmpaddress].user_metadata =
          JSON.parse(it[3]);
      } catch (error) {
        stationState.allUsers[tmpaddress].user_metadata = it[3];
      }
    }
  });
  _DEBUG("got user info");
}

const formatTimestamp = (atimestamp) => {
  return new Intl.DateTimeFormat('default',
    { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      year: 'numeric', month: 'numeric', day: 'numeric',
    }).format(atimestamp * 1e3);
}

const makeBroadcastPrettier = (bcast) => {
  const [broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata] = bcast;
  return {broadcastID, unixTimestamp, author, content, signature, parent,
    reference_count, broadcastType, broadcastFlags, broadcastMetadata};
};

/* get and display all broadcasts */
async function getAllBroadcasts(){
  myContract.methods.get_all_broadcasts().call({},
    function(error, result){
      if (error){ alert("UNHANDLED ERROR:\n" + error); return; }
      console.log(result);
      stationState.allBroadcasts = result.map(makeBroadcastPrettier);
      stationState.allBroadcasts.map(bcast => {
        try{
          insertBroadcast(bcast);
        } catch (error){
          console.log("broadcast insertion failed: " + error);
        }
      });
  });
  _DEBUG("got all broadcasts\n");
}

const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const exportBroadcasts = () => {
  let expFileName =
    `${stationState.stationInfo.stationFrequency}-export-${Date.now()}.json`;
  // TODO: check for errors
  download(expFileName, JSON.stringify(stationState, null, 2));
};




const scrollToBroadcastID = (theid) => {
  document.getElementById(theid).scrollIntoView();
};


const getSignature = async (text) => {
  let inHex = web3.utils.utf8ToHex(text);
  let hashed = web3.utils.keccak256(inHex);
  return await web3.eth.personal.sign(hashed, window.ethereum.selectedAddress);
}


const toggleElementVisibility = (aselector, type="block") => {
  const tmp = document.querySelector(aselector);
  console.log(`got tmp: ${tmp}`);
  console.log(`display is: ${tmp.style.display}`);
  console.log(tmp.style.display);
  if (tmp.style.display === "none") {
    tmp.style.display = type;
  } else {
    tmp.style.display = "none";
  }
};


/**********************************************/
/* DOM is finished loading.... LEZZZ GOOOO!!! */
/**********************************************/
window.addEventListener('DOMContentLoaded', startDapp);





const handleBigMetamaskChange = (something) => {
  window.location.reload();
};


function waitForElement(id, callback, checkFrequencyInMs, timeoutInMs) {
  let startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.getElementById(id) != null) { callback(); return; }
    else {
      setTimeout(function() {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs){ return; }
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

function callAttentionToElement(id){
  console.log("call attention was called");
  document.getElementById(id).style.opacity = "0";
  (function stepUpOpacity() {
    let currentOpacity = document.getElementById(id).style.opacity;
    let newOpacity = String(+currentOpacity + 0.01);
    if (+currentOpacity >= 1){ return; }
    else {
      setTimeout(function() {
        document.getElementById(id).style.opacity = newOpacity;
        stepUpOpacity();
      }, 1);
    }
  })();
}

// --------------------------------------------------------------- //

/* broadcast functions for different types
 * (see TODO in html template)             */

const makeRawHTMLBroadcast = async () => {
  let toBroadcast = document.getElementById("rawHTML_composition-area").value;
  let sig = await getSignature(toBroadcast);
  _DEBUG("attempting to broadcast: " + toBroadcast +
         " with signature: " + sig);
  let rawXact =
    myContract.methods.do_broadcast(toBroadcast, sig, 0, "0x0000",
                                             "0x0000", "", 0);
  // console.log(rawXact.estimateGas({ from: window.ethereum.selectedAddress }));
  rawXact.send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("!UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
    });
};

const makeJamBroadcast = async () => {
  console.log("posting jam");
  let artist = document.getElementById("artist").value;
  let title = document.getElementById("songtitle").value;
  let youtubelink = document.getElementById("youtubelink").value;
  let lyrics = document.getElementById("lyrics").value;

  // TODO: needs to be escaped!
  // TODO: needs to be escaped!
  let toBroadcast =
    JSON.stringify({artist: artist, title: title,
    youtubelink: youtubelink, lyrics: lyrics}, null, 2);

  let sig = await getSignature(toBroadcast);
  _DEBUG("attempting to broadcast: " + toBroadcast +
         " with signature: " + sig);

  let rawXact =
    myContract.methods.do_broadcast(toBroadcast, sig, 0, "0x0010",
                                             "0x0000", "", 0);
  // console.log(rawXact.estimateGas({ from: window.ethereum.selectedAddress }));
  rawXact.send(
    { from: window.ethereum.selectedAddress },
    function(error, result){
      if (error){
        alert("!UNHANDLED ERROR:\n" + error);
        return;
      }
      console.log(result);
    });
};



// --------------------------------------------------------------- //

/* display rules for different broadcast Types */

const insertBroadcast = (bcast) => {
  // TODO: write this better
  if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
    _DEBUG(`[insertion] broadcastID ${bcast.broadcastID} - skipped (deleted)`);
    return;
  }
  else if (spec_bcastCheckSystem(+bcast.broadcastFlags)){
    _DEBUG(`[insertion] broadcastID ${bcast.broadcastID} - skipped (system)`);
    return;
  }
  insertBroadcast_Delegator(bcast);
};

const insertBroadcast_Delegator = (bcast) => {
  // TODO: dispatch based on type
  console.log(bcast.broadcastType);
  switch (bcast.broadcastType) {
    case "0x0010":
      console.log("JAM");
      insertBroadcast_ThatsMyJam(bcast);
      break;
    case "0x0000":
      if (bcast.parent != 0){
        insertBroadcast_HTML_reply(bcast);
      } else {
        insertBroadcast_HTML(bcast);
      }
      break;
  }
}

// TODO
// TODO
// TODO
//   the actions should be added in a different step


// TODO: verify that it's sane (and throw error if not)
const makeHTMLString_ThatsMyJam = (bcast, customClasses="") => {
  let theJSON = JSON.parse(bcast.content);
  let videoSlug = theJSON.youtubelink.match(/v=([\w\-]+)\W*.*$/)[1]
  let embedLink = `https://www.youtube.com/embed/${videoSlug}`;
  return `
    <div id=bid${bcast.broadcastID}
         class="broadcast ${customClasses}">
      <div class="broadcast-header ${customClasses}">
        <div class="username ${customClasses}"
             style="background-color:
                    ${stationState.allUsers[bcast.author]?.
                      user_metadata?.
                      themeSettings?.
                      generations?.
                      usernameBoxColor ?? "darkcyan"}">
          ${stationState.allUsers[bcast.author].username}
        </div>
        <div class="broadcast-timestamp ${customClasses}">
          ${formatTimestamp(bcast.unixTimestamp)}
        </div>
      </div>
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
      <div class="broadcast-actions-container ${customClasses}">
      </div>
      <div class="broadcast-footer ${customClasses}"></div>
    </div>`;
};


const makeHTMLString_HTML = (bcast, customClasses="") => {
  return `
    <div id=bid${bcast.broadcastID}
         class="broadcast ${customClasses}">
      <div class="broadcast-header ${customClasses}">
        <div class="username ${customClasses}"
             style="background-color:
                    ${stationState.allUsers[bcast.author]?.
                      user_metadata?.
                      themeSettings?.
                      generations?.
                      usernameBoxColor ?? "darkcyan"}">
          ${stationState.allUsers[bcast.author].username}
        </div>
        <div class="broadcast-timestamp ${customClasses}">
          ${formatTimestamp(bcast.unixTimestamp)}
        </div>
      </div>
      <div class="broadcast-content-container ${customClasses}">
        <label class="broadcast-content ${customClasses}">
          ${bcast.content}
        </label>
      </div>
      <div class="broadcast-actions-container ${customClasses}">
      </div>
      <div class="broadcast-footer ${customClasses}"></div>
    </div>`;
};


// TODO: does the templating make this unsafe?
const insertBroadcast_HTML = (bcast) => {
  let containerElement = document.getElementById("broadcasts-holder");
  let htmlString = makeHTMLString_HTML(bcast);
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

const insertBroadcast_ThatsMyJam = (bcast) => {
  let containerElement = document.getElementById("broadcasts-holder");
  let htmlString = makeHTMLString_ThatsMyJam(bcast);
  containerElement.insertAdjacentHTML("afterbegin", htmlString);
};

// TODO: make this "dry"-er
const insertBroadcast_HTML_reply = (bcast) => {
    // let containerElement = document.getElementById(`${bcast.parent}`);
  // let containerElement = document.querySelector(`#bid${bcast.parent}>.broadcastActionsContainer`);
  let containerElement =
    document.querySelector(`#bid${bcast.parent}>.broadcast-footer`);
  let htmlString = makeHTMLString_HTML(bcast, "reply");
  // containerElement.insertAdjacentHTML("afterend", htmlString);
  containerElement.insertAdjacentHTML("beforebegin", htmlString);
};


// --------------------------------------------------------------- //

// TODO: separate more of the xactions from the spend

// TODO: restructure so that it's its own page
//
const firstTryImport = () => {
  let rawJson = document.getElementById("import-area").value;
  let parsedJson = JSON.parse(rawJson);

  parsedJson.allBroadcasts.map((bcast) => {
    if(spec_bcastCheckDeleted(+bcast.broadcastFlags)){
      _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (deleted)`);
      return;
    }
    else if(spec_bcastCheckSystem(+bcast.broadcastFlags)){
      _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - skipped (system)`);
      return;
    }
    // TODO: should I use try, or halt?

    let singleImportXaction =
      myContract.methods.import_broadcast(bcast.unixTimestamp,
                                        bcast.author,
                                        bcast.content,
                                        bcast.signature,
                                        bcast.broadcastType,
                                        bcast.broadcastFlags,
                                        bcast.broadcastMetadata);
    console.log(singleImportXaction);
    singleImportXaction.send(
      { from: window.ethereum.selectedAddress },
      function(error, result){
        if (error){
          alert("!UNHANDLED ERROR:\n" + error);
          _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} - UNHANDLED ERROR: + ${error}`);
          return;
        }
        console.log(result);
    });
    _DEBUG(`[import] foreign broadcastID ${bcast.broadcastID} successful!`);
  });

};


