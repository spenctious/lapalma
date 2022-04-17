"use strict";

var activeFilters;

/************************* Initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};

function initialize() {
  activeFilters = new Set(); // initially all filters are off

  populateFilterPanel();
  populatePoiGrid();

  // add event listeners on the poi grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("poi-grid").addEventListener("click", poiGridClickHandler);
}

/************************* Click handlers ************************/

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
      poiDiv.style.display = "block";
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

    let entryCost = poi.hasEntryCost in poi ? getEntryCostHtml(poi.entryCost) : "";
    let openingTimes = poi.hasOpeningTimes ? getOpeningTimesHtml(poi.openingTimes) : "";
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
          ${getTagsHtml(poi.tags)}
          <h3 class="title">
            ${poi.name}
          </h3>
          <p class="description">
            ${poi.description}
          </p>
          ${openingTimes}
          ${entryCost}
          ${relatedRoutes}
        </div>
      </div>`;
    })

    document.getElementById("poi-grid").innerHTML = gridContent;
}

/************************* Helper functions returning HTML fragments ************************/

function getTagsHtml(tags) {
  let content = `<p class="tags">`;
  tags.forEach( tag => {
    content += `<span class="poi-tag">${tag}</span>`;
  })
  content += `</p>`;
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
  return `<p class="fees">${entryCost}</p>`;
}

function getRelatedRoutesHtml(poi) {
  let collectionUrlParameter = `collection=${poi.relatedWalks}`; // comma-seperated list of ids
  return `
    <p class="related-routes">
      <a class="link-button" href="./route-detail.html?route=${poi.relatedWalks[0]}&${collectionUrlParameter}">Related walks</a>
    </p>`;
}