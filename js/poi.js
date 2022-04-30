"use strict";

var activeFilters;
var detailsModal;

/************************* Initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};

function initialize() {
  activeFilters = new Set(); // initially all filters are off
  detailsModal = document.getElementById("full-details");

  populateFilterPanel();
  populatePoiGrid();

  // add event listeners on the poi grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("browse-grid").addEventListener("click", poiGridClickHandler);
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

function filterClickHandler(event) {
  let elementId = event.target.id;

  if (elementId.startsWith("poi-category")) {
    let category = elementId.replace("poi-category-", ""); // strip prefix to get the caregory name
    event.target.checked ? activeFilters.add(category) : activeFilters.delete(category);
    // console.log(category +" = " + activeFilters.get(category));
    filterPoi();
    return;
  }

  // text button to clear all filters
  if (elementId == "clear-all-filters") {
    activeFilters.clear();
    laPalmaData.categories.poiCategories.forEach(category => {
      document.getElementById("poi-category-" + category.id).checked = false;
    })
    // console.log(activeFilters);
    filterPoi();
    return;
  }
}

function poiGridClickHandler(event) {
  let elementId = event.target.closest("div").id;

  // poi detail button
  if (elementId.startsWith("poi-detail")) {
    let poiId = elementId.replace("poi-detail-", ""); // strip prefix to get the poi id
    document.getElementById("poi-full-details").innerHTML = getFullPoiDetails(poiId);
    detailsModal.style.display = "block";
    return;
  }
}


/************************* Filtering ************************/


// Returns true if the poi is included by the current filters or if no filters are set
function applyActiveFilters(poi) {
  // no filters - all POI are included
  if (activeFilters.size == 0) return true;

  // filters selected - POI included if it is tagged with any of the selected filter options
  let included = false;
  poi.tags.forEach( tag => {
    if (activeFilters.has(tag)) included = true;
  })
  return included;
}

// Hide POI entries that do not match the current filtering
// Update the filter count and number of matches
function filterPoi() {
  let matched = 0;

  // hide filtered out routes and update count of how many are matched
  laPalmaData.poi.forEach(poi => {
    let included = applyActiveFilters(poi);
    let poiDiv = document.getElementById("poi" + poi.id);
    if (included) {
      poiDiv.style.display = "flex";
      // selectedRoutes.set(route.id, "in");
      ++matched;
    }
    else {
      poiDiv.style.display = "none";
      // selectedRoutes.set(route.id, "out");
    }
  });

  // update match count
  let matchCountText = document.getElementById("match-count");
  switch (matched) {
    case 0:
      matchCountText.innerHTML = "No matches";
      break;
    case 1:
      matchCountText.innerHTML = "1 match";
      break;
    default:
      matchCountText.innerHTML = matched + " matches";
      break;
  }

  // update filter count
  let filtersCount = activeFilters.size;
  let filterCountText = document.getElementById("filter-count");
  switch (filtersCount) {
    case 0:
      filterCountText.innerHTML = "No filters";
      filterCountText.className = "no-filters";
      break;
    case 1:
      filterCountText.innerHTML = "1 filter";
      filterCountText.className = "filters-applied";
      break;
    default:
      filterCountText.innerHTML = filtersCount + " filters";
      filterCountText.className = "filters-applied";
      break;
  }
}

/************************* Content population ************************/

function populateFilterPanel() {
  let gridContent = "";

  // note: the data binding on the label stops the click event for the checkbox firing twice
  laPalmaData.categories.poiCategories.forEach(category => {
    gridContent += `
      <label class="container" data-bind="stopBubble:parentAction">${category.label}
        <input id="poi-category-${category.id}" type="checkbox">
        <span class="checkmark"></span>
        <p class="poi-category-description">${category.description}</p>
      </label>`;
  });

  document.getElementById("active-filter-grid").innerHTML = gridContent;
}

function populatePoiGrid() {
  let gridContent = "";

  laPalmaData.poi.forEach(poi => {
    let relatedRoutes = poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";

    // build html content
    gridContent += `
      <div id="poi${poi.id}" class="item">
        <div class="item-pic">
          <img src="/img/poi${poi.id}-400x300.jpg" alt="" />
        </div>
        <div class="item-detail">
          <h3 class="title">
            ${poi.name}
          </h3>
          ${getTagsHtml(poi.tags)}
          <div class="button-set">
            ${relatedRoutes}
            <div id="poi-detail-${poi.id}" class="grid-item-button">Details</div>
          </div>  
        </div>
      </div>`;
    })

    document.getElementById("browse-grid").innerHTML = gridContent;
}

/************************* Helper functions returning HTML fragments ************************/

function getFullPoiDetails(poiId) {

  // find the POI details from the id 
  // (map is indexed by POI name, not id)
  let poi = undefined;
  for (let p of laPalmaData.poi.values()) {
    if (p.id == poiId) {
      poi = p;
      break;
    }
  }

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

function getTelHtml(tel) {
  return `<p><span class="item-label">Tel:</span>${tel}</p>`;
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