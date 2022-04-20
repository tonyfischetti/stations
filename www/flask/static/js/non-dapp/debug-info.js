
'use strict';

import { checkIfMobile } from '../support-dapp/detect-things.js';

const begin = () => {
  fillMobileOrDesktop();
  document.getElementById("date-now").textContent = `Date.now(): ${Date.now()}`;
};

const fillMobileOrDesktop = () => {
  const isMobileP = checkIfMobile();
  document.getElementById("is-mobile-or-desktop-span").textContent =
    `is mobile: ${isMobileP}`;
};

window.addEventListener('DOMContentLoaded', begin);
