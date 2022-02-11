

const fillMobileOrDesktop = () => {
  const target = document.getElementById("isMobileOrDesktopDiv");
  target.innerHTML = `is mobile: ${IS_MOBILE_P}`;
};

window.addEventListener('DOMContentLoaded', fillMobileOrDesktop);

