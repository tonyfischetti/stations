
'use strict';

const LANG              = document.documentElement.getAttribute("lang");


const init = () => {
  // const ethnet = document.getElementById("addEthereum");
  // ethnet.onclick = () => addOrSwitchNetwork("ethereum");

  const poly = document.getElementById("addPolygon");
  poly.onclick = () => addOrSwitchNetwork("polygon");

  const ava = document.getElementById("addAvalanche");
  ava.onclick = () => addOrSwitchNetwork("avalanche");

  const fantom = document.getElementById("addFantom");
  fantom.onclick = () => addOrSwitchNetwork("fantom");

  const harmony = document.getElementById("addHarmony");
  harmony.onclick = () => addOrSwitchNetwork("harmony");
};

window.addEventListener('DOMContentLoaded', init);

