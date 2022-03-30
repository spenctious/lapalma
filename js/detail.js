"use strict";

var route;
var routeInterest;
var routeWarnings;
var routeTerrain;
var routeNotes;


// Wait for the page to load and the data to be read before trying to populate
// elements of the page
window.onload = function () {
  loadDataThen(initialize);
};

/************************* Initialization ************************/

function initialize() {
  // get the specific route matching the URL parameter
  let QueryString = window.location.search;
  let urlParams = new URLSearchParams(QueryString);
  let routeId = urlParams.get("route");

  // initialize maps for the current route data
  route = routes.routes.find(r => r.id == routeId);
  routeInterest = new Map(route.interest);
  routeWarnings = new Map(route.warnings);
  routeTerrain = new Map(route.terrain);
  routeNotes = new Map(route.notes);

  // populate the various components with the current route data
  populateFeaturesAndWarnings();
  populateBasics();
}

/************************* Grid populating functions ************************/

// N.B. The looping algorithms used ensure the order of entries is ddefined in the 
// category data to save having to ensure consistency through route data which would 
// be harder to maintain and reorder if required.

function populateBasics() {
  let basicsContent = "";
  let accessContent = "";
  let terrainContent = "";
  let trailContent = "";

  // N.B. Divs in the summary grid are explicitly positioned in CSS
  let summaryContent = `
    <div class="summary-heading">
      Basics
    </div>
    <div>
      <img src="/img/icons/chevron-down.svg" class="icon-img" alt="" />
    </div>`;

  // duration
  let d = duration.get(route.duration);
  summaryContent += `
    <div class="route-metric">
      <img src="/img/icons/${d.icon}" alt="" />
    </div>`;
  basicsContent += `
    <div class="route-metric">
      <p>${d.text}</p>
      <img src="/img/icons/${d.icon}" alt="" />
    </div>
    <div>
      <h4>Distance</h4>
      ${route.lengthKm}km (${route.lengthMiles} miles)
    </div>`;

  // effort
  let e = effort.get(route.effort);
  summaryContent += `
    <div class="route-metric">
      <img src="/img/icons/${e.icon}" alt="" />
    </div>`;
  basicsContent += `
    <div class="route-metric">
      <p>${e.text}</p>
      <img src="/img/icons/${e.icon}" alt="" />
    </div>
    <div>
      <h4>Effort</h4>
      ${e.description}
    </div>`;

  // type
  let t = walkType.get(route.walkType);
  summaryContent += getSummaryIcon(t.icon);
  basicsContent += getFeatureHtml(t.icon, t.text, t.description);

  // refreshments
  let r = basics.get("refreshments");
  basicsContent += getFeatureHtml(r.icon, r.text, r.description);

  // car
  if (route.accessCar == "true") {
    let c = basics.get("accessCar");
    summaryContent += getSummaryIcon(c.icon);
    accessContent += getFeatureHtml(c.icon, c.text, c.description);
  }

  // bus
  if (route.accessBus == "true") {
    let b = basics.get("accessBus");
    summaryContent += getSummaryIcon(b.icon);
    accessContent += getFeatureHtml(b.icon, b.text, b.description);
  }

  // start and end points
  accessContent += getLocationHtml(route.start, "Start");
  accessContent += getLocationHtml(route.end, "End");

  // waymarked
  if (route.waymarked == "true") {
    let w = basics.get("waymarked");
    trailContent += getFeatureHtml(w.icon, w.text, w.description);
  }

  // terrain
  routeTerrain.forEach( (terrainQuality, terrainType) => {
    let t = terrain.get(terrainType);

    let strongIndicator = "";
    if (terrainQuality == "strong") {
      strongIndicator = `<span class="strong-indicator">${t.strong}</span><br />`;
    }
  
    terrainContent += getFeatureHtml( t.icon, t.text, t.description, strongIndicator);
  })

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


  document.getElementById("basics-summary").innerHTML = summaryContent;
  document.getElementById("basics-grid").innerHTML = basicsContent;
  document.getElementById("access-grid").innerHTML = accessContent;
  document.getElementById("terrain-grid").innerHTML = terrainContent;
  document.getElementById("trail-grid").innerHTML = trailContent;
}

function populateFeaturesAndWarnings() {
  const FEATURE = true;
  const WARNING = false;
  let featuresContent = "";
  let warningsContent = "";
  let dangersContent = "";

  // N.B. Divs in the summary grid are explicitly positioned in CSS
  let featureIcons = new Array();
  let warningIcons = new Array();

  // views
  if (routeInterest.has("views")) {
    featuresContent += getFeatureOrWarningHtml("views", FEATURE);
    featureIcons.push(interest.get("views").icon);
  }

  // port
  if (routeInterest.has("port")) {
    featuresContent += getFeatureOrWarningHtml("port", FEATURE);
    featureIcons.push(interest.get("port").icon);
  }

  // poi
  if (routeInterest.has("poi")) {
    let poiList = "";
    route.poi.forEach( poiName => {
      let p = poi.get(poiName);
      poiList += `<p><a href="./poi.html?poi=${p.id}">${p.name}</a></p>`;
    });
    featuresContent += getFeatureOrWarningHtml("poi", FEATURE, poiList);
    featureIcons.push(interest.get("poi").icon);
  }

  // peaks
  if (routeInterest.has("peaks")) {
    featuresContent += getFeatureOrWarningHtml("peaks", FEATURE);
    featureIcons.push(interest.get("peaks").icon);
  }

  // archeological
  if (routeInterest.has("archeological")) {
    featuresContent += getFeatureOrWarningHtml("archeological", FEATURE);
    featureIcons.push(interest.get("archeological").icon);
  }

  // scenic
  if (routeInterest.has("scenic")) {
    featuresContent += getFeatureOrWarningHtml("scenic", FEATURE);
    featureIcons.push(interest.get("scenic").icon);
  }

  /** warnings */

  // slippery
  if (routeWarnings.has("slippery")) {
    warningsContent += getFeatureOrWarningHtml("slippery", WARNING);
    warningIcons.push(warnings.get("slippery").icon);
  }

  // steep
  if (routeWarnings.has("steep")) {
    warningsContent += getFeatureOrWarningHtml("steep", WARNING);
    warningIcons.push(warnings.get("steep").icon);
  }

  // vertigo
  if (routeWarnings.has("vertigo")) {
    warningsContent += getFeatureOrWarningHtml("vertigo", WARNING);
    warningIcons.push(warnings.get("vertigo").icon);
  }

  // weather
  if (routeWarnings.has("weather")) {
    let weatherLink = `<p><a href="./weather.html"></a><p>`;
    warningsContent += getFeatureOrWarningHtml("weather", WARNING, weatherLink);
    warningIcons.push(warnings.get("weather").icon);
  }

  // gps
  if (routeWarnings.has("gps")) {
    warningsContent += getFeatureOrWarningHtml("gps", WARNING);
    warningIcons.push(warnings.get("gps").icon);
  }

  // mountain
  if (routeWarnings.has("mountain")) {
    warningsContent += getFeatureOrWarningHtml("mountain", WARNING);
    warningIcons.push(warnings.get("mountain").icon);
  }

  // rockfall
  if (routeWarnings.has("rockfall")) {
    warningsContent += getFeatureOrWarningHtml("rockfall", WARNING);
    warningIcons.push(warnings.get("rockfall").icon);
  }

  let summaryContent = `
  <div class="summary-heading">Features</div>
  <div class="summary-heading">Warnings</div>
  <div>
    <img src="/img/icons/chevron-down.svg" class="icon-img" alt="" />
  </div>`;
  summaryContent += getSummaryIconsContent(featureIcons);
  summaryContent += getSummaryIconsContent(warningIcons);

  // dangers
  if ("dangers" in route) {
    let dangersList = "";
    route.dangers.forEach(d => {
      let strongIndicator = "";
      if (d.strength == "strong") {
        strongIndicator = `<span class="strong-indicator">${categories.danger.strong}</span><br />`;
      }
    
      dangersList += `
        <p>${strongIndicator}</p>
        <h4>${d.danger}</h4>
        <p>${d.description}</p>`;
    });
    dangersContent += `
      <div class="icon">
        <img src="/img/icons/${categories.danger.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${dangersList}
    </div>`;

    getFeatureHtml(categories.danger.icon, categories.danger.text, "", dangersList);
  }

  document.getElementById("features-grid").innerHTML = featuresContent;
  document.getElementById("warnings-grid").innerHTML = warningsContent;
  document.getElementById("dangers-grid").innerHTML = dangersContent;
  document.getElementById("features-and-warnings-summary").innerHTML = summaryContent;
}

function populateRouteDatail() {
  
}

/************************* Helper functions ************************/

function getSummaryIconsContent(iconArray) {
  let iconsContent = "";
  for (let i = 0; i < 5; i++) {
    if (i > iconArray.length) {
      // not enough icons to fill the grid - add blanks
      iconsContent += `<div></div>`;
    } else {
      if (i == 4 && iconArray.length > 5) {
        // too many - indicate how many more
        iconsContent += `<div>+${iconArray.length - 4}</div>`;
      }
      else {
        // add icon
        iconsContent += getSummaryIcon(iconArray[i]);
      }
    }
  }
  return iconsContent;
}

function getFeatureOrWarningHtml(itemName, isFeature, additionalContent) {
  // feature or warning?
  let itemDetail = isFeature ? interest.get(itemName) : warnings.get(itemName);
  let routeCategory = isFeature ? routeInterest : routeWarnings;

  // overwrite the default generic description if there is a more specific note
  let description = itemDetail.description;
  if ("notes" in route) {
    if (routeNotes.has(itemName)) {
      description = routeNotes.get(itemName);
    }
  }

  // add label if item is marked as strong
  let strongIndicator = "";
  if (routeCategory.get(itemName) == "strong") {
    strongIndicator = `<span class="strong-indicator">${itemDetail.strong}</span><br />`;
  }

  return getFeatureHtml(itemDetail.icon, itemDetail.text, description, strongIndicator, additionalContent);
}

function getSummaryIcon(icon) {
  return `
    <div class="summary-icon">
      <img src="/img/icons/${icon}" class="icon-img" alt="" />
    </div>`;
}

function getFeatureHtml(icon, text, description, strongIndicator = "", additionalContent = "") {
  return`
    <div class="icon">
      <img src="/img/icons/${icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${strongIndicator}
      <h4>${text}</h4>
      ${description}
      ${additionalContent}
    </div>`;
}

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
