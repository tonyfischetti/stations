
'use strict';

import { PROVIDER_PARAMS, RPC_URL_MAP, CHAIN_ID_MAPPING,
         STATION_ABIS } from './support-dapp/chain-info.js';

import * as wallet from './support-dapp/wallet-things.js';
import * as utils from './support-dapp/utils.js';


const LANG              = utils.getDocAttr(document, "lang");


const init = () => {
  // const ethnet = document.getElementById("add-ethereum");
  // ethnet.onclick = () => wallet.addOrSwitchNetwork("ethereum");

  const poly = document.getElementById("add-polygon");
  poly.onclick = () => wallet.addOrSwitchNetwork("polygon");

  const ava = document.getElementById("add-avalanche");
  ava.onclick = () => wallet.addOrSwitchNetwork("avalanche");

  const fantom = document.getElementById("add-fantom");
  fantom.onclick = () => wallet.addOrSwitchNetwork("fantom");

  const harmony = document.getElementById("add-harmony");
  harmony.onclick = () => wallet.addOrSwitchNetwork("harmony");
};

window.addEventListener('DOMContentLoaded', init);

