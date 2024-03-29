"use strict";

var activeFilters;


/************************* Initialization ************************/


// wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};


// initial set-up
function initialize() {
  activeFilters = new Set(); // initially all filters are off

  // set-up the details modal with all routes initially in the collection
  let allPoi = new Array();
  laPalmaData.poi.forEach( poi => allPoi.push(poi.id));
  initializePoiModal(allPoi);

  // populate the filters and grid
  populateFilterPanel();
  populatePoiGrid();

  // add event listeners on the poi grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("filter-overlay").addEventListener("click", closeFilterPanel);

  document.getElementById("browse-grid").addEventListener("click", poiGridClickHandler);
  document.getElementById("filter-button").addEventListener("click", filterButtonClickHandler);
  document.getElementById("full-details").addEventListener("click", modalClickHandler);

  // restore filter state if set
  // ensures navigating back after looking at a related route detail does not lose the set filters
  let retrievedState = window.history.state;
  if (retrievedState != undefined && retrievedState != null && JSON.stringify(retrievedState) != '{}') {
    restoreState(retrievedState);
  }

  filterPoi();
}


/************************* Filter panel open/close ************************/


function openFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(-100%)";
  document.getElementById("filter-overlay").style.display = "block";
  document.getElementById("filter-button").style.display = "none";
}

function closeFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(0)";
  document.getElementById("filter-overlay").style.display = "none";
  document.getElementById("filter-button").style.display = "block";
}


/************************* Click handlers ************************/


// handler for floating filter button
function filterButtonClickHandler(event) {
  openFilterPanel();
}


// POI details modal click handler
function modalClickHandler(event) {
  let id = event.target.id;

  // links to related walks preserve the filter state
  // otherwise ignore the click
  if (event.target.tagName == "A" ) {
    saveStateForRelatedWalks(event.target.id);
    return;
  }  

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


// handle filter panel clicks
function filterClickHandler(event) {
  let elementId = event.target.id;

  if (elementId == "close-filter") {
    closeFilterPanel();
    return;
  }

  // text button to clear all filters
  if (elementId == "clear-all-filters") {
    activeFilters.clear();
    laPalmaData.tags.forEach(category => {
      document.getElementById("poi-category-" + category.tag).checked = false;
    })
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


// handle clicks for the POI grid
function poiGridClickHandler(event) {
  let elementId = event.target.closest("#browse-grid > div").id;

  // links to related walks preserve the filter state
  // otherwise ignore the click
  if (event.target.tagName == "A" ) {
    saveStateForRelatedWalks(event.target.id);
    return;
  }

  // poi detail button
  if (elementId.startsWith("poi")) {
    let poiId = elementId.replace("poi", ""); // strip prefix to get the poi id
    openModal(poiId);
    return;
  }
}



/************************* State ************************/


function getState() {
  return {
    filters: activeFilters
  }
}


function restoreState(state) {
  activeFilters = state.filters;

  // tick the active filters
  activeFilters.forEach(categoryId => {
    document.getElementById(`poi-category-${categoryId}`).checked = true;
  })
}


function saveStateForRelatedWalks(linkId) {
  // if a link to related walks is clicked save the current filter state, otherwise ignore
  if (linkId.startsWith("related")) {
    if (activeFilters.size > 0) {
      window.history.replaceState(getState(), "");
    } else {
      window.history.replaceState({}, "");
    }    
  }
}



/************************* Filtering ************************/


// returns true if the poi is included by the current filters or if no filters are set
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

// hide POI entries that do not match the current filtering
// update the filter count and number of matches
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

  // update empty state
  document.getElementById("zero-matches").style.display = 
    matched > 0 ? "none" : "flex";

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
      <img src="img/icons/funnel-fill.svg" alt=""> ${filterCount}
    </span>
    `;
}



/************************* Content population ************************/

// populates the filter panel with:
// - checkbox tag filters
// - clear all filters and close buttons
//
function populateFilterPanel() {
  let gridContent = "";

  // note: the data binding on the label stops the click event for the checkbox firing twice
  laPalmaData.tags.forEach(tag => {
    gridContent += `
      <label class="container" data-bind="stopBubble:parentAction">
        <span class="poi-tag">${tag.tag}</span>
        <input id="poi-category-${tag.tag}" type="checkbox">
        <span class="checkmark"></span>
        <p class="poi-category-description">${tag.description}</p>
      </label>`;
  });

  document.getElementById("active-filter-grid").innerHTML = gridContent;
}


// populates the POI grid with:
// - Default content (usually hidden) for when there are no matched routes
// - Grid of POI, each of which consists of:
//  - image
//  - tags
//  - related walks buttom
//
function populatePoiGrid() {
  let gridContent = `
    <div id="zero-matches">
      Sorry, nothing matches.<br />Try changing or deleting filters.
    </div>`;

  laPalmaData.poi.forEach(poi => {
    let relatedRoutes = poi.hasRelatedWalks ? getRelatedRoutesHtml(poi) : "";

    // build html content
    gridContent += `
      <div id="poi${poi.id}" class="item">
        <div class="item-pic">
          <img src="img/${poi.thumbnail.file_name}.webp" width=${poi.thumbnail.width} height=${poi.thumbnail.height} alt="" />
        </div>
        <div class="item-detail">
          <h3 class="title">
            ${poi.short_name}
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