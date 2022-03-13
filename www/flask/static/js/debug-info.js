
'use strict';

const begin = () => {
  fillMobileOrDesktop();
  document.getElementById("date-now").textContent = `Date.now(): ${Date.now()}`;
  // TODO: the viewport size because I has about
  //       to write mobile only CSS
  //       and I cleaned up the the id/class names
  //       WOW
};

const fillMobileOrDesktop = () => {
  document.getElementById("is-mobile-or-desktop-div").target.innerHTML =
    `is mobile: ${IS_MOBILE_P}`;


// TODO: this
// const attemptToGetGeoLocation = () => {
//   const jsonpCallback = () => {
  //
  //   llback = () => {
//     alert('Latitude: ' + data.latitude +
//       '\nLongitude: ' + data.longitude +
//       '\nCountry: ' + data.address.country);
//   };
// };


window.addEventListener('DOMContentLoaded', begin);

