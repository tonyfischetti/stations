
'use strict';

const LANG              = document.documentElement.getAttribute("lang");


const init = () => {
  // const ethnet = document.getElementById("add-ethereum");
  // ethnet.onclick = () => addOrSwitchNetwork("ethereum");

  const poly = document.getElementById("add-polygon");
  poly.onclick = () => addOrSwitchNetwork("polygon");

  const ava = document.getElementById("add-avalanche");
  ava.onclick = () => addOrSwitchNetwork("avalanche");

  const fantom = document.getElementById("add-fantom");
  fantom.onclick = () => addOrSwitchNetwork("fantom");

  const harmony = document.getElementById("add-harmony");
  harmony.onclick = () => addOrSwitchNetwork("harmony");
};

window.addEventListener('DOMContentLoaded', init);

