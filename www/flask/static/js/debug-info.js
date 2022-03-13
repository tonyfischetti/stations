
'use strict';

const begin = () => {
  fillMobileOrDesktop();
  document.getElementById("datenow").textContent = `Date.now(): ${Date.now()}`;
};

const fillMobileOrDesktop = () => {
  let target = document.getElementById("is-mobile-or-desktop-div");
  target.innerHTML = `is mobile: ${IS_MOBILE_P}`;
};

// TODO: this
// const attemptToGetGeoLocation = () => {
//   const jsonpCallback = () => {
//     alert('Latitude: ' + data.latitude +
//       '\nLongitude: ' + data.longitude +
//       '\nCountry: ' + data.address.country);
//   };
// };


window.addEventListener('DOMContentLoaded', begin);

