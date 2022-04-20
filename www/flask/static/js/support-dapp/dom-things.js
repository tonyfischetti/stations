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

export const addActions = (stationState) => {
  // TODO: maybe add broadcast actions here?
  // TODO: check permissions before adding
  // TODO: PERMISSIONS, YO!
  window._DEBUG('adding broadcast actions');
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
