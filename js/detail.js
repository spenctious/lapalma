"use strict";

var route;
var routeInterest;
var routeWarnings;
var routeTerrain;
var routeNotes;

var thisRoute;

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
  // routeInterest = new Map(route.interest);
  // routeWarnings = new Map(route.warnings);
  // routeTerrain = new Map(route.terrain);
  // routeNotes = new Map(route.notes);

  thisRoute = new Route(route);

  // populate the various components with the current route data
  populateRouteDatail();
  populateFeaturesAndWarnings();
  populateBasics();
}

/************************* Grid populating functions ************************/

// N.B. The looping algorithms used ensure the order of entries is ddefined in the 
// category data to save having to ensure consistency through route data which would 
// be harder to maintain and reorder if required.

function populateBasics() {
  // summary grid
  // n.b. divs in the summary grid are explicitly positioned in CSS
  let summaryContent = "";
  summaryContent += `<div class="summary-heading">Basics</div>`;
  summaryContent += `<div><img src="/img/icons/chevron-down.svg" class="icon-img" alt="" /></div>`;
  summaryContent += getMetricIcon(thisRoute.duration);
  summaryContent += getMetricIcon(thisRoute.effort);
  summaryContent += getSummaryIcon(thisRoute.walkType.icon);
  if (thisRoute.accessCar.isPossible) summaryContent += getSummaryIcon(thisRoute.accessCar.icon);
  if (thisRoute.accessBus.isPossible) summaryContent += getSummaryIcon(thisRoute.accessBus.icon);
  document.getElementById("basics-summary").innerHTML = summaryContent;

  // basic stats
  let basicsContent = "";
  basicsContent += getMetricsHtml(thisRoute.duration);
  basicsContent += `<div><h4>Distance</h4>${thisRoute.lengthKm}km (${thisRoute.lengthMiles} miles)</div>`;
  basicsContent += getMetricsHtml(thisRoute.effort);
  basicsContent += `<div><h4>Effort</h4>${thisRoute.effort.description}</div>`;
  basicsContent += getFeatureHtml(thisRoute.walkType);
  basicsContent += getFeatureHtml(thisRoute.refreshments);
  document.getElementById("basics-grid").innerHTML = basicsContent;

  // access
  let accessContent = "";
  if (thisRoute.isCarAccessible) accessContent += getFeatureHtml(thisRoute.accessCar);
  if (thisRoute.isBusAccessible) accessContent += getFeatureHtml(thisRoute.accessBus);
  accessContent += getLocationHtml(thisRoute.start, "Start");
  accessContent += getLocationHtml(thisRoute.end, "End");
  document.getElementById("access-grid").innerHTML = accessContent;

  // trail status - waymarked and official trail statuses for each included path
  let trailContent = "";
  if (thisRoute.waymarking.isComplete) trailContent += getFeatureHtml(thisRoute.waymarking);
  let trailStatusContent = "";
  thisRoute.paths.forEach(path => trailStatusContent += getTrailStatusHtml(statuses.get(path), path));
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

  // terrain
  let terrainContent = "";
  thisRoute.terrain.forEach(thisTerrain => {
    terrainContent += getFeatureHtml(thisTerrain, getStrongHtml(thisTerrain.isStrong, thisTerrain.strong));
  })
  document.getElementById("terrain-grid").innerHTML = terrainContent;
}

function populateFeaturesAndWarnings() {
  // summary
  let summaryContent = `
    <div class="summary-heading">Features</div>
    <div class="summary-heading">Warnings</div>
    <div>
      <img src="/img/icons/chevron-down.svg" class="icon-img" alt="" />
    </div>`;
  summaryContent += getSummaryIconsContent(thisRoute.featuresInDisplayOrder);
  summaryContent += getSummaryIconsContent(thisRoute.warningsInDisplayOrder);
  document.getElementById("features-and-warnings-summary").innerHTML = summaryContent;

  // features
  let featuresContent = "";
  thisRoute.featuresInDisplayOrder.forEach( feature => {
    // handle special cases with additional content
    let additionalContent = "";
    switch (feature.type) {
      case "poi":
        thisRoute.poi.forEach( placeOfInterest => {
          additionalContent += `<p><a href="./poi.html?poi=${placeOfInterest.id}">${placeOfInterest.name}</a></p>`;
        });
      break;
    }
    featuresContent += getFeatureHtml(feature, additionalContent);
  });
  document.getElementById("features-grid").innerHTML = featuresContent;

  // warnings
  let warningsContent = "";
  thisRoute.warningsInDisplayOrder.forEach( warning => {
    warningsContent += getFeatureHtml(warning);
  });
  document.getElementById("warnings-grid").innerHTML = warningsContent;

  // dangers
  let dangersContent = "";
  let dangersList = "";
  thisRoute.dangers.forEach( danger => {
    dangersList += `
      <p>${getStrongHtml(danger.isStrong, danger.strong)}</p>
      <h4>${danger.name}</h4>
      <p>${danger.description}</p>`;
  });
  dangersContent += `
    <div class="icon">
      <img src="/img/icons/${categories.danger.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${dangersList}
    </div>`;
  document.getElementById("dangers-grid").innerHTML = dangersContent;
}

function populateRouteDatail() {

  // route title with srarred and favourite icons
  let starredIcon = "";
  if (thisRoute.starred.isSet) starredIcon = 
    `<div class="starred"><img src="/img/icons/${thisRoute.starred.icon}" alt="" /></div>`;
  let favouriteIcon = "";
  if (favourites.size > 0 && favourites.has(thisRoute.id)) favouriteIcon = 
    `<img class="favourite" src="/img/icons/heart-empty.svg" alt="" />`;
  let titleContent = `
    <h1>
      <span class="title-id">${thisRoute.id}</span>
      ${thisRoute.name}
      <span "title-starred">${starredIcon}</span>
      <span class="title-favourite">${favouriteIcon}</span>
    </div>
    `;
    document.getElementById("detail-title").innerHTML = titleContent;

  // variants (if any)
  let variantsContent = "";
  if (thisRoute.hasVariants) {
    thisRoute.variants.forEach(variant => variantsContent += getVatiantContent(variant));
  }

  // main body of detail
  let bodyContent = `
    <div>
      <div>${getDownloadButton(thisRoute.routeFile)}</div>
      <h2>Description</h2>
      <p>${thisRoute.description}</p>
      ${variantsContent}
    </div>`;
  document.getElementById("detail-body").innerHTML = bodyContent;
}

function getVatiantContent(variant) {
  // title
  let title = `<h2><span class="variant-title-id">${variant.id}</span>${variant.name}</h2>`;

  // summary
  let variantSummary = "";
  variantSummary += `<div class="route-metric"><img src="/img/icons/${variant.duration.icon}" alt="" /></div>`;
  variantSummary += `<div class="route-metric"><img src="/img/icons/${variant.effort.icon}" alt="" /></div>`;
  variantSummary += getSummaryIcon(variant.walkType.icon);
  if (variant.accessCar.isPossible) variantSummary += getSummaryIcon(variant.accessCar.icon);
  if (variant.accessBus.isPossible) variantSummary += getSummaryIcon(variant.accessBus.icon);

  // download content - only some variants will have additional files associated with them
  let downloadContent = variant.hasRouteFile ? `<div>${getDownloadButton(variant.routeFile)}</div>` : "";

  // directions - expand format to HTML
  let directions = "";
  if (variant.hasRouteDirections) {
    directions = "<p>" + variant.directions + "</p>";
    directions = directions.replaceAll("[", `<span class="route-id">`);
    directions = directions.replaceAll("]", `</span>`);
    directions = directions.replaceAll("(", `<span class="route-waypoints">`);
    directions = directions.replaceAll(")", `</span>`);
  }

  return `
    <div class="variant">
      <p>${title}</p>
      <div class="icon-summary">${variantSummary}</div>
      <p>${downloadContent}</p>
      ${directions}
      <p>${variant.description}</p>
    </div> `;
}

/************************* Helper functions ************************/

function getDownloadButton(fileName, isPrimary = true) {
  let downloadPath = routeFormat == "gpx" ? "/data/gpx/" : "/data/kml";
  let downloadTarget = downloadPath + fileName + "." + routeFormat;
  return `
    <span class="download-link ${isPrimary ? 'primary' : 'secondary'}">
      <img src="/img/icons/download.svg" alt="" />
      <a href="${downloadTarget}" download>Download route (${routeFormat.toUpperCase()} format)</a>
    </span>`;
}

function getSummaryIconsContent(itemList) {
  let iconsContent = "";
  for (let i = 0; i < 5; i++) {
    if (i > itemList.length) {
      // not enough icons to fill the grid - add blanks
      iconsContent += `<div></div>`;
    } else {
      if (i == 4 && itemList.length > 5) {
        // too many - indicate how many more
        iconsContent += `<div>+${itemList.length - 4}</div>`;
      }
      else {
        // add icon
        iconsContent += getSummaryIcon(itemList[i].icon);
      }
    }
  }
  return iconsContent;
}

function getFeatureOrWarningHtml(feature, additionalContent) {

  // add label if item is marked as strong
  let strongIndicator = "";
  if (routeCategory.get(itemName) == "strong") {
    strongIndicator = `<span class="strong-indicator">${itemDetail.strong}</span><br />`;
  }

  return getFeatureHtml(itemDetail.icon, itemDetail.text, description, strongIndicator, additionalContent);
}

function getStrongHtml(isStrong, strongText) {
  return isStrong ? `<span class="strong-indicator">${strongText}</span><br />` : "";
}

function getMetricsHtml(metric) {
  return `
    <div class="route-metric">
      <p>${metric.text}</p>
      <img src="/img/icons/${metric.icon}" alt="" />
    </div>`;
}

function getMetricIcon(metric) {
  return `
    <div class="route-metric">
      <img src="/img/icons/${metric.icon}" alt="" />
    </div>`;
}

function getSummaryIcon(icon) {
  return `
    <div class="summary-icon">
      <img src="/img/icons/${icon}" class="icon-img" alt="" />
    </div>`;
}

function getTrailStatusHtml(trailStatus, trailName) {
  return `
    <div class="trail-${trailStatus}">
      <p>
        <span class="trail-name">${trailName}</span>
        <span class="trail-status">${trailStatus.toUpperCase()}</span>
      </p>
    </div>`;
}

function getFeatureHtml(feature, additionalContent = "") {
  return `
    <div class="icon">
      <img src="/img/icons/${feature.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${getStrongHtml(feature.isStrong, feature.strong)}
      <h4>${feature.text}</h4>
      ${feature.description}
      ${additionalContent}
    </div>`;
}

function getLocationHtml(location, label) {
  let startCar = "parking" in location ? location.parking : "Inaccessible by car";
  let startBus = "Inaccessible by bus";
  if ("bus" in location) {
    startBus = `Bus stop: ${location.bus.stop}<br />`;
    location.bus.routes.forEach(busRoute => startBus += `<span class="bus-route">${busRoute}</span>`);
  }
  return `
    <div>
      <h4>${label}</h4>
    </div>
    <div class="item-description">
      <h4>${location.name}</h4>
      <p>${startCar}</p>
      <p>${startBus}</p>
    </div>`;
}
