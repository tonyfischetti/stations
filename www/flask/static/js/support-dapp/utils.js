'use strict';

import * as dom from './dom-things.js';

export const getDocAttr = (doc, at) => {
  return doc.documentElement.getAttribute(at);
};

// TODO: make it handle objects
export const makeDebugFunction = (debug_p) => {
  /* if debug is true, this constructs the a working _DEBUG
   * function. If not, it's a no-op function */
  let _DEBUG;
  const tmp = document.getElementById('debug-container');
  tmp.style.display = 'block';
  const area = document.getElementById('debug-area');
  if (debug_p === 'true') {
    console.log('debug is true');
    area.value = '';
    _DEBUG = (msg) => {
      const tmp = area.value;
      area.value = tmp + '\n' + msg;
      console.log(`[debug] ${msg}`);
    };
  } else {
    area.value = '(debug mode is off)';
    _DEBUG = (msg) => { };
  }
  return _DEBUG;
};

export const formatTimestamp = (atimestamp) => {
  return new Intl.DateTimeFormat('default',
    {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(atimestamp * 1e3);
};

export const makeSmallerAddress = (anaddress) => {
  return `${anaddress.substring(0, 6)}...${anaddress.substring(39, 42)}`;
};

export const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const waitForElement = (id, callback, checkFrequencyInMs, timeoutInMs) => {
  const startTimeInMs = Date.now();
  console.log(`!!! looking for: ${id}`);
  (function loopSearch () {
    if (document.getElementById(id) != null) { callback(); } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) { return; }
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
};

export const callAttentionToElement = (id) => {
  console.log('call attention was called');
  document.getElementById(id).style.opacity = '0';
  (function stepUpOpacity () {
    const currentOpacity = document.getElementById(id).style.opacity;
    const newOpacity = String(+currentOpacity + 0.01);
    if (+currentOpacity >= 1) { } else {
      setTimeout(function () {
        document.getElementById(id).style.opacity = newOpacity;
        stepUpOpacity();
      }, 1);
    }
  })();
};

export const scrollToBroadcastID = (theid) => {
  document.getElementById(theid).scrollIntoView();
};

export const attachEventCallback = (theid, callback, eventType = 'click') => {
  const tmp = document.getElementById(theid);
  tmp.addEventListener(eventType, callback);
};

export const exportBroadcasts = (stationState) => {
  const expFileName =
    `${stationState.stationInfo.stationFrequency}-export-${Date.now()}.json`;
  // TODO: check for errors
  download(expFileName, JSON.stringify(stationState, null, 2));
  dom.toggleBlock('station-button-popup');
};
