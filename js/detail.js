"use strict";

var route;

// Wait for the page to load and the data to be read before trying to populate
// elements of the page
window.onload = function () {
  loadDataThen(initialize);
};

/************************* Initialization ************************/

function initialize() {
  // Get the specific route matching the URL parameter
  let QueryString = window.location.search;
  let urlParams = new URLSearchParams(QueryString);
  let routeId = urlParams.get("route");
  route = routes.routes.find(r => r.id == routeId);

  // populate the various components with the current route data
  populateFeaturesGrid();
  populateWarningsGrid();
  populateBasicsGrid();
  populateAccessGrid();
  populateTrailGrid();
}

/************************* Grid populating functions ************************/

// N.B. The looping algorithms used ensure the order of entries is ddefined in the 
// category data to save having to ensure consistency through route data which would 
// be harder to maintain and reorder if required.

function populateFeaturesGrid() {
  let routeInterest = new Map(route.interest);
  let routeNotes = new Map(route.notes);
  let featuresContent = getFeatureOrWarningHtml(interest, routeInterest, routeNotes);

  document.getElementById("features-grid").innerHTML = featuresContent;
}

function getFeatureOrWarningHtml(category, routeItems, notes) {
  let content = "";

  for (let [itemName, itemDetail] of category.entries()) {
    if (routeItems.has(itemName)) {
      let strongIndicator = "";
      let description = itemDetail.description;

      // overwrite the default generic description if there is a more specific note
      if ("notes" in route) {
        if (notes.has(itemName)) {
          description = notes.get(itemName);
        }
      }

      // add label if item is marked as strong
      if (routeItems.get(itemName) == "strong") {
        strongIndicator = `<span class="strong-indicator">${itemDetail.strong}</span><br />`;
      }

      content += `
        <div class="icon">
          <img src="/img/icons/${itemDetail.icon}" class="icon-img" alt="" />
        </div>
        <div class="item-description">
          ${strongIndicator}
          <h4>${itemDetail.text}</h4>${description}
        </div>`;
    }
  }
  return content;
}

function populateWarningsGrid() {

  let routeWarnings = new Map(route.warnings);
  let routeNotes = new Map(route.notes);
  let warningsContent = getFeatureOrWarningHtml(warnings, routeWarnings, routeNotes);

  // If there are dangers list them
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
  let basicsContent = "";

  // duration
  let d = duration.get(route.duration);
  let durationText = d.text;
  let durationIconUrl = `/img/icons/${d.icon}`;
  basicsContent += `
    <div class="route-metric">
      <p>${durationText}</p>
      <img src="${durationIconUrl}" alt="" />
    </div>
    <div>
      <h4>Distance</h4>
      ${route.lengthKm}km (${route.lengthMiles} miles)
    </div>`;

  // effort
  let e = effort.get(route.effort);
  let effortText = e.text;
  let effortIconUrl = `/img/icons/${e.icon}`;
  let effortDescription = e.description;
  basicsContent += `
    <div class="route-metric">
      <p>${effortText}</p>
      <img src="${effortIconUrl}" alt="" />
    </div>
    <div>
      <h4>Effort</h4>
      ${effortDescription}
    </div>`;

  // type
  let t = walkType.get(route.walkType);
  let typeText = t.text;
  let typeIcon = `/img/icons/${t.icon}`;
  let typeDescription = t.description;
  basicsContent += `
    <div class="icon">
      <img src="${typeIcon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${typeText}</h4>
      ${typeDescription}
    </div>`;

  // refreshments
  let r = basics.get("refreshments");
  let refreshmentsText = r.text;
  let refreshmentsIcon = `/img/icons/${r.icon}`;
  let refreshmentsDescription = r.description;
  basicsContent += `
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
  let accessContent = "";

  // car
  if (route.accessCar == "true") {
    let c = basics.get("accessCar");
    accessContent += `
      <div class="icon">
        <img src="/img/icons/${c.icon}" class="icon-img" alt="" />
      </div>
      <div class="item-description">
        <h4>${c.text}</h4>
        ${c.description}
      </div>`;
  }

  // bus
  if (route.accessBus == "true") {
    let b = basics.get("accessBus");
    accessContent += `
    <div class="icon">
      <img src="/img/icons/${b.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${b.text}</h4>
      ${b.description}
    </div>`;
  }

  // start and end points
  accessContent += getLocationHtml(route.start, "Start");
  accessContent += getLocationHtml(route.end, "End");

  document.getElementById("access-grid").innerHTML = accessContent;
}

// Helper function - same code for start and end point location data
function getLocationHtml(location, label) {
  let startName = location;
  let s = locationMap.get(startName);
  let startCar = "parking" in s ? s.parking : "Inaccessible by car";
  let startBus = "Inaccessible by bus";
  if ("bus" in s) {
    startBus = `Bus stop: ${s.bus.stop}<br />`;
    s.bus.routes.forEach(busRoute => startBus += `<span class="bus-route">${busRoute}</span>`);
  }
  return `
    <div>
      <h4>${label}</h4>
    </div>
    <div class="item-description">
      <h4>${startName}</h4>
      <p>${startCar}</p>
      <p>${startBus}</p>
    </div>`;
}

function populateTrailGrid() {
  let trailContent = "";
  let w = basics.get("waymarked");

  // waymarked
  if (route.waymarked == "true") {
    trailContent += `
    <div class="icon">
      <img src="/img/icons/${w.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${w.text}</h4>
      ${w.description}
    </div>`;
  }

  // official trail status
  let trailStatusContent = "";
  route.paths.forEach(path => {
    let status = statuses.get(path);
    trailStatusContent += `
    <div class="trail-${status}">
      <p>
        <span class="trail-name">${path}</span>
        <span class="trail-status">${status.toUpperCase()}</span>
      </p>
    </div>`;
  })
  trailContent += `
    <div>
      <h4>Status</h4>
    </div>
    <div class="item-description">
      <h4>Official trails</h4>
      <div class="official-trails">
        ${trailStatusContent}
      </div>
      <p>Note: Walks may also traverse paths not part of the official trail network.</p>
    </div>`;

  document.getElementById("trail-grid").innerHTML = trailContent;
}
