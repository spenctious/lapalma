"use strict";

var poiCollection;
var poiCollectionIndex;
var detailsModal;
var detailsModalContent;
var detailsModalCurrent;

function initializePoiModal(initialPoiCollection) {
  poiCollection = initialPoiCollection;
  poiCollectionIndex = 0;
  detailsModal = document.getElementById("full-details");
  detailsModalContent = document.getElementById("poi-full-details");
}

function openModal(poiId, showRelatedWalks = true) {
  poiCollectionIndex = poiCollection.findIndex(item => item == poiId);
  updateCurrent(showRelatedWalks);
  detailsModal.style.display = "block";
}

// need to wait for details to be populated before accessing contents
function updateCurrent(showRelatedWalks) {
  detailsModalContent.innerHTML = getFullPoiDetails(getPoi(poiCollection[poiCollectionIndex]), showRelatedWalks);
  detailsModalCurrent = document.getElementById("poi-current");
  detailsModalCurrent.innerHTML = `${poiCollectionIndex + 1} of ${poiCollection.length}`;
  if (poiCollection.length < 2) {
    document.getElementById("poi-collection-nav").style.display = "none";
  }
}

function closeModal() {
  detailsModal.style.display = "none";
}

function moveNext() {
  if (++poiCollectionIndex >= poiCollection.length) poiCollectionIndex = 0;
  updateCurrent();
}

function movePrevious() {
  if (--poiCollectionIndex <= 0) poiCollectionIndex = poiCollection.length - 1;
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

function getFullPoiDetails(poi, showRelatedWalks) {
  let tel = poi.hasTel ? `<tr><td>Tel:</td><td>${poi.tel}</td></tr>` : "";
  let entryCost = poi.hasEntryCost ? `<tr><td>Cost:</td><td>${poi.entryCost}</td></tr>` : "";
  let openingTimes = poi.hasOpeningTimes ? getOpeningTimesHtml(poi.openingTimes) : "";
  let relatedRoutes = showRelatedWalks && poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";

  // build html content
  return `
    <div class="modal-title">
      <span id="modal-close" class="close">&times;</span>
      ${poi.fullName}
    </div>
    <div class="poi-detail-pic">
      <img src="/img/poi${poi.id}-400x300.jpg" alt="" />
    </div>
    <div class="tags">
      ${getTagsHtml(poi.tags)}
    </div>
    <div class="extra-detail">
      <p class="description">
        ${poi.description}
      </p>
      <table class="general-details">
        <tr><td>Location:</td><td>${poi.locationDescription}</td></tr>
        ${tel}
        ${entryCost}
      </table>
      ${openingTimes}
    </div>
    ${relatedRoutes}
    <div id="poi-collection-nav">
      <div id="poi-prev" class="nav arrow">
        <img src="/img/icons/chevron-left.svg" alt="" />
      </div>
      <div id="poi-current" class="nav">0 of n</div>
      <div id="poi-next" class="nav arrow">
        <img src="/img/icons/chevron-right.svg" alt="" />
      </div>
    </div>
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
  <div class="button-modal">
    <a class="grid-item-button" 
      href="./routes-detail.html?route=${poi.relatedWalks[0]}&${collectionUrlParameter}">
      ${poi.relatedWalks.length} Related walk${poi.relatedWalks.length > 1 ? "s" : ""}
    </a>
  </div>`;
}