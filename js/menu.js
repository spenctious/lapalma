/************************* Menu ************************/

//  Menu items are added in code because there's no server-side to cope with
//  HTML includes or partials and this prevents repetition


// wait for page to load before trying to add the menu
document.addEventListener('DOMContentLoaded', function() {
  addMenuItems();
}, false);

function getMenuItem(name, icon, target) {
  // if the page is the same as the link style it differently
  let menuLinkClass = "menu-link";
  if (target == window.location.pathname) {
    menuLinkClass += " current";
  }
  return `
    <a href=${target} class="${menuLinkClass}">
      <img src="${icon}" class="menu-icon">
      <span class="menu-item-name">${name}</span>
    </a>`;
}

function addMenuItems() {
  let navbarContent = `<p id="menu-header" class="close-button" onclick="closeNav()">&times;</p>`;

  navbarContent += getMenuItem("Home", "/img/icons/house-door.svg", "/index.html");

  navbarContent += `<p class="menu-section">Discover</p>`;
  navbarContent += getMenuItem("Walks", "/img/icons/hiker.svg", "/routes-browse.html");
  navbarContent += getMenuItem("Places", "/img/icons/geo-alt.svg", "/poi-browse.html");

  navbarContent += `<p class="menu-section">Check</p>`;
  navbarContent += getMenuItem("Forecasts", "/img/icons/weather.svg", "/forecasts.html");
  navbarContent += getMenuItem("Transport", "/img/icons/bus.svg", "/transport.html");

  navbarContent += `<p class="menu-section">Learn about</p>`;
  navbarContent += getMenuItem("Trails", "/img/icons/signpost.svg", "/trail-network.html");
  navbarContent += getMenuItem("Apps", "/img/icons/download.svg", "/apps.html");

  document.getElementById("navbar").innerHTML = navbarContent;
}

function openNav() {
  document.getElementById("navbar").style.transform = "translateX(0)";
  document.getElementById("overlay").style.display = "block";
}

function closeNav() {
  document.getElementById("navbar").style.transform = "translateX(-100%)";
  document.getElementById("overlay").style.display = "none";
}
