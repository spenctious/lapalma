window.onload = function () {
  initialize();
};

const URL_PARAM_MAP = "map";

function initialize() {
  // get the specific route matching the URL parameter
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);

  // check URL for all required parameters
  let paramRoute = urlParams.get(URL_PARAM_MAP);

  // if parameters are missing, supply default data
  if (paramRoute == null) {
    paramRoute = "01";
  }

  document.getElementById("iframe_map").src = `maps/map-${paramRoute}.html`;
  document.getElementById("header-title").innerHTML = `Route ${paramRoute} map`;
}