'use strict';

export const fillStationInfo = (stationState) => {
  document.title = '[stations.network] ' + stationState.stationInfo.stationName;
  const elStationName = document.getElementById('station-name');
  const elStationDescription = document.getElementById('station-description');
  elStationName.textContent = stationState.stationInfo.stationName;
  elStationDescription.textContent = stationState.stationInfo.stationDescription;
};

export const toggleBlock = (anid) => {
  const el = document.getElementById(anid);
  if (el.style.display === 'block') {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
};

export const showBlock = (anid) => {
  const el = document.getElementById(anid);
  el.style.display = 'block';
};

export const toggleFlex = (anid) => {
  const el = document.getElementById(anid);
  if (el.style.display === 'flex') {
    el.style.display = 'none';
  } else {
    el.style.display = 'flex';
  }
};

export const showFlex = (anid) => {
  const el = document.getElementById(anid);
  el.style.display = 'flex';
};

export const hide = (anid) => {
  const el = document.getElementById(anid);
  el.style.display = 'none';
};

export const switchStationButtonPopupPane = (neededID) => {
  const candidates = document.querySelectorAll('#station-button-popup > div');
  candidates.forEach((it) => {
    if (it.id === neededID) { document.getElementById(it.id).style.display = 'flex'; } else { document.getElementById(it.id).style.display = 'none'; }
  });
};

export const switchOperationPopupPane = (neededID, show = true) => {
  if (show) { showFlex('operation-popup'); }
  const candidates = document.querySelectorAll('#operation-popup > div');
  candidates.forEach((it) => {
    if (it.id === neededID) { document.getElementById(it.id).style.display = 'flex'; } else { document.getElementById(it.id).style.display = 'none'; }
  });
};

// TODO: now that we have dynamic adding, how do we make sure the
//       user is logged in first?

export const addSingleActions = (it) => {
  // TODO: check permissions before adding
  // TODO: PERMISSIONS, YO!
  // TODO: skip if already done?
  const tmp = document.querySelector(`#${it} > .broadcast-actions-container`);
    // it.getElementsByClassName('broadcast-actions-container')[0];
  tmp.insertAdjacentHTML('afterbegin',
    `<button bid="${it}"
             class="bcast-action bcast-action-edit">
       edit
      </button>`);
  tmp.insertAdjacentHTML('afterbegin',
    `<button bid="${it}"
             class="bcast-action bcast-action-reply">
       reply
      </button>`);
  tmp.insertAdjacentHTML('afterbegin',
    `<button bid="${it}"
             class="bcast-action bcast-action-delete">
       delete
      </button>`);
};


// TODO: re-write so it does one at a time!!!
export const addActions = (stationState) => {
  // TODO: check permissions before adding
  // TODO: PERMISSIONS, YO!
  window._DEBUG('adding broadcast actions');
  // TODO: do I need to make it into an array, at all?
  const allBroadcastEls = Array.from(document.getElementsByClassName('broadcast'));
  allBroadcastEls.forEach((it) => {
    // TODO: if allowed
    const tmp = it.getElementsByClassName('broadcast-actions-container')[0];
    tmp.insertAdjacentHTML('afterbegin',
      `<button bid="${it.id}"
               class="bcast-action bcast-action-edit">
         edit
        </button>`);
    tmp.insertAdjacentHTML('afterbegin',
      `<button bid="${it.id}"
               class="bcast-action bcast-action-reply">
         reply
        </button>`);
    tmp.insertAdjacentHTML('afterbegin',
      `<button bid="${it.id}"
               class="bcast-action bcast-action-delete">
         delete
        </button>`);
  });
};

export const setUpLoggedIn = (provider, signer, myContract, stationState) => {
  window._DEBUG('logged in');
  toggleBlock('disconnect-button');
  hide('top-wedge');
  toggleBlock('bottom-wedge');

  // newly enable actions
  toggleBlock('compose-button');
  toggleBlock('change-user-metadata-button');

  document.getElementById('connect-button').style.display = 'none';
  hide('station-button-popup');
  switchStationButtonPopupPane('main_station-button-popup-container');

  console.log("ADD ACTIONS WAS CALLED!");
  addActions(stationState);
};

export const convertToReply = (anid, parent) => {
  document.querySelector(`#${anid} > .make-change`).innerText = 'Reply';
  document.querySelector(`#${anid} > .operation-modal-header > .operation-modal-title`).innerText = `Reply to broadcast #${parent}`;
  document.querySelector(`#${anid} > .hidden-info`).setAttribute('parent', parent);
};

export const convertToEdit = (anid, parent) => {
  document.querySelector(`#${anid} > .make-change`).innerText = 'Submit edit';
  document.querySelector(`#${anid} > .operation-modal-header > .operation-modal-title`).innerText = `Edit broadcast #${parent}`;
  document.querySelector(`#${anid} > .hidden-info`).setAttribute('parent', parent);
};

export const revertToNonEditOrReply = (anid) => {
  document.querySelector(`#${anid} > .make-change`).innerText = 'Broadcast';
  document.querySelector(`#${anid} > .operation-modal-header > .operation-modal-title`).innerText = 'Compose broadcast';
  document.querySelector(`#${anid} > .hidden-info`).setAttribute('parent', 0);
};

export const clearPane = (anid) => {
  const matches = document.querySelectorAll(`#${anid} > .clearable`);
  matches.forEach((it) => { it.value = ""; });
  window._DEBUG(`cleared input in pane #${anid}`);
};
