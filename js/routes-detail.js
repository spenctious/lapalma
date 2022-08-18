"use strict";

// page globals set up in initialize()
var route;
var routeId;
var collectionParam;
var collection;
var collectionIndex;
var stepsBack = -1;

// Wait for the page to load and the data to be read before trying to populate
// elements of the page
window.onload = function () {
  loadDataThen(initialize);
};

/************************* Initialization ************************/

function initialize() {
  // get the specific route matching the URL parameter
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);

  // check URL for all required parameters
  let paramRoute = urlParams.get(URL_PARAM_ROUTE);
  let paramCollection = urlParams.get(URL_PARAM_COLLECTION);
  let papramSteps = urlParams.get(URL_PARAM_STEPS);

  // if parameters are missing, supply default data
  if (paramRoute == null || paramCollection == null) {
    paramRoute = "01";
    paramCollection = Array.from(laPalmaData.routes.keys()).toString();
    urlParams.set(URL_PARAM_ROUTE, paramRoute);
    urlParams.set(URL_PARAM_COLLECTION, paramCollection);
  }
  if (papramSteps == null) {
    papramSteps = "-1";
    urlParams.set(URL_PARAM_STEPS, papramSteps);
  }

  // get the data for the specific route and update the header
  routeId = paramRoute;
  route = laPalmaData.routes.find(r => r.id == routeId);
  document.getElementById("header-title").innerHTML = "Walk " + routeId;

  // get the list of routes selected by the current filters and
  // find our current position in it
  collectionParam = paramCollection;
  collection = collectionParam.split(',');
  collectionIndex = collection.findIndex(item => item == routeId);

  // get the number of steps to go back to the last page visited before the details page
  // NB: this number is updated as the user moves through the collection and is used by the on-page back button
  stepsBack = Number.parseInt(papramSteps);  

  // update the navigation bar or hide it altogether if there's only 1 route in the collection
  if (collection.length < 2) {
    document.getElementById("routes-collection-nav").style.display = "none";
  } else {
    document.getElementById("current").innerHTML = `${collectionIndex + 1} of ${collection.length}`;
  }

  // initialize POI detail modal
  let allPoi = new Array();
  if (route.hasPoi) route.poi.forEach(poi => allPoi.push(poi.id));
  initializePoiModal(allPoi);

  // populate the various components with the current route data
  populateRouteDetail();
  populateFeaturesAndWarnings();
  populateBasics();
  populateRouteImages();

  // add event listeners
  document.getElementById("content-grid").addEventListener("click", mainClickHandler);
  document.getElementById("routes-collection-nav").addEventListener("click", collectionClickHandler);
  document.getElementById("full-details").addEventListener("click", modalClickHandler);
  document.getElementById("back-nav").addEventListener("click", goBackToOrigin);
}



/************************* Click handlers ************************/


// handles clicks for the POI details modal
function modalClickHandler(event) {
  let id = event.target.id;

  // close the modal if the close button is clicked or the user
  // clicks anywhere outside the content area
  if (id == "modal-close" || id == "full-details") {
    closeModal();
    return;
  }

  let elementId = event.target.closest("div").id;
  if (elementId == "poi-next") {
    moveNext();
    return;
  }

  if (elementId == "poi-prev") {
    movePrevious();
    return;
  }
}


// handles the back arrow button in the header
function goBackToOrigin()
{
  // navigate back to the last non-details page visited
  window.history.go(stepsBack);
}


// handles clicks for the collection navigation bar
function collectionClickHandler(event) {
  let elementId = event.target.closest("div").id;
  let lastIndex = collection.length - 1;

  if (elementId == "next") {
    routeId = collectionIndex == lastIndex ? collection[0] : collection[collectionIndex + 1];
    window.location.href = `routes-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}&${URL_PARAM_STEPS}=${--stepsBack}`;
    return;
  }

  if (elementId == "prev") {
    routeId = collectionIndex == 0 ? collection[lastIndex] : collection[collectionIndex - 1];
    window.location.href = `routes-detail.html?${URL_PARAM_ROUTE}=${routeId}&${URL_PARAM_COLLECTION}=${collectionParam}&${URL_PARAM_STEPS}=${--stepsBack}`;
    return;
  }
}


// handles clicks for the main content area
function mainClickHandler(event) {
  let elementId = event.target.closest("div").id;

  // toggle favourites
  if (elementId == "favourite") {
    if (favourites.has(routeId)) {
      favourites.delete(routeId);
      event.target.src = "img/icons/heart-empty.svg";
    } else {
      favourites.add(routeId);
      event.target.src = "img/icons/heart-full-black.svg";
    }
    updateFavourites();
    return;
  }
  
  // replace basics summary with full details (expand)
  if (event.target.closest("#basics-summary") != null) {
    document.getElementById("basics-detail").style.display = "grid";
    document.getElementById("basics-summary").style.display = "none";
    return;
  }

  // replace basics full details with summary (collapse)
  if (event.target.closest("#basics-title")) {
    document.getElementById("basics-detail").style.display = "none";
    document.getElementById("basics-summary").style.display = "grid";
    return;
  }

  // replace features summary with full details (expand)
  if (event.target.closest("#features-and-warnings-summary") != null) {
    document.getElementById("features-and-warnings").style.display = "grid";
    document.getElementById("features-and-warnings-summary").style.display = "none";
    return;
  }

  // replace features full details with summary (collapse)
  if (event.target.closest("#features-title")) {
    document.getElementById("features-and-warnings").style.display = "none";
    document.getElementById("features-and-warnings-summary").style.display = "grid";
    return;
  }

  // clicking a POI link opens the POI details modal
  if (event.target.id.startsWith("poiLink")) {
    let poiId = event.target.id.replace("poiLink", "");
    openModal(poiId, false);
    return;
  }
}



/************************* Grid populating functions ************************/

// N.B. The looping algorithms used ensure the order of entries is defined in the 
// category data. This saves having to ensure consistency through route data which would 
// be harder to maintain and reorder if required.

// builds the content for the basic route data:
// - summary icon grid
// - basic route stats
// - route access info
// - trail status info for the official waymarked trails the route uses
// - route terrain info
//
function populateBasics() {
  // summary grid
  let summaryContent = "";
  summaryContent += `<div class="summary-heading">Basics and map</div>`;
  summaryContent += `<div class="chevron"><img src="img/icons/chevron-down.svg" class="icon-img" alt="" /></div>`;
  summaryContent += getMetricsHtml(route.durationAttributes);
  summaryContent += getMetricsHtml(route.effortAttributes);
  summaryContent += getSummaryIconHtml(route.walkTypeAttributes.icon);
  if (route.isAccessibleByCar) summaryContent += getSummaryIconHtml(laPalmaData.accessCarAttributes.icon);
  if (route.isAccessibleByBus) summaryContent += getSummaryIconHtml(laPalmaData.accessBusAttributes.icon);
  document.getElementById("basics-summary").innerHTML = summaryContent;

  // map
  let mapContent = "";
  mapContent += `
    <div class="icon">
      <img src="img/icons/map.svg" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      <p class="text-button">
        <a href="route-map.html?map=${route.id}">View the walk on a map</a>
      </p>
    </div>`;
    document.getElementById("map-grid").innerHTML = mapContent;

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
  basicsContent += getBasicFeatureHtml(laPalmaData.refreshmentsAttributes, route.refreshments);
  document.getElementById("basics-grid").innerHTML = basicsContent;

  // access
  let accessContent = "";
  if (route.isAccessibleByCar) accessContent += getSimpleAttributeHtml(laPalmaData.accessCarAttributes);
  if (route.isAccessibleByBus) accessContent += getSimpleAttributeHtml(laPalmaData.accessBusAttributes);
  if (route.start_name == route.finish_name) {
    accessContent += getLocationHtml(route.start_name, route.startAttributes, "Start<br/>& End");
  } else {
    accessContent += getLocationHtml(route.start_name, route.startAttributes, "Start");
    accessContent += getLocationHtml(route.finish_name, route.finishAttributes, "End");
  }
  document.getElementById("access-grid").innerHTML = accessContent;

  // trail status - waymarked and official trail statuses for each included path
  let trailContent = route.isCompletelyWaymarked ? getSimpleAttributeHtml(laPalmaData.waymarkedAttributes) : "";
  let trailStatusContent = "";
  if (route.hasTrails) {
    let errorContent = getErrorContent();
    if (errorContent == "") {
      trailStatusContent += `
          <p class="text-button">
            <p class="last-scraped">${getLastScraped()}<br />Tap route for details:</p>
          </p>`;

      route.trails.forEach(trail => trailStatusContent += getTrailStatusHtml(trail));
    } else {
      trailStatusContent += errorContent;
    }
  }
  trailContent += `
      <div>
        <p class="details-grid-attribute">Status</p>
      </div>
      <div class="item-description">
        <h4>
          <a href="https://www.senderosdelapalma.es/en/footpaths/situation-of-the-footpaths/" target="_blank">
            Official trail status
          </a>
        </h4>
        <div class="official-trails">
          ${trailStatusContent == "" ? "None" : trailStatusContent}
        </div>
      </div>
      `;
  document.getElementById("trail-grid").innerHTML = trailContent;

  // terrain
  let terrainContent = "";
  route.terrains.forEach(attributes => {
    terrainContent += getFeatureHtml(attributes);
  })
  document.getElementById("terrain-grid").innerHTML = terrainContent;
}


// builds the content for the route features and warnings:
// - summary icon block
// - list of features or alternative text if none
// - list of warnings or alternative text if none
// - list of dangers or alternative text if none
//
function populateFeaturesAndWarnings() {
  // summary
  let summaryContent = `
    <div class="summary-heading">Features and Warnings</div>
    <div class="chevron">
      <img src="img/icons/chevron-down.svg" class="icon-img" alt="" />
    </div>`;
  summaryContent += getSummaryIconsContent(route.interests);
  summaryContent += getSummaryIconsContent(route.warnings);
  if (route.hasDangers) {
    summaryContent += getSummaryIconHtml(laPalmaData.dangerAttributes.icon);
  }
  document.getElementById("features-and-warnings-summary").innerHTML = summaryContent;

  // features
  let featuresContent = route.interests.size == 0 ? 
  `<div></div><div class="item-description">No singificant features</div>` : "";
  route.interests.forEach(interest => {
    featuresContent += getFeatureHtml(interest, getAdditionalContent(interest.feature_name));
  })
  document.getElementById("features-grid").innerHTML = featuresContent;

  // warnings
  let warningsContent = route.warnings.size == 0 ? 
    `<div></div><div class="item-description">No reported warnings</div>` : "";
  route.warnings.forEach(warning => {
    warningsContent += getFeatureHtml(warning, getAdditionalContent(warning.feature_name));
  });
  document.getElementById("warnings-grid").innerHTML = warningsContent;

  // dangers
  let dangersContent = "";
  let dangersList = "";
  if (route.hasDangers) {
    route.dangers.forEach(danger => {
      dangersList += `
        <p>${getStrongHtml(danger.is_strong, laPalmaData.dangerAttributes.strong_tag)}</p>
        <h4>${danger.danger}</h4>
        <p>${danger.details}</p>`;
    });
  }
  else {
    dangersList = "No reported dangers."
  }
  dangersContent += `
    <div class="icon">
      <img src="img/icons/${laPalmaData.dangerAttributes.icon}" class="icon-img" alt="" />
    </div>
    <div class="item-description">
      ${dangersList}
    </div>`;
  document.getElementById("dangers-grid").innerHTML = dangersContent;
}

// builds the content for the route description and variants
// - title
// - icons for starred content and favourites
// - content for walk variations (if any)
//
function populateRouteDetail() {
  // route title with starred and favourite icons
  let starredIcon = "";
  if (route.isStarred) starredIcon =
    `<span class="starred"><img src="img/icons/${route.starredIcon}" alt="" /></span>`;
  let favouriteIcon = favourites.has(route.id) ? "heart-full-black.svg" : "heart-empty.svg";
  let titleContent = `
    <div class="title-id">${route.id}</div>
    <div><h1>${route.name}${starredIcon}</h1></div>
    <div id="favourite" class="favourite">
      <img src="img/icons/${favouriteIcon}" alt="" />
    </div>
    `;
  document.getElementById("detail-title").innerHTML = titleContent;

  // main body of detail
  let bodyContent = `
    <h3>Description</h3>
    <p>${route.description}</p>
    <h3>Route downloads</h3>
    <div class="button-box">${getDownloadButtons(route.route_file, route.id)}</div>`;

  // variants (if any)
  let variantsContent = `<h3>Walk variations</h3>`;
  if (route.hasVariants) {
    route.variants.forEach(variant => variantsContent += getVariantContent(variant));
  } else {
    variantsContent += `<p class="empty-state">None for this walk.</p>`;
  }
  bodyContent += variantsContent;

  document.getElementById("detail-body").innerHTML = bodyContent;
}


// builds the content for the route images (with captions)
function populateRouteImages() {
  let imagesContent = `
    <h3 id="col-head-pics">Trail photos</h3>
    <div class="trail-images">`;

  route.images.forEach(image => {
    imagesContent += `
    <div class="image-container">
        <img class="picture" src="img/${image.file_name}.webp" width="${image.width}" height="${image.height}" alt="" />
        <div class="caption">${image.caption}</div>
      </div>`;
  });

  imagesContent += `</div>`;

  document.getElementById("detail-images").innerHTML = imagesContent;
}


// builds the content for variant walks:
// - title
// - summary icon block for basic attributes
// - download content (if present)
// - route directions
//
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
  // assumes route files are named LP<2 digits><optional letter><space><name> 
  let downloadContent = "";
  if (variant.hasRouteFile) {
    let routeId = variant.route_file.slice(2,5).trim();
    downloadContent = `<div class="button-box">${getDownloadButtons(variant.route_file, routeId)}</div>`;
  }

  // directions - expand format to HTML
  // square braces enclose route ids, normal brackets enclose waypoint information
  let directions = "";
  directions = `<p class="directions">` + variant.directions + `</p>`;
  directions = directions.replaceAll("[", `<span class="route-id">Route `);
  directions = directions.replaceAll("]", `</span>`);
  directions = directions.replaceAll("(", `<span class="route-waypoints"> waypoints `);
  directions = directions.replaceAll(")", `</span>`);
  directions = directions.replaceAll("#", `<br/>`);

  return `
    <div class="variant">
      ${title}
      <div class="icon-summary">${variantSummary}</div>
      <p>${variant.description}</p>
      <h3>Directions and additional downloads</h3>
      ${directions}
      ${downloadContent}
    </div> `;
}



/************************* HTML helper functions ************************/

// builds a button group for GPX and KML route type download buttons with icons
function getDownloadButtons(fileName, routeId) {
  return `
    <div class="button primary">
      <a href="data/gpx/${fileName}.gpx" download>
        <img src="img/icons/download.svg" alt="" />
        <p>Route ${routeId} <span class="format">GPX</span></p>
        <p class="format">(most apps)</p>
      </a>
    </div>
    <div class="button secondary">
      <a href="data/kml/${fileName}.kml" download>
        <img src="img/icons/download.svg" alt="" />
        <p>Route ${routeId} <span class="format">KML</span></p>
        <p class="format">(Google Earth)</p>
      </a>
    </div>`;
}


// list of icons
function getSummaryIconsContent(itemsArray) {
  let iconsContent = "";
  itemsArray.forEach(item => {
    let category = laPalmaData.categories.find(c => c.name == item.feature_name);
    iconsContent += getSummaryIconHtml(category.icon);
  });

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
      <img src="img/icons/${metric.icon}" alt="" />
    </div>`;
}


// duration or effort icon without lext label
function getMetricIconHtml(icon) {
  return `
    <div class="route-metric">
      <img src="img/icons/${icon}" alt="" />
    </div>`;
}


// individual icon in summary block
function getSummaryIconHtml(icon) {
  return `
    <div class="summary-icon">
      <img src="img/icons/${icon}" class="icon-img" alt="" />
    </div>`;
}



// N.B. anything not an anomaly is a fatal error of which there should be only one
function getErrorContent() {
  let errorContent = "";
  let mainMessage = "";
  let additionalMessage = "";

  let fatalError = trailStatuses.problems.find(e => e.type != "Anomaly");

  if (fatalError != undefined) {
    switch (fatalError.type) {
      case "Exception":
        mainMessage = "Error reading website";
        additionalMessage = "Try the main link above or refresh the page.";
        break;
      case "Timeout":
        mainMessage = "Timed out";
        additionalMessage = "Try the main link above or refresh the page.";
        break;
      case "DataError":
        mainMessage = "No trail status data";
        additionalMessage = "The trail network as a whole is probably closed. Check the 'Official trail status' link above.";
        break;
    }
    console.log(
      `Fatal error reading trails:
        Type: ${fatalError.Type}
        Message: ${fatalError.errorMessage}
        Detail: ${fatalError.detail}`
        );

    errorContent = `
    <div class="trail-error">
      <p class="trail-red">${mainMessage}</p>
      <p class="trail-link-prompt">${additionalMessage}</p>
    </div>`;
  }

  return errorContent;
}

// approx elapsed time since the trail status website was checked
function getLastScraped() {
  const msPerHour = 60 * 60 * 1000;
  let lastScraped = new Date(trailStatuses.lastScraped);
  let elapsedHours = Math.abs(lastScraped - Date.now()) / msPerHour;

  if (elapsedHours < 1) return "Last checked: just now";
  return `Last checked about ${Math.round(elapsedHours).toString()}h ago.`;
}


// trail status lines
function getTrailStatusHtml(trailName) {
  // defaults
  let trailUrl = "https://www.senderosdelapalma.es/en/footpaths/list-of-footpaths/";
  let trailStatus = "Not found";
  let trailClass = "trail-red";
  let message = "";
  let additionalInfo = "";

  // look for the trail in the status return from the API
  let matchedTrail = trailStatuses.trails.find(t => t.name == trailName);
  if (matchedTrail != undefined) {
    trailUrl = matchedTrail.url;
    trailStatus = matchedTrail.status;
  }

  // set CSS class and message
  switch (trailStatus) {
    case "Open":
      trailClass = "trail-green";
      break;
    case "Part open":
      trailClass = "trail-amber";
      message = "Check before starting walk";
      break;
    case "Closed":
      trailClass = "trail-red";
      break;
    case "Unknown":
      trailClass = "trail-amber";
      message = "Check 'Official trails' link above";
      break;
    case "Not found":
      trailClass = "trail-red";
      message = "Trail not found";
      break;
    default:
      trailClass = "trail-red";
      message = "Internal error";
    break;
  }

  if (message.length > 0) {
    additionalInfo = `<br /><span class="trail-link-prompt">${message}</span>`;
  }

  // remove leading zeros and translate into English
  trailName = trailName.replace(' 0', ' ');
  trailName = trailName.replace("Etapa", "Stage");

  return `
    <a href=${trailUrl} target="_blank" class="trail-link">
      <div class="${trailClass}">
        <p>
          <span>${trailName}</span>
          <span class="trail-status">${trailStatus.toUpperCase()}</span>
          ${additionalInfo}
        </p>
      </div>
    </a>`;
}


// standard feature description with icon, strong tag (if present), title, description
// and any additional content supplied
function getFeatureHtml(feature, additionalContent = "") {
  return getAttributeHtml(
    feature.icon, 
    feature.label, 
    feature.description, 
    getStrongHtml(feature.is_strong, feature.strong_tag),
    additionalContent);
}


// gets the additional content for specific features and warnings
// - POI links that open up the POI detail modal
// - Links to the weather forecast page
//
function getAdditionalContent(featureName) {
  let additionalContent = "";
  switch (featureName) {
    // list of links that open up a modal for the POI
    case "poi":
      if (route.hasPoi) {
        route.poi.forEach(poi => {
          additionalContent += `<p class="text-button" id="poiLink${poi.id}">${poi.short_name}</p>`;
        });
      }
      break;
      
    // link to the forecasts page
    case "weather":
      additionalContent += `<a href="forecasts.html">Check the weather</a>`;
      break;
  }
  return additionalContent;
}


// feature description for basic items that are not metrics (walk type, refreshments)
function getBasicFeatureHtml(feature, description) {
  return getAttributeHtml(feature.icon, feature.text, description);
}


// feature description without title or strong tag (used by eg. dangers list)
function getSimpleAttributeHtml(attributes) {
  return getAttributeHtml(attributes.icon, attributes.text, attributes.description);
}


// generic html for attributes:
// - icon for attribute type
// - description
// - tag if the content is marked up as being particularly strong
// - any additional content
//
function getAttributeHtml(icon, text, description, strong = "", additionalContent = "", iconClass = "") {
  return `
    <div class="icon">
      <img src="img/icons/${icon}" class="icon-img" alt="" />
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


// location details:
// - notes (if present)
// - parking info or a note that the location is inaccessible by car
// - bus routes and stop as a link to the bus section of the transport page
//    or note that the location is not accessible by bus
// - taxi info (if present)
// 
function getLocationHtml(locationName, locationAttributes, label) {
  let notesHtml = "notes" in locationAttributes ? `<p>${locationAttributes.notes}</p>`: ""
  let carHtml = "parking" in locationAttributes ? locationAttributes.parking : "Inaccessible by car";
  let busHtml = `Inaccessible by bus`;
  let busNotes = "";
  let taxiHtml = "taxi" in locationAttributes ? `<p><strong>Taxi</strong>: ${locationAttributes.taxi}</p>` : "";
  if ("bus" in locationAttributes) {
    if ("notes" in locationAttributes.bus) {
      busNotes = locationAttributes.bus.notes;
    }

    let plural = locationAttributes.bus.routes.includes(',') ? "s" : "";
    busHtml = `
      <span class="text-button">
        <a href="transport.html#routes">
        ${locationAttributes.bus.stop}, route${plural} ${locationAttributes.bus.routes}
      </a></span>`;
  }
  return `
    <div>
      <p class="details-grid-attribute">
        ${label}
      </p>
    </div>
    <div class="item-description">
      <h4>${locationName}</h4>
      ${notesHtml}
      <p class="map-links">
        <a href=${locationAttributes.googleMapLink} target="_blank">Satellite</a>
        &ensp;
        <a href=${locationAttributes.osmMapLink} target="_blank">Map</a>      
      </p>
      <p><strong>Parking:</strong> ${carHtml}</p>
      ${taxiHtml}
      <p><strong>Bus:</strong> ${busHtml}</p>
      ${busNotes}
    </div>`;
}
