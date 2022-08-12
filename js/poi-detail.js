"use strict";

//
// common content to display a modal screen for POI detail content
// used by poi-browse and routes-detail
//
// N.B assumes data.js has been loaded as the URL params come from there
//

// the list of POI the modal can page through and a pointer to the current
// POI in that collection
var poiCollection;
var poiCollectionIndex;

// content elements in the modal that get updated
var detailsModal;
var detailsModalContent;
var detailsModalCurrent;

// boolean that determines if the related walks button is displayed in the modal or not
// when the modal is used on the routes-detail screen the button is hidden
var showRelatedWalks;


// initial set-up
function initializePoiModal(initialPoiCollection) {
  poiCollection = initialPoiCollection;
  poiCollectionIndex = 0;
  detailsModal = document.getElementById("full-details");
  detailsModalContent = document.getElementById("poi-full-details");
}


// opens the modal over the tinted overlay
function openModal(poiId, overlayOnPoiGrid = true) {
  showRelatedWalks = overlayOnPoiGrid;
  poiCollectionIndex = poiCollection.findIndex(item => item == poiId);
  updateCurrent();
  detailsModal.style.display = "block";

  // prevent body scrolling while modal is open - mainly for mobile
  document.body.classList.add("body-stop-scroll");
}


// update the modal to the POI indicated by poiCollectionIndex
function updateCurrent() {
  detailsModalContent.innerHTML = getFullPoiDetails(getPoi(poiCollection[poiCollectionIndex]));
  detailsModalCurrent = document.getElementById("poi-current");
  detailsModalCurrent.innerHTML = `${poiCollectionIndex + 1} of ${poiCollection.length}`;
}


// close the POI details modal
function closeModal() {
  detailsModal.style.display = "none";

  // allow body scrolling again
  document.body.classList.remove("body-stop-scroll");
}


// move to the next POI in the collection or the first if at the last
function moveNext() {
  if (++poiCollectionIndex == poiCollection.length) poiCollectionIndex = 0;
  updateCurrent();
}


// move to the previous POI in the collection or the last POI if at the first
function movePrevious() {
  if (--poiCollectionIndex < 0) poiCollectionIndex = poiCollection.length - 1;
  updateCurrent();
}

// find the POI details from the id 
// (the JS map is indexed by POI name, not id)
function getPoi(poiId) {
  let poi = undefined;
  for (let p of laPalmaData.poi.values()) {
    if (p.id == poiId) {
      poi = p;
      break;
    }
  }
  return poi;
}


// builds the POI detail content:
// - title
// - image
// - tags
// - description
// - location description and links to maps
// - telephone number (if relevant)
// - email link (if relevant)
// - website link (if relevant)
// - entry cost (if relevant)
// - opening hours (if relevant)
// - button link to related walks (if required)
// - navigation bar to page through the filtered POI collection
//
function getFullPoiDetails(poi) {
  let tel = poi.hasTel ? `<tr><td>Tel:</td><td>${poi.tel}</td></tr>` : "";
  let email = poi.hasEmail ? 
    `<tr><td>Email:</td><td>
    <a href="mailto:${poi.email}" target="_blank">${poi.email}</a>
    </td></tr>` 
    : "";
  let web = poi.hasWeb ? 
    `<tr><td>Web:</td><td>
    <a href="${poi.web_address}" target="_blank">${poi.web_name}</a>
    </td></tr>` 
    : "";
  let entryCost = poi.hasEntryCost ? `<tr><td>Cost:</td><td>${poi.entry_cost}</td></tr>` : "";
  let openingTimes = poi.hasOpeningTimes ? getOpeningTimesHtml(poi.opening_times) : "";
  let relatedRoutes = showRelatedWalks && poi.hasRelatedWalks ? 
    `<div class="button-box">${getRelatedRoutesHtml(poi)}</div>` : "";
  let disableNavClass = poi.length == 1 ? "disable-nav" : "";

  // build html content
  return `
    <div class="modal-title">
      <span id="modal-close" class="close">&times;</span>
      Point of interest
    </div>
    <div class="modal-content-wrapper">
      <div class="poi-title">${poi.full_name}</div>
      <div class="poi-detail-pic">
        <img src="img/${poi.main_image.file_name}.webp" width=${poi.main_image.width} height=${poi.main_image.height} alt="" />
      </div>
      <div class="tags">
        ${getTagsHtml(poi.tags)}
      </div>
      <div class="extra-detail">
        <p class="description">
          ${poi.description}
        </p>
        <table class="general-details">
          <tr>
            <td>Location:</td>
            <td>
              ${poi.location_description}
              <p class="map-links">
                <a href=${poi.locationAttributes.googleMapLink} target="_blank">Satellite</a>
                &ensp;
                <a href=${poi.locationAttributes.osmMapLink} target="_blank">Map</a>      
              </p>
            </td>
          </tr>
          ${tel}
          ${email}
          ${web}
          ${entryCost}
        </table>
        ${openingTimes}
        ${relatedRoutes}
      </div>
    </div>
    <div id="poi-collection-nav" class="collection-nav fixed-bottom">
      <div id="poi-prev" class="arrow previous ${disableNavClass}"></div>
      <div id="poi-current">0 of n</div>
      <div id="poi-next" class="arrow next ${disableNavClass}"></div>
    </div>
    `;
}



/************************* helper functions ************************/


// returns set of category tags associated with the POI
function getTagsHtml(tags) {
  let content = "";
  tags.forEach( tag => {
    content += `<span class="poi-tag">${tag} </span>`;
  })
  return content;
}


// returns a table of opening hours
function getOpeningTimesHtml(openingTimes) {
  let content = `
    <table class="opening-times">
      <tr><th colspan="2">Opening hours:</th></tr>`;
  openingTimes.forEach(entry => {
    content += `
    <tr>
      <td>${entry.time_period}</td>
      <td>${entry.hours}</td>
    </tr>`;
  })
  content += `</table>`;
  return content;
}


// returns a button with a link to the route-details page with all the walks
// that include the POI in the collection
function getRelatedRoutesHtml(poi) {
  let collectionUrlParameter = `${URL_PARAM_COLLECTION}=${poi.related_walks}`; // comma-seperated list of ids
  return `
  <div class="button">
    <a id="related${poi.id}"
      href="routes-detail.html?${URL_PARAM_ROUTE}=${poi.related_walks[0]}&${collectionUrlParameter}&${URL_PARAM_STEPS}=-1">
      ${poi.related_walks.length} Related walk${poi.related_walks.length > 1 ? "s" : ""}
    </a>
  </div>`;
}