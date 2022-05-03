"use strict";

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
  let entryCost = poi.hasEntryCost ? `<tr><td>Cost:</td><td>${poi.entryCost}</td></tr>` : "";
  let openingTimes = poi.hasOpeningTimes ? getOpeningTimesHtml(poi.openingTimes) : "";
  let relatedRoutes = poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";

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
        <tr>
          <td>Location:</td><td>${poi.locationDescription}</td>
          ${tel}
          ${entryCost}
      </table>
      ${openingTimes}
    </div>
    <div class="button-modal">
      ${relatedRoutes}
    </div>`;
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
    <a class="grid-item-button" href="./routes-detail.html?route=${poi.relatedWalks[0]}&${collectionUrlParameter}">
      ${poi.relatedWalks.length} Walk${poi.relatedWalks.length > 1 ? "s" : ""}
    </a>`;
}