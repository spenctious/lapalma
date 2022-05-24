"use strict";

var poiCollection;
var poiCollectionIndex;
var detailsModal;
var detailsModalContent;
var detailsModalCurrent;
var showRelatedWalks;

function initializePoiModal(initialPoiCollection) {
  poiCollection = initialPoiCollection;
  poiCollectionIndex = 0;
  detailsModal = document.getElementById("full-details");
  detailsModalContent = document.getElementById("poi-full-details");
}

function openModal(poiId, overlayOnPoiGrid = true) {
  showRelatedWalks = overlayOnPoiGrid;
  poiCollectionIndex = poiCollection.findIndex(item => item == poiId);
  updateCurrent();
  detailsModal.style.display = "block";
}

// need to wait for details to be populated before accessing contents
function updateCurrent() {
  detailsModalContent.innerHTML = getFullPoiDetails(getPoi(poiCollection[poiCollectionIndex]));
  detailsModalCurrent = document.getElementById("poi-current");
  detailsModalCurrent.innerHTML = `${poiCollectionIndex + 1} of ${poiCollection.length}`;
}

function closeModal() {
  detailsModal.style.display = "none";
}

function moveNext() {
  if (++poiCollectionIndex == poiCollection.length) poiCollectionIndex = 0;
  updateCurrent();
}

function movePrevious() {
  if (--poiCollectionIndex < 0) poiCollectionIndex = poiCollection.length - 1;
  updateCurrent();
}

// find the POI details from the id 
// (map is indexed by POI name, not id)
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

function getFullPoiDetails(poi) {
  let tel = poi.hasTel ? `<tr><td>Tel:</td><td>${poi.tel}</td></tr>` : "";
  let email = poi.hasEmail ? 
    `<tr><td>Email:</td><td>
    <a href="mailto:${poi.email}" target="_blank">${poi.email}</a>
    </td></tr>` 
    : "";
  let web = poi.hasWeb ? 
    `<tr><td>Web:</td><td>
    <a href="${poi.web.link}" target="_blank">${poi.web.name}</a>
    </td></tr>` 
    : "";
  let entryCost = poi.hasEntryCost ? `<tr><td>Cost:</td><td>${poi.entryCost}</td></tr>` : "";
  let openingTimes = poi.hasOpeningTimes ? getOpeningTimesHtml(poi.openingTimes) : "";
  let relatedRoutes = showRelatedWalks && poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";
  let disableNavClass = poiCollection.length == 1 ? "disable-nav" : "";

  // build html content
  return `
    <div class="modal-title">
      <span id="modal-close" class="close">&times;</span>
      Point of interest
    </div>
    <div class="modal-content-wrapper">
      <div class="poi-title">${poi.fullName}</div>
      <div class="poi-detail-pic">
        <img src="/img/poi${poi.id}-400x300.webp" alt="" />
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
              ${poi.locationDescription}
              ${getLocationLinks(poi.locationAttributes.coordinates)}
            </td>
          </tr>
          ${tel}
          ${email}
          ${web}
          ${entryCost}
        </table>
        ${openingTimes}
        <div class="button-box">
          ${relatedRoutes}
        </div>
      </div>
    </div>
    <div id="poi-collection-nav" class="collection-nav fixed-bottom">
      <div id="poi-prev" class="arrow previous ${disableNavClass}"></div>
      <div id="poi-current">0 of n</div>
      <div id="poi-next" class="arrow next ${disableNavClass}"></div>
    </div>
    `;
}

function getLocationLinks(coords) {
  let osmCoords = coords.replace(", ", "/");
  const ZOOM_LEVEL = 16;

  return `
    <p class="map-links">
      <a href="https://www.google.com/maps/@?api=1&map_action=map&center=${coords}&zoom=${ZOOM_LEVEL}&basemap=satellite" target="_blank">Google Maps</a>
      &ensp;
      <a href="https://www.openstreetmap.org/#map=${ZOOM_LEVEL}/${osmCoords}" target="_blank">OSM</a>      
    </p>
    `;
}

function getTagsHtml(tags) {
  let content = "";
  tags.forEach( tag => {
    content += `<span class="poi-tag">${tag} </span>`;
  })
  return content;
}

function getOpeningTimesHtml(openingTimes) {
  let content = `
    <table class="opening-times">
      <tr><th colspan="2">Opening hours:</th></tr>`;
  openingTimes.forEach(entry => {
    content += `
    <tr>
      <td>${entry.when}</td>
      <td>${entry.times}</td>
    </tr>`;
  })
  content += `</table>`;
  return content;
}

function getRelatedRoutesHtml(poi) {
  let collectionUrlParameter = `collection=${poi.relatedWalks}`; // comma-seperated list of ids
  return `
  <div class="button">
    <a 
      href="/routes-detail.html?route=${poi.relatedWalks[0]}&${collectionUrlParameter}">
      ${poi.relatedWalks.length} Related walk${poi.relatedWalks.length > 1 ? "s" : ""}
    </a>
  </div>`;
}