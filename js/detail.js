"use strict";

// The raw data in JSON format
var categories;
var locations;
var routes;

// Maps generated from data segments
var walkType;
var duration;
var effort;
var basics;
var interest;
var terrain;
var warnings;
var locationMap;

// Additional data
var favourites;
var route;

// For diagnostics
var reloadData = true;

/************************* Data loading and initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};

async function loadData() {
  try {
    if (reloadData || localStorage.getItem("dataLoaded") === null) {
      // read data from JSON files
      const result1 = await fetch('/data/categories.json');
      categories = await result1.json();
      const result2 = await fetch('/data/locations.json');
      locations = await result2.json();
      const result3 = await fetch('/data/routes.json');
      routes = await result3.json();

      // save it in local storage for other pages to use
      localStorage.setItem("categories", JSON.stringify(categories));
      localStorage.setItem("locations", JSON.stringify(locations));
      localStorage.setItem("routes", JSON.stringify(routes));
      localStorage.setItem("dataLoaded", "true");
    }
    else {
      // read the data from local storage if we have it
      categories = JSON.parse(localStorage.categories);
      locations = JSON.parse(localStorage.locations);
      routes = JSON.parse(localStorage.routes);
    }
    initialize();
  } catch (error) {
    console.log('Request failed', error);
  }
}

function initialize() {
  walkType = new Map(categories.walkType);
  duration = new Map(categories.duration);
  effort = new Map(categories.effort);
  basics = new Map(categories.basics);
  interest = new Map(categories.interest);
  terrain = new Map(categories.terrain);
  warnings = new Map(categories.warnings);
  locationMap = new Map(locations.locations);

  favourites = new Set();

  // Get the specific route matching the URL parameter
  let QueryString = window.location.search;
  let urlParams = new URLSearchParams(QueryString);
  let routeId = urlParams.get("route");
  route = routes.routes.find(r => r.id == routeId);

  populateFeaturesGrid();
  populateWarningsGrid();
  populateBasicsGrid();
  populateAccessGrid();
}

function populateBasicsGrid() {

}

function populateFeaturesGrid() {
  let featuresContent = "";
  for (let [name, detail] of interest.entries()) {
    let routeInterest = new Map(route.interest);
    if (routeInterest.has(name)) {
      let strongIndicator = "";
      if (routeInterest.get(name) == "strong") {
        strongIndicator = `<span class="strong-indicator">${detail.strong}</span><br />`;
      }
      featuresContent += `
        <div class="icon">
          <img src="/img/icons/${detail.icon}" class="icon-img" alt="" />
        </div>
        <div class="item-description">
          ${strongIndicator}
          <h4>${detail.text}</h4>${detail.description}
        </div>`;
    }
  }
  document.getElementById("features-grid").innerHTML = featuresContent;
}

function populateWarningsGrid() {
  let warningsContent = "";
  for (let [warningName, warningDetail] of warnings.entries()) {
    let description = warningDetail.description; // default generic text
    let routeWarnings = new Map(route.warnings);

    if ("notes" in route) {
      let routeNotes = new Map(route.notes);
      if (routeNotes.has(warningName)) {
        description = routeNotes.get(warningName);
      }
    }

    let strongIndicator = "";
    if (routeWarnings.has(warningName)) {
      if (routeWarnings.get(warningName) == "strong") {
        strongIndicator = `<span class="strong-indicator">${warningDetail.strong}</span><br />`;
      }
      warningsContent += `
        <div class="icon">
          <img src="/img/icons/${warningDetail.icon}" class="icon-img" alt="" />
        </div>
        <div class="item-description">
          ${strongIndicator}
          <h4>${warningDetail.text}</h4>${description}
        </div>`;
    }
  }

  // If there are dangers
  if ("dangers" in route) {
    let routeDangersContent = "";
    route.dangers.forEach(danger => routeDangersContent += `<p>${danger}</p>`);

    warningsContent += `
    <div class="icon">
      <img src="/img/icons/${categories.danger.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${categories.danger.text}</h4>${routeDangersContent}
    </div>`;
  }

  document.getElementById("warnings-grid").innerHTML = warningsContent;
}

function populateBasicsGrid() {
  // duration
  let d = duration.get(route.duration);
  let durationText = d.text;
  let durationIconUrl = `/img/icons/${d.icon}`;

  // effort
  let e = effort.get(route.effort);
  let effortText = e.text;
  let effortIconUrl = `/img/icons/${e.icon}`;
  let effortDescription = e.description;

  // type
  let t = walkType.get(route.walkType);
  let typeText = t.text;
  let typeIcon =  `/img/icons/${t.icon}`;
  let typeDescription = t.description;

  // refreshments
  let r = basics.get("refreshments");
  let refreshmentsText = r.text;
  let refreshmentsIcon =  `/img/icons/${r.icon}`;
  let refreshmentsDescription = r.description;
  
  let basicsContent = `
    <div class="route-metric">
      <p>${durationText}</p>
      <img src="${durationIconUrl}" alt="" />
    </div>
    <div>
      <h4>Distance</h4>
      ${route.lengthKm}km (${route.lengthMiles} miles)
    </div>
    <div class="route-metric">
      <p>${effortText}</p>
      <img src="${effortIconUrl}" alt="" />
    </div>
    <div>
      <h4>Effort</h4>
      ${effortDescription}
    </div>
    <div class="icon">
      <img src="${typeIcon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${typeText}</h4>
      ${typeDescription}
    </div>
    <div class="icon">
      <img src="${refreshmentsIcon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${refreshmentsText}</h4>
      ${refreshmentsDescription}
    </div>`;

    document.getElementById("basics-grid").innerHTML = basicsContent;
}

function populateAccessGrid() {
  let accessContent = `
    <div>1</div>
    <div>2</div>
    <div>3</div>`;
  document.getElementById("access-grid").innerHTML = accessContent;

}
