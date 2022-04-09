"use strict";

var route;
var routeId;
var collectionParam;
var collection;
var collectionIndex;

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

  // get the data for the specific route
  routeId = urlParams.get(URL_PARAM_ROUTE);
  route = laPalmaData.routes.get(routeId);
  document.getElementById("title").innerHTML = "Walk " + routeId;

  // get the list of routes selected by the current filters (if any)
  collectionParam = urlParams.get(URL_PARAM_COLLECTION);
  collection = collectionParam.split(',');
  collectionIndex = collection.findIndex(item => item == routeId);
  updateNavButtons();

  // populate the various components with the current route data
  populateRouteDatail();
  populateFeaturesAndWarnings();
  populateBasics();

  // add event listeners for the specified areas
  document.getElementById("collection-nav").addEventListener("click", navClickHandler);
}

function updateNavButtons() {
  document.getElementById("current").innerHTML = `${collectionIndex + 1} of ${collection.length}`;

  // single route - no navigation
  if (collection.length < 2) {
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    return;
  }

  // if at start of list previous button becomes jump to last
  let prev = collectionIndex == 0 ? "Last" : "&lsaquo;";
  document.getElementById("prev").innerHTML = prev;

  // if at end of list next button becomes jump to first
  let next = collectionIndex == collection.length - 1 ? "First" : "&rsaquo;";
  document.getElementById("next").innerHTML = next;
}

/************************* Click handlers ************************/

function navClickHandler(event) {
  let elementId = event.target.id;
  let lastIndex = collection.length - 1;
  
  if (elementId == "next") {
    routeId = collectionIndex == lastIndex ? collection[0] : collection[collectionIndex + 1];
    window.location.href = `./route-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}`;
  }

  if (elementId == "prev") {
    routeId = collectionIndex == 0 ? collection[lastIndex] : collection[collectionIndex - 1];
    window.location.href = `./route-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}`;
  }
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
  summaryContent += getMetricIconHtml(route.durationAttributes.icon);
  summaryContent += getMetricIconHtml(route.effortAttributes.icon);
  summaryContent += getSummaryIconHtml(route.walkTypeAttributes.icon);
  if (route.isAccessibleByCar) summaryContent += getSummaryIconHtml(route.accessCarAttributes.icon);
  if (route.isAccessibleByBus) summaryContent += getSummaryIconHtml(route.accessBusAttributes.icon);
  document.getElementById("basics-summary").innerHTML = summaryContent;

  // basic stats
  let basicsContent = "";
  basicsContent += getMetricsHtml(route.durationAttributes);
  basicsContent += `<div><h4>Distance</h4>${route.lengthKm}km (${route.lengthMiles} miles)</div>`;
  basicsContent += getMetricsHtml(route.effortAttributes);
  basicsContent += `<div><h4>Effort</h4>${route.effortAttributes.description}</div>`;
  basicsContent += getFeatureHtml(route.walkTypeAttributes);
  basicsContent += getFeatureHtml(route.refreshmentsAttributes);
  document.getElementById("basics-grid").innerHTML = basicsContent;

  // access
  let accessContent = "";
  if (route.isAccessibleByCar) accessContent += getAttributeHtml(route.accessCarAttributes);
  if (route.isAccessibleByBus) accessContent += getAttributeHtml(route.accessBusAttributes);
  accessContent += getLocationHtml(route.start, route.startAttributes, "Start");
  accessContent += getLocationHtml(route.end, route.endAttributes, "End");
  document.getElementById("access-grid").innerHTML = accessContent;

  // trail status - waymarked and official trail statuses for each included path
  let trailContent = "";
  if (route.isCompletelyWaymarked) trailContent += getAttributeHtml(route.waymarkedAttributes);
  let trailStatusContent = "";
  route.paths.forEach((status, path) => trailStatusContent += getTrailStatusHtml(status, path));
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
  route.terrain.forEach(attributes => {
    terrainContent += getFeatureHtml(attributes, getStrongHtml(attributes.isStrong, attributes.strongTag));
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
  summaryContent += getSummaryIconsContent(route.interest);
  summaryContent += getSummaryIconsContent(route.warnings);
  document.getElementById("features-and-warnings-summary").innerHTML = summaryContent;

  // features
  let featuresContent = "";
  route.interest.forEach((featureAttributes, featureName) => {
    // handle special cases with additional content
    let additionalContent = "";
    switch (featureName) {
      case "poi":
        if (route.hasPoi) {
          route.poi.forEach((placeOfInterest, id) => {
            additionalContent += `<p><a href="./poi.html?poi=${id}">${placeOfInterest.name}</a></p>`;
          });
        }
        break;
    }
    featuresContent += getFeatureHtml(featureAttributes, additionalContent);
  });
  document.getElementById("features-grid").innerHTML = featuresContent;

  // warnings
  let warningsContent = "";
  route.warnings.forEach(warning => {
    warningsContent += getFeatureHtml(warning);
  });
  document.getElementById("warnings-grid").innerHTML = warningsContent;

  // dangers
  let dangersContent = "";
  let dangersList = "";
  if (route.hasDangers) {
    route.dangers.forEach(danger => {
      dangersList += `
        <p>${getStrongHtml(danger.strength == "strong", laPalmaData.categories.danger.strong)}</p>
        <h4>${danger.name}</h4>
        <p>${danger.description}</p>`;
    });
  }
  else {
    dangersList = "No reported dangers."
  }
  dangersContent += `
    <div class="icon">
      <img src="/img/icons/${laPalmaData.categories.danger.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${dangersList}
    </div>`;
  document.getElementById("dangers-grid").innerHTML = dangersContent;
}

function populateRouteDatail() {
  // route title with srarred and favourite icons
  let starredIcon = "";
  if (route.isStarred) starredIcon =
    `<span class="starred"><img src="/img/icons/${route.starredAttributes.icon}" alt="" /></span>`;
  let favouriteIcon = "";
  if (favourites.size > 0 && favourites.has(route.id)) favouriteIcon =
    `<span class="favourite"><img src="/img/icons/heart-empty.svg" alt="" /></span>`;
  let titleContent = `
    <h1>
      <span class="title-id">${route.id}</span>
      ${route.name}
      ${starredIcon}
      ${favouriteIcon}
    </div>
    `;
  document.getElementById("detail-title").innerHTML = titleContent;

  // variants (if any)
  let variantsContent = "";
  if (route.hasVariants) {
    route.variants.forEach(variant => variantsContent += getVariantContent(variant));
  }

  // main body of detail
  let bodyContent = `
    <div>
      <div>${getDownloadButton(route.routeFile)}</div>
      <h2>Description</h2>
      <p>${route.description}</p>
      ${variantsContent}
    </div>`;
  document.getElementById("detail-body").innerHTML = bodyContent;
}

function getVariantContent(variant) {
  // title
  let title = `<h2><span class="variant-title-id">${variant.id}</span>${variant.name}</h2>`;

  // summary
  let variantSummary = "";
  variantSummary += `<div class="route-metric"><img src="/img/icons/${variant.durationAttributes.icon}" alt="" /></div>`;
  variantSummary += `<div class="route-metric"><img src="/img/icons/${variant.effortAttributes.icon}" alt="" /></div>`;
  variantSummary += getSummaryIconHtml(variant.walkTypeAttributes.icon);
  if (variant.isAccessibleByCar) variantSummary += getSummaryIconHtml(variant.accessCarAttributes.icon);
  if (variant.isAccessibleByBus) variantSummary += getSummaryIconHtml(variant.accessBusAttributes.icon);

  // download content - only some variants will have additional files associated with them
  let downloadContent = variant.hasRouteFile ? `<div>${getDownloadButton(variant.routeFile)}</div>` : "";

  // directions - expand format to HTML
  let directions = "";
  if (variant.hasRouteDirections) {
    directions = "<p>" + variant.routeDirections + "</p>";
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

/************************* HTML helper functions ************************/

function getDownloadButton(fileName, isPrimary = true) {
  let downloadPath = routeFormat == "gpx" ? "/data/gpx/" : "/data/kml";
  let downloadTarget = downloadPath + fileName + "." + routeFormat;
  return `
    <span class="download-link ${isPrimary ? 'primary' : 'secondary'}">
      <img src="/img/icons/download.svg" alt="" />
      <a href="${downloadTarget}" download>Download route (${routeFormat.toUpperCase()} format)</a>
    </span>`;
}

// list of icons up to a limit of 5 icons
// if there are more than 5 icons the last is replaced with a count of the number of additional icons
// if there are less than 5 icons, dummy divs are added to pad things out
function getSummaryIconsContent(itemsMap) {
  let iconsContent = "";
  let i = 1;
  itemsMap.forEach(attributes => {
    if (i == 5 && itemsMap.size > 5) {
      // too many - indicate how many more
      iconsContent += `<div>+${itemsMap.size - 4}</div>`;
    }
    else {
      // limit 5 icons
      if (i < 6) {
        // add icon
        iconsContent += getSummaryIconHtml(attributes.icon);
      }
    }
    ++i;
  })

  // pad out with blanks if there are not enough icons
  while (i++ < 6) iconsContent += `<div></div>`;

  return iconsContent;
}

// tags where some property is marked as strong
function getStrongHtml(isStrong, strongText) {
  return isStrong ? `<span class="strong-indicator">${strongText}</span><br />` : "";
}

// duration or effort icons with text label
function getMetricsHtml(metric) {
  return `
    <div class="route-metric">
      <p>${metric.text}</p>
      <img src="/img/icons/${metric.icon}" alt="" />
    </div>`;
}

// duration or effort icon without lext label
function getMetricIconHtml(icon) {
  return `
    <div class="route-metric">
      <img src="/img/icons/${icon}" alt="" />
    </div>`;
}

// individual icon in summary block
function getSummaryIconHtml(icon) {
  return `
    <div class="summary-icon">
      <img src="/img/icons/${icon}" class="icon-img" alt="" />
    </div>`;
}

// trail status lines
function getTrailStatusHtml(trailStatus, trailName) {
  return `
    <div class="trail-${trailStatus}">
      <p>
        <span class="trail-name">${trailName}</span>
        <span class="trail-status">${trailStatus.toUpperCase()}</span>
      </p>
    </div>`;
}

// standard feature description with icon, strong tag (if present), title, description
// and any additional content supplied
function getFeatureHtml(feature, additionalContent = "") {
  return `
    <div class="icon">
      <img src="/img/icons/${feature.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${getStrongHtml(feature.isStrong, feature.strongTag)}
      <h4>${feature.text}</h4>
      ${feature.description}
      ${additionalContent}
    </div>`;
}

// feature description without title or strong tag (used by eg. dangers list)
function getAttributeHtml(attributes) {
  return `
    <div class="icon">
      <img src="/img/icons/${attributes.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>${attributes.text}</h4>
      ${attributes.description}
    </div>`;
}

// location details
function getLocationHtml(locationName, locationAttributes, label) {
  let startCar = "parking" in locationAttributes ? locationAttributes.parking : "Inaccessible by car";
  let startBus = "Inaccessible by bus";
  if ("bus" in locationAttributes) {
    startBus = `Bus stop: ${locationAttributes.bus.stop}<br />`;
    locationAttributes.bus.routes.forEach(busRoute => startBus += `<span class="bus-route">${busRoute}</span>`);
  }
  return `
    <div>
      <h4>${label}</h4>
    </div>
    <div class="item-description">
      <h4>${locationName}</h4>
      <p>${startCar}</p>
      <p>${startBus}</p>
    </div>`;
}
