

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
  navbar.appendChild(createMenuItem("Browse walks", "#"));
  navbar.appendChild(createMenuItem("GPS Apps", "#"));
  navbar.appendChild(createMenuItem("The trail network", "#"));
  navbar.appendChild(createMenuItem("Forecasts", "#"));
  navbar.appendChild(createMenuItem("Points of interest", "#"));
}

function openNav() {
  document.getElementById("navbar").style.left = "0px";
  document.getElementById("overlay").style.display = "block";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("navbar").style.left = "-250px";
  document.getElementById("overlay").style.display = "none";
}
