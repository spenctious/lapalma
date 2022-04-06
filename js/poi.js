"use strict";

/************************* Initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};

function initialize() {
  populatePoiGrid();
}

function populatePoiGrid() {
  let gridContent = "";

  laPalmaData.poi.forEach( poi => {

    let entryCost = "entryCost" in poi ? getEntryCostHtml(poi.entryCost) : "";
    let openingTimes = "openingTimes" in poi ? getOpeningTimesHtml(poi.openingTimes) : "";
    let relatedRoutes = poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";

    // build html content
    gridContent += `
        <div id="poi${poi.id}" class="route">
          <div class="route-pic">
            <img src="/img/poi${poi.id}-400x300.jpg" width="400", height="300" alt="" />
            <div class="pic-label">
              <span class="route-id">${poi.id}</span>
            </div>
          </div>
          <div class="route-detail">
            <div class="tags">
              ${getTagsHtml(poi.tags)}
            </div>
            <div class="title">
              ${poi.name}
            </div>
            ${openingTimes}
            ${entryCost}
            <div class="description">
              ${poi.description}
            </div>
            ${relatedRoutes}
          </div>
        </div>`;
      })
      document.getElementById("poi-grid").innerHTML = gridContent;
}

function getTagsHtml(tags) {
  let content = `<div class="tags">`;
  tags.forEach( tag => {
    content += `<span class="poi-tag">${tag}</span>`;
  })
  content += `</div>`;
  return content;
}

function getOpeningTimesHtml(openingTimes) {
  let content = `<table class="opening-times">`;
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

function getEntryCostHtml(entryCost) {
  return `<div class="fees">${entryCost}</div>`;
}

function getRelatedRoutesHtml(poi) {
  let collectionUrlParameter = `collection=${poi.relatedWalks}`; // comma-seperated list of ids
  return `
    <div class="related-routes">
      <a class="link-button" href="./route-detail.html?route=${poi[0]}&${collectionUrlParameter}>Related walks</a>
    </span>`;
}