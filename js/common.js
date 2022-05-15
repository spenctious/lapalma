// Wait for page to load before trying to add the menu
document.addEventListener('DOMContentLoaded', function () {
  addMenuItems();
}, false);

//
// Navigation
//  Menu items are added in code because there's no server-side to cope with
//  HTML includes or partials and this prevents repetition
//


function createMenuItem(name, target) {
  let menuItem = document.createElement("a");
  if (target == window.location.pathname) {
    menuItem.classList.add("current");
  }
  let menuItemText = document.createTextNode(name);
  menuItem.setAttribute("href", target);
  menuItem.appendChild(menuItemText);
  return menuItem;
}

function addMenuItems() {
  let closeButton = document.createElement("a");
  closeButton.setAttribute("onclick", "closeNav()");
  closeButton.setAttribute("class", "closebtn");
  closeButton.innerHTML = "&times;";

  let navbar = document.getElementById("navbar");
  navbar.appendChild(closeButton);

  // Add and arrange menu items here
  navbar.appendChild(createMenuItem("Home", "/index.html"));
  navbar.appendChild(createMenuItem("Browse walks", "/routes-browse.html"));
  navbar.appendChild(createMenuItem("Browse places", "/poi-browse.html"));
  navbar.appendChild(createMenuItem("Forecasts", "/forecasts.html"));
  navbar.appendChild(createMenuItem("GPS Apps", "/apps.html"));
  navbar.appendChild(createMenuItem("The trail network", "/trail-network.html"));
  navbar.appendChild(createMenuItem("Transport", "/transport.html"));
}

function openNav() {
  document.getElementById("navbar").style.transform = "translateX(0)";
  document.getElementById("overlay").style.display = "block";
}

function closeNav() {
  document.getElementById("navbar").style.transform = "translateX(-100%)";
  document.getElementById("overlay").style.display = "none";
}

function openFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(-100%)";
  document.getElementById("overlay").style.display = "block";
}

function closeFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(0)";
  document.getElementById("overlay").style.display = "none";
}
