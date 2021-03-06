/************************* Menu ************************/

//  Menu items are added in code because there's no server-side to cope with
//  HTML includes or partials and this prevents repetition


// wait for page to load before trying to add the menu
document.addEventListener('DOMContentLoaded', function() {
  addMenuItems();
  document.getElementById("nav-overlay").addEventListener("click", closeNav);
  document.getElementById("open-menu").addEventListener("click", openNav);
}, false);


// returns html content for a menu item
// highlights the menu item that matches the current page or its alias
function getMenuItem(name, icon, target, altName1, altName2) {
  // if the page is the same as the link style it differently
  let menuLinkClass = "menu-link";
  let gridIcon = "";

  if (window.location.pathname.endsWith(target)) {
    menuLinkClass += " current";
  } else if (altName1 != undefined && window.location.pathname.endsWith(altName1)) {
    menuLinkClass += " current";
    gridIcon = `<span><img src="img/icons/info-circle.svg" class="menu-decorator"></span>`;
  } else if (altName2 != undefined && window.location.pathname.endsWith(altName2)) {
    menuLinkClass += " current";
    gridIcon = `<span><img src="img/icons/map.svg" class="menu-decorator"></span>`;
  }

  return `
    <a href=${target} class="${menuLinkClass}">
      <img src="${icon}" class="menu-icon">
      <span class="menu-item-name">${name}${gridIcon}</span>
    </a>`;
}


// load the menu with headings and link content
function addMenuItems() {
  let navbarContent = `<p id="menu-header" class="close-button" onclick="closeNav()">&times;</p>`;

  navbarContent += getMenuItem("Home", "img/icons/house-door.svg", "index.html");

  navbarContent += `<p class="menu-section">Discover</p>`;
  navbarContent += getMenuItem("Walks", "img/icons/hiker.svg", "routes-browse.html", "routes-detail.html", "route-map.html");
  navbarContent += getMenuItem("Places", "img/icons/geo-alt.svg", "poi-browse.html");

  navbarContent += `<p class="menu-section">Check</p>`;
  navbarContent += getMenuItem("Forecasts", "img/icons/weather.svg", "forecasts.html");
  navbarContent += getMenuItem("Transport", "img/icons/bus.svg", "transport.html");

  navbarContent += `<p class="menu-section">Learn about</p>`;
  navbarContent += getMenuItem("Trails", "img/icons/signpost.svg", "trail-network.html");
  navbarContent += getMenuItem("Apps", "img/icons/download.svg", "apps.html");

  document.getElementById("navbar").innerHTML = navbarContent;
}


// open the menu
function openNav() {
  document.getElementById("navbar").style.transform = "translateX(0)";
  document.getElementById("nav-overlay").style.display = "block";
}


// close the menu
function closeNav() {
  document.getElementById("navbar").style.transform = "translateX(-100%)";
  document.getElementById("nav-overlay").style.display = "none";
}
