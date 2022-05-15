"use strict";

var activeFilters;

/************************* Initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};

function initialize() {
  activeFilters = new Set(); // initially all filters are off
  detailsModal = document.getElementById("full-details");

  let allPoi = new Array();
  laPalmaData.poi.forEach( poi => allPoi.push(poi.id));
  initializePoiModal(allPoi);

  populateFilterPanel();
  populatePoiGrid();

  // add event listeners on the poi grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("browse-grid").addEventListener("click", poiGridClickHandler);
  document.getElementById("filter-button").addEventListener("click", filterButtonClickHandler);
  detailsModal.addEventListener("click", modalClickHandler);
  
  filterPoi();
}

/************************* Click handlers ************************/

function filterButtonClickHandler(event) {
  openFilterPanel();
  document.getElementById("filter-button").style.display = "none";
}

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

function filterClickHandler(event) {
  let elementId = event.target.id;

  if (elementId == "close-filter") {
    closeFilterPanel();
    document.getElementById("filter-button").style.display = "block";
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

  // filter category
  if (elementId.startsWith("poi-category")) {
    let category = elementId.replace("poi-category-", ""); // strip prefix to get the caregory name
    event.target.checked ? activeFilters.add(category) : activeFilters.delete(category);
    filterPoi();
    return;
  }
}

function poiGridClickHandler(event) {
  let elementId = event.target.closest("#browse-grid > div").id;

  // link button so ignore and exit as we don't want to show details
  if (event.target.className == "grid-item-button") return;

  // poi detail button
  if (elementId.startsWith("poi")) {
    let poiId = elementId.replace("poi", ""); // strip prefix to get the poi id
    openModal(poiId);
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
  poiCollection = new Array();

  // hide filtered out routes and update count of how many are matched
  laPalmaData.poi.forEach(poi => {
    let included = applyActiveFilters(poi);
    let poiDiv = document.getElementById("poi" + poi.id);
    if (included) {
      poiDiv.style.display = "flex";
      poiCollection.push(poi.id);
      ++matched;
    }
    else {
      poiDiv.style.display = "none";
    }
  });

  // update matched poi count
  let poiCount = "";
  switch (matched) {
    case 0:
      poiCount = "No Places";
      break;
    case 1:
      poiCount = "1 Place";
      break;
    default:
      poiCount = matched + " Places";
      break;
  }

  // update header with filter count
  let filterCount = activeFilters.size.toString();
  let filterClass = "active-filters";
  if (activeFilters.size == 0) {
    filterCount = "OFF";
    filterClass = "active-filters none";
  }

  document.getElementById("header-title").innerHTML = `
    ${poiCount}
    <span class="${filterClass}">
      <img src="/img/icons/funnel-fill.svg" alt=""> ${filterCount}
    </span>
    `;
}

/************************* Content population ************************/

function populateFilterPanel() {
  let gridContent = "";

  // note: the data binding on the label stops the click event for the checkbox firing twice
  laPalmaData.categories.poiCategories.forEach(category => {
    gridContent += `
      <label class="container" data-bind="stopBubble:parentAction">
        <span class="poi-tag">${category.id}</span>
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
          <img src="/img/poi${poi.id}-250x187.webp" alt="" />
        </div>
        <div class="item-detail">
          <h3 class="title">
            ${poi.name}
          </h3>
          ${getTagsHtml(poi.tags)}
          <div class="button-set">
            ${relatedRoutes}
          </div>  
        </div>
      </div>`;
    })

    document.getElementById("browse-grid").innerHTML = gridContent;
}