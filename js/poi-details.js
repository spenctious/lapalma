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
      ${poi.fullName}
    </div>
    <div class="item-pic">
      <img src="/img/poi${poi.id}-400x300.jpg" alt="" />
    </div>
    <div class="item-detail">
      ${getTagsHtml(poi.tags)}
      <div class="extra-detail">
        <p class="description">
          ${poi.description}
        </p>
        <table class="general-details">
          <tr>
            <td>Location:</td><td>${poi.location}</td>
            ${tel}
            ${entryCost}
        </table>
        ${openingTimes}
      </div>
      <div class="button-modal">
        ${relatedRoutes}
        <div id="modal-close" class="grid-item-button">Close</div>
      </div>
    </div>`;
}

function getTagsHtml(tags) {
  let content = `<p class="tags">`;
  tags.forEach( tag => {
    content += `<span class="poi-tag">${tag} </span>`;
  })
  content += `</p>`;
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
    <div class="grid-item-button">
      <a href="./route-detail.html?route=${poi.relatedWalks[0]}&${collectionUrlParameter}">
        ${poi.relatedWalks.length} Walk${poi.relatedWalks.length > 1 ? "s" : ""}
      </a>
    </div>`;
}