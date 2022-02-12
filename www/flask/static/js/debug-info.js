
const begin = () => {
  fillMobileOrDesktop();
};

const fillMobileOrDesktop = () => {
  const target = document.getElementById("isMobileOrDesktopDiv");
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

