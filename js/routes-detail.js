"use strict";

var route;
var routeId;
var collectionParam;
var collection;
var collectionIndex;

var detailsModal;


// Wait for the page to load and the data to be read before trying to populate
// elements of the page
window.onload = function () {
  loadDataThen(initialize);
};

/************************* Initialization ************************/

function initialize() {
  detailsModal = document.getElementById("full-details");

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

  // update the navigation bar - no need for nav buttons for single route collections
  document.getElementById("current").innerHTML = `${collectionIndex + 1} of ${collection.length}`;
  if (collection.length < 2) {
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
  }

  // populate the various components with the current route data
  populateRouteDatail();
  populateVariations();
  populateFeaturesAndWarnings();
  populateBasics();
  populateRouteImages();

  // add event listeners for the specified areas
  document.getElementById("content-grid").addEventListener("click", mainClickHandler);
  detailsModal.addEventListener("click", modalClickHandler);
}

/************************* Click handlers ************************/

// close the modal if the close button is clicked or the user
// clicks anywhere outside the content area
function modalClickHandler(event) {
  let id = event.target.id;
  if (id == "modal-close" || id == "full-details") {
    detailsModal.style.display = "none";
    return;
  }
}

function mainClickHandler(event) {
  let elementId = event.target.closest("div").id;
  let lastIndex = collection.length - 1;
  
  if (elementId == "next") {
    routeId = collectionIndex == lastIndex ? collection[0] : collection[collectionIndex + 1];
    window.location.href = `./route-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}`;
  }

  if (elementId == "prev") {
    routeId = collectionIndex == 0 ? collection[lastIndex] : collection[collectionIndex - 1];
    window.location.href = `./route-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}`;
  }

  if (event.target.closest("#basics-summary") != null) {
    document.getElementById("basics-detail").style.display = "grid";
    document.getElementById("basics-summary").style.display = "none";
    return;
  }

  if (event.target.closest("#basics-title")) {
    document.getElementById("basics-detail").style.display = "none";
    document.getElementById("basics-summary").style.display = "grid";
    return;
  }

  if (event.target.closest("#features-and-warnings-summary") != null) {
    document.getElementById("features-and-warnings").style.display = "grid";
    document.getElementById("features-and-warnings-summary").style.display = "none";
    return;
  }

  if (event.target.closest("#features-title")) {
    document.getElementById("features-and-warnings").style.display = "none";
    document.getElementById("features-and-warnings-summary").style.display = "grid";
    return;
  }

  if (event.target.id.startsWith("poiLink")) {
    let poiId = event.target.id.replace("poiLink", "");
    document.getElementById("poi-full-details").innerHTML = getFullPoiDetails(getPoi(poiId));
    detailsModal.style.display = "block";
  }
}

/************************* Grid populating functions ************************/

// N.B. The looping algorithms used ensure the order of entries is ddefined in the 
// category data to save having to ensure consistency through route data which would 
// be harder to maintain and reorder if required.

function populateBasics() {
  // summary grid
  let summaryContent = "";
  summaryContent += `<div class="summary-heading">Basics</div>`;
  summaryContent += `<div class="chevron"><img src="/img/icons/chevron-down.svg" class="icon-img" alt="" /></div>`;
  summaryContent += getMetricsHtml(route.durationAttributes);
  summaryContent += getMetricsHtml(route.effortAttributes);
  summaryContent += getSummaryIconHtml(route.walkTypeAttributes.icon);
  if (route.isAccessibleByCar) summaryContent += getSummaryIconHtml(route.accessCarAttributes.icon);
  if (route.isAccessibleByBus) summaryContent += getSummaryIconHtml(route.accessBusAttributes.icon);
  document.getElementById("basics-summary").innerHTML = summaryContent;

  // basic stats
  let basicsContent = "";
  basicsContent += getMetricsHtml(route.durationAttributes);
  basicsContent += `
    <div class="item-description">
      <h4>Distance</h4>
      <p>${route.lengthKm}km (${route.lengthMiles} miles)</p>
      <h4>Walking time</h4>
      <p>${route.walkingTime}</p>
    </div>`;
  basicsContent += getMetricsHtml(route.effortAttributes);
  basicsContent += `<div class="item-description"><h4>Effort</h4>${route.effortAttributes.description}</div>`;
  basicsContent += getBasicFeatureHtml(route.walkTypeAttributes, route.walkTypeAttributes.description);
  basicsContent += getBasicFeatureHtml(route.refreshmentsAttributes, route.refreshments);
  document.getElementById("basics-grid").innerHTML = basicsContent;

  // access
  let accessContent = "";
  if (route.isAccessibleByCar) accessContent += getSimpleAttributeHtml(route.accessCarAttributes);
  if (route.isAccessibleByBus) accessContent += getSimpleAttributeHtml(route.accessBusAttributes);
  if (route.start == route.end) {
    accessContent += getLocationHtml(route.start, route.startAttributes, "Start<br/>& End");
  } else {
    accessContent += getLocationHtml(route.start, route.startAttributes, "Start");
    accessContent += getLocationHtml(route.end, route.endAttributes, "End");
  }
  document.getElementById("access-grid").innerHTML = accessContent;

  // trail status - waymarked and official trail statuses for each included path
  let trailContent = "";
  if (route.isCompletelyWaymarked) {
    trailContent += getSimpleAttributeHtml(route.waymarkedAttributes);
  } else {
    trailContent += getAttributeHtml(
      route.waymarkedAttributes.icon, 
      "Not fully waymarked",
      "Some sections of trail are not on the official footpath network.");
  }
  let trailStatusContent = "";
  route.paths.forEach((status, path) => trailStatusContent += getTrailStatusHtml(status, path));
  trailContent += `
      <div>
        <p class="details-grid-attribute">Status</p>
      </div>
      <div class="item-description">
        <h4>Official trails</h4>
        <div class="official-trails">
          ${trailStatusContent}
        </div>
      </div>`;
  document.getElementById("trail-grid").innerHTML = trailContent;

  // terrain
  let terrainContent = "";
  route.terrain.forEach(attributes => {
    terrainContent += getFeatureHtml(attributes);
  })
  document.getElementById("terrain-grid").innerHTML = terrainContent;
}

function populateFeaturesAndWarnings() {
  // summary
  let summaryContent = `
    <div class="summary-heading">Features and Warnings</div>
    <div class="chevron">
      <img src="/img/icons/chevron-down.svg" class="icon-img" alt="" />
    </div>`;
  summaryContent += getSummaryIconsContent(route.interest);
  summaryContent += getSummaryIconsContent(route.warnings);
  if (route.hasDangers) {
    summaryContent += getSummaryIconHtml(laPalmaData.categories.danger.icon);
  }
  document.getElementById("features-and-warnings-summary").innerHTML = summaryContent;

  // features
  let featuresContent = route.interest.size == 0 ? 
  `<div></div><div class="iten-description">No singificant features</div>` : "";
  route.interest.forEach((featureAttributes, featureName) => {
    // handle special cases with additional content
    let additionalContent = "";
    switch (featureName) {
      case "poi":
        if (route.hasPoi) {
          route.poi.forEach((placeOfInterest, id) => {
            additionalContent += `<p id="poiLink${id}">${placeOfInterest.name}</p>`;
          });
        }
        break;
    }
    featuresContent += getFeatureHtml(featureAttributes, additionalContent);
  });
  document.getElementById("features-grid").innerHTML = featuresContent;

  // warnings
  let warningsContent = route.warnings.size == 0 ? 
    `<div></div><div class="iten-description">No reported warnings</div>` : "";
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
  // route title with starred and favourite icons
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

  // main body of detail
  let bodyContent = `
    <h3>Description</h3>
    <p>${route.description}</p>
    <h3>Route downloads</h3>
    <div class="downloads">${getDownloadButtons(route.routeFile, route.id)}</div>`;

  document.getElementById("detail-body").innerHTML = bodyContent;
}

function populateVariations() {
  // variants (if any)
  let variantsContent = `<h3 id="col-head-variants">Walk variations</h3>`;
  if (route.hasVariants) {
    route.variants.forEach(variant => variantsContent += getVariantContent(variant));
  } else {
    variantsContent += `<p>None for this walk.</p>`;
  }

  document.getElementById("variations").innerHTML = variantsContent;
}

function populateRouteImages() {
  let imagesContent = `<h3 id="col-head-pics">Trail photos</h3>`;

  route.images.forEach(image => {
    imagesContent += `
    <div class="image-container">
        <img class="picture" src="/img/route${route.id}-${image.id}-1200.jpg" alt="" />
        <div class="caption">${image.caption}</div>
      </div>`;
  })

  document.getElementById("detail-images").innerHTML = imagesContent;
}

function getVariantContent(variant) {
  // title
  let title = `
    <div class="variant-title">
      <div><span class="variant-title-id">${variant.id}</span></div>
      <div>${variant.name}</div>
    </div>`;

  // summary
  let variantSummary = "";
  variantSummary += getMetricsHtml(variant.durationAttributes);
  variantSummary += getMetricsHtml(variant.effortAttributes);
  variantSummary += getSummaryIconHtml(variant.walkTypeAttributes.icon);
  if (variant.isAccessibleByCar) variantSummary += getSummaryIconHtml(variant.accessCarAttributes.icon);
  if (variant.isAccessibleByBus) variantSummary += getSummaryIconHtml(variant.accessBusAttributes.icon);

  // download content - only some variants will have additional files associated with them
  let downloadContent = variant.hasRouteFile ? 
    `<div class="downloads">${getDownloadButtons(variant.routeFile, variant.id)}</div>` : "";

  // directions - expand format to HTML
  // square braces enclose route ids, normal brackets enclose waypoint information
  let directions = "";
  if (variant.hasRouteDirections) {
    directions = `<p class="directions">` + variant.routeDirections + `</p>`;
    directions = directions.replaceAll("[", `<span class="route-id">Route `);
    directions = directions.replaceAll("]", `</span>`);
    directions = directions.replaceAll("(", `<span class="route-waypoints"> waypoints `);
    directions = directions.replaceAll(")", `</span>`);
  }

  return `
    <div class="variant">
      ${title}
      <div class="icon-summary">${variantSummary}</div>
      <p>${variant.description}</p>
      <h3>Downloads and directions</h3>
      ${directions}
      ${downloadContent}
    </div> `;
}

/************************* HTML helper functions ************************/

function getDownloadButtons(fileName, routeId) {
  return `
    <div class="download-link primary">
      <a href="/data/gpx/${fileName}.gpx" download>
        <img class="invert" src="/img/icons/download.svg" alt="" />
        <p>Route ${routeId} <span class="format">GPX</span></p>
        <p class="format">(most apps)</p>
      </a>
    </div>
    <div class="download-link secondary">
      <a href="/data/kml/${fileName}.kml" download>
        <img src="/img/icons/download.svg" alt="" />
        <p>Route ${routeId} <span class="format">KML</span></p>
        <p class="format">(Google Earth)</p>
      </a>
    </div>`;
}

// list of icons
function getSummaryIconsContent(itemsMap) {
  let iconsContent = "";
  itemsMap.forEach(attributes => iconsContent += getSummaryIconHtml(attributes.icon));
  return iconsContent;
}

// tags where some property is marked as strong
function getStrongHtml(isStrong, strongText) {
  return isStrong ? `<span class="strong-indicator">${strongText}</span>` : "";
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
  return getAttributeHtml(
    feature.icon, 
    feature.text, 
    feature.noteModifiedDescription, 
    getStrongHtml(feature.isStrong, feature.strongTag),
    additionalContent);
}

// feature description for basic items that are not metrics (walk type, refreshments)
function getBasicFeatureHtml(feature, description) {
  return getAttributeHtml(feature.icon, feature.text, description);
}

// feature description without title or strong tag (used by eg. dangers list)
function getSimpleAttributeHtml(attributes) {
  return getAttributeHtml(attributes.icon, attributes.text, attributes.description);
}

// generic html for attributes
function getAttributeHtml(icon, text, description, strong = "", additionalContent = "") {
  return `
    <div class="icon">
      <img src="/img/icons/${icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <h4>
        ${strong}
        ${text}
      </h4>
      <p>${description}</p>
      ${additionalContent}
    </div>`;
}

// location details
function getLocationHtml(locationName, locationAttributes, label) {
  let carHtml = "parking" in locationAttributes ? locationAttributes.parking : "Inaccessible by car";
  let busHtml = "Inaccessible by bus";
  if ("bus" in locationAttributes) {
    let plural = locationAttributes.bus.routes.length > 1 ? "s" : "";
    busHtml = `
      <a href="/transport.html">
        Bus stop <span class="bus-route">${locationAttributes.bus.stop}</span> on route${plural} `;
    locationAttributes.bus.routes.forEach(busRoute => busHtml += `<span class="bus-route">${busRoute}</span>, `);
    busHtml = busHtml.slice(0, -2); // remove trailing comma and space
    busHtml += `</a>`;
  }
  return `
    <div>
      <p class="details-grid-attribute">${label}</p>
    </div>
    <div class="item-description">
      <h4>${locationName}</h4>
      ${carHtml}
      <p class="text-button">${busHtml}</p>
    </div>`;
}