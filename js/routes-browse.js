"use strict";

const MAX_FILTERS = 3;

// object handling filter panel and filters within
var filterSet;

// selection status - values will be "in" or "out"
var selectedRoutes;

/************************* Initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};

function initialize() {

  // initially all routes are included (in numeric order)
  selectedRoutes = new Map();
  laPalmaData.routes.forEach(route => selectedRoutes.set(route.id, "in"));
  
  filterSet = new FilterSet();
  filterSet.populateFilterPanel();
  populateRoutesGrid();

  // add event listeners on the routes grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("overlay").addEventListener("click", closeFilterPanel);
  document.getElementById("browse-grid").addEventListener("click", routesGridClickHandler);
  document.getElementById("area-map").addEventListener("click", locationGridClickHandler);
  document.getElementById("filter-button").addEventListener("click", filterButtonClickHandler);

  // restore filter state if set
  let retrievedState = window.history.state;
  if (retrievedState != undefined && retrievedState != null && JSON.stringify(retrievedState) != '{}') {
    filterSet.restoreState(retrievedState);
  } else {
    filterRoutes();
  }
}

/************************* URL parameter handling ************************/

// note: should not be possible to call this method unless there is at least one route 
// not filtered out 
function getDetailPageQueryString(selectedRouteIndex) {
  // get route ids for all routes not filtered out
  let collection = "";
  selectedRoutes.forEach((value, key) => {
    if (value == "in") collection += key + ",";
  });
  if (collection.endsWith(',')) collection = collection.slice(0, -1); // strip trailing comma

  return `?${URL_PARAM_ROUTE}=${selectedRouteIndex}&${URL_PARAM_COLLECTION}=${collection}&${URL_PARAM_STEPS}=-1`;
}

/************************* Click handlers ************************/

function openFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(-100%)";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("filter-button").style.display = "none";
}

function closeFilterPanel() {
  document.getElementById("filter").style.transform = "translateX(0)";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("filter-button").style.display = "block";
}

function filterButtonClickHandler(event) {
  openFilterPanel();
}

function filterClickHandler(event) {
  let elementId = event.target.closest("div").id;

  // handle switching of tab panels for category and location filters
  // note: on deep viewports the filer panels are stacked and there are no tabs
  if (elementId == "tab1") {
    document.getElementById("category-filters").style.display = "block";
    document.getElementById("location-filters").style.display = "none";
    document.getElementById("tab1").classList.add("tab-selected");
    document.getElementById("tab2").classList.remove("tab-selected");
  }

  if (elementId == "tab2") {
    document.getElementById("category-filters").style.display = "none";
    document.getElementById("location-filters").style.display = "block";
    document.getElementById("tab1").classList.remove("tab-selected");
    document.getElementById("tab2").classList.add("tab-selected");
  }

  if (elementId == "close-filter") {
    closeFilterPanel();
  }

  // text button to clear all filters
  if (elementId == "clear-all-filters") {
    filterSet.clearAllFilters();
    return;
  }

  // text button to select all location areas
  if (elementId == "all-locations") {
    filterSet.selectAllLocations();
    return;
  }

  // text button to deselect all location areas
  if (elementId == "no-locations") {
    filterSet.clearAllLocations();
    return;
  }

  // favourites clear all text button
  if (elementId == "clear-favourites") {
    filterSet.clearFavourites();
    return;
  }

  // close button to clear active filter
  if (elementId.startsWith("active-filter")) {
    filterSet.deleteActiveFilter(elementId);
    return;
  }

  // icon buttons to toggle filters
  if (elementId.startsWith("filter")) {
    filterSet.toggle(elementId);
    return;
  }
}

function locationGridClickHandler(event) {
  let elementId = event.target.id;
  filterSet.toggleLocationSelector(elementId);
}

function routesGridClickHandler(event) {
  let elementId = event.target.id;
  let routeId = event.target.closest("#browse-grid > div").id;
  let routeIndex = routeId.replace("route", "")

  if (elementId.startsWith("favourite")) {
    // favourites icon clicked - toggle it
    if (favourites.has(routeIndex)) {
      favourites.delete(routeIndex);
      event.target.src = "/img/icons/heart-empty.svg";
    } else {
      favourites.add(routeIndex);
      event.target.src = "/img/icons/heart-full-black.svg";
    }
    updateFavourites();
  }
  else {
    // route clicked - open route detail page for the specified route

    // save filter settings if a filter has been set, otherwise clear
    if (filterSet.activeFilterCount > 0) {
      window.history.replaceState(filterSet.getState(), "");
    } else {
      window.history.replaceState({}, "");
    }

    window.location.href = `./routes-detail.html${getDetailPageQueryString(routeIndex)}`;
  }
}

/************************* Routes grid ************************/

function populateRoutesGrid() {
  // Empty state content - hidden by default;
  let gridContent = `
    <div id="zero-matches">
      Sorry, nothing matches.<br />Try changing or deleting filters.
    </div>`;
  

  laPalmaData.routes.forEach( route => {
    // number of route varients, if any
    let routeVarients = "";
    let routeVarientCount = route.variants.length;
    if (routeVarientCount > 0) {
      routeVarients = `<span class="route-varients">
        ${routeVarientCount} variation${routeVarientCount > 1 ? "s" : ""}</span>`;
    }

    // starred
    let starred = "";
    if (route.isStarred) {
      starred = `<div class="starred"><img src="/img/icons/${route.starredAttributes.icon}" alt="" /></div>`;
    }

    // favourite
    let favouriteIcon = favourites.has(route.id) ? "heart-full-black.svg" :  "heart-empty.svg";

    // build html content
    gridContent += `
        <div id="route${route.id}" class="item">
          <div class="item-pic">
            <img src="/img/route${route.id}-01-250x187.webp" alt="" />
            <div class="pic-label">
              <span class="item-id">${route.id}</span>
              ${routeVarients}
            </div>
            ${starred}
            <div class="variant-match" id="variant-match${route.id}">Variation matches</div>
          </div>
          <div class="item-detail">
            <div class="title">
              <img
                id="favourite${route.id}"
                class="favourite"
                src="/img/icons/${favouriteIcon}"
                alt=""
              />
              ${route.name}
            </div>
            <div class="description">
              ${route.shortDescription}
            </div>
            <div class="metrics">
              <div class="route-metric">
                <p>${route.durationAttributes.text}</p>
                <img src="/img/icons/${route.durationAttributes.icon}" alt="" />
              </div>
              <div class="route-metric">
                <p>${route.effortAttributes.text}</p>
                <img src="/img/icons/${route.effortAttributes.icon}" alt="" />
              </div>
            </div>
          </div>
        </div>`;
      })
      document.getElementById("browse-grid").innerHTML = gridContent;
};

// Hide routes that don't fit the current filters
// Update count of filters and matches
function filterRoutes() {
  let matched = 0;

  // hide filtered out routes and update count of how many are matched
  laPalmaData.routes.forEach(route => {
    let included = filterSet.applyActiveFilters(route);
    let routeDiv = document.getElementById("route" + route.id);
    let variantMatchDiv = document.getElementById("variant-match" + route.id);

    if (included.route) {
      // show routes that match
      routeDiv.style.display = "flex";
      variantMatchDiv.style.display = "none";
      selectedRoutes.set(route.id, "in");
      ++matched;
    } else if (included.variants) {
      // flag up those that only match variants
      routeDiv.style.display = "flex";
      variantMatchDiv.style.display = "block";
      selectedRoutes.set(route.id, "in");
      ++matched;
    }
    else {
      // hide those that don' match
      routeDiv.style.display = "none";
      variantMatchDiv.style.display = "none";
      selectedRoutes.set(route.id, "out");
    }
  });

  // update empty state
  document.getElementById("zero-matches").style.display = 
    matched > 0 ? "none" : "flex";

  // update route count
  let routeCount = "";
  switch (matched) {
    case 0:
      routeCount = "No Routes";
      break;
    case 1:
      routeCount = "1 Route";
      break;
    default:
      routeCount = matched + " Routes";
      break;
  }

  let filterCount = filterSet.activeFilterCount.toString();
  let filterClass = "active-filters";
  if (filterSet.activeFilterCount == 0) {
    filterCount = "OFF";
    filterClass = "active-filters none";
  }

  document.getElementById("header-title").innerHTML = `
    ${routeCount}
    <span class="${filterClass}">
      <img src="/img/icons/funnel-fill.svg" alt=""> ${filterCount}
    </span>
    `;
}

/************************* Filter classes ************************/

// Toggle states
const OFF = "OFF";
const ONLY = "ONLY";
const NO = "NO";
const ON = "ON";

// Indexes for explicitly setting a toggle state
const STATE_OFF = 0;
const STATE_ON = 1;

// Possible toggle state cycles
const INCLUDE = ["OFF", "ONLY"]; // positive attributes to be ruled in
const EXCLUDE = ["OFF", "NO"];  // undesirable attributes to be ruled out
const OFF_ON = ["OFF", "ON"];

//
// Handles filter state of walk attributes
// Allows for tri-state toggling if needed in the future (e.g. off-only-on or off-only-only:strong)
//
class Toggle {
  #currentState;
  #states;

  // Takes an array of states
  constructor(states) {
    this.#states = states;
    this.#currentState = 0;
  }

  // If targetState is specified move to that state, otherwise
  // move to the next toggle state which 'wraps around' back to 0
  toggle(targetState) {
    if (typeof targetState == 'undefined') {
      this.#currentState = ++this.#currentState % this.#states.length;
    }
    else {
      console.assert(
        !isNaN(targetState) && 
        targetState >= 0 && 
        targetState < this.#states.length, 
        `invalid targetState: ${targetState}`);
      this.#currentState = targetState;
    }
  }

  // Returns the actual state value
  get state() {
    return this.#states[this.#currentState];
  }

  // Off should be the first state of any sequence
  get isOff() {
    return this.#currentState == 0;
  }
}

/******************************* Filter classes *******************************/

//
// Base filter class - handles basic toggling and drawing of the filter
// Derrived classes must supply an apply() method for filtering
//
class Filter {

  #index;
  #category;
  #toggleControl;
  #name;
  isEnabled;
  #isVariantDefined;

  constructor(name, category, toggle, isVariantDefined = false) {
    this.#name = name;
    this.#category = category;
    this.#toggleControl = toggle;
    this.isEnabled = true;
    this.#isVariantDefined = isVariantDefined;
  }

  toggle(targetState) {
    this.#toggleControl.toggle(targetState);
    this.#updateScreenStatus();
  }

  reset() {
    this.#toggleControl.toggle(STATE_OFF);
    this.#updateScreenStatus();
  }

  get isOff() {
    return this.#toggleControl.isOff;
  }

  get isVariantDefined() { return this.#isVariantDefined; }

  // getters and setters
  set enabled(state) {
    this.isEnabled = state;
    this.#updateScreenStatus();
  }
  get enabled() { return this.isEnabled; }

  get name() { return this.#name; }
  set index(index) { this.#index = index; }
  get index() { return this.#index; }
  get id() { return "filter" + this.#index; }
  get icon() { return "filterIcon" in this.#category ? this.#category.filterIcon : this.#category.icon; }
  get state() { return this.#toggleControl.state; }

  get text() {
    return this.state == ONLY ? this.#category.filterIncludeText : this.#category.filterExcludeText;
  }

  get html() {
    let filterHtml =
    `<div id="${this.id}" class="icon ${this.enabled ? '' : ' disabled'}">
      <img src="/img/icons/${this.icon}" class="icon-img" alt="" />
    </div>`;
    return filterHtml;
  }

  enableInactive(setEnabled) {
    if (this.state == OFF) {
      this.enabled = setEnabled;
    }
  }

  #updateScreenStatus() {
    let icon = document.getElementById(this.id);
    if (this.enabled) {
      switch (this.#toggleControl.state) {
        case OFF:
          icon.className = "icon";
          break;

        case ONLY:
          icon.className = "icon included";
          break;

        case NO:
          icon.className = "icon excluded";
          break;
      }
    } else {
      icon.className = "icon disabled";
    }
  }
}

/**** Derived filter classes - actual filters ****/

class Starred extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("starred"), new Toggle(INCLUDE))
  }

  apply(route) {
    return route.isStarred;
  }
}

class Favourite extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("favourite"), new Toggle(INCLUDE))
  }

  apply(route) {
    return favourites.has(route.id);
  }
}

class ShortWalk extends Filter {
  constructor(name) {
    super(name, laPalmaData.duration.get("half"), new Toggle(INCLUDE), true);
  }

  apply(route) {
    return route.isShort;
  }
}

class AccessCar extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("accessCar"), new Toggle(INCLUDE), true);
  }

  apply(route) {
    return route.isAccessibleByCar;
  }
}

class AccessBus extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("accessBus"), new Toggle(INCLUDE), true);
  }

  apply(route) {
    return route.isAccessibleByBus;
  }
}

class Waymarked extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("waymarked"), new Toggle(INCLUDE));
  }

  apply(route) {
    return route.isCompletelyWaymarked;
  }
}

class WalkType extends Filter {
  #specificType;

  constructor(specificType) {
    super(specificType, laPalmaData.walkType.get(specificType), new Toggle(INCLUDE), true);
    this.#specificType = specificType;
  }

  apply(route) {
    return route.walkType == this.#specificType;
  }
}

class Interest extends Filter {
  #specificInterest;

  constructor(specificInterest) {
    super(specificInterest, laPalmaData.interest.get(specificInterest), new Toggle(INCLUDE));
    this.#specificInterest = specificInterest;
  }

  apply(route) {
    return route.interest.has(this.#specificInterest);
  }
}

class Terrain extends Filter {
  #specificTerrain;
  constructor(specificTerrain) {
    super(specificTerrain, laPalmaData.terrain.get(specificTerrain), new Toggle(INCLUDE));
    this.#specificTerrain = specificTerrain;
  }

  apply(route) {
    return route.terrain.has(this.#specificTerrain);
  }
}

class Warning extends Filter {
  #specificWarning;

  constructor(specificWarning, strong) {
    super(specificWarning, laPalmaData.warnings.get(specificWarning), new Toggle(EXCLUDE));
    this.#specificWarning = specificWarning;
  }

  apply(route) {
    return route.warnings.has(this.#specificWarning) ? route.warnings.get(this.#specificWarning).isStrong : false;
  }
}

//
// Handles the linked location selector grid as well as the location filter
//
class Location extends Filter {
  #locationAreas;
  #allAreasOff;
  #allAreasOn;
  #areas;

  constructor(name) {
    super(name, laPalmaData.categories.walkLocations, new Toggle(INCLUDE));

    this.#allAreasOff = true;
    this.#allAreasOn = false;
    super.isEnabled = false;

    // create and populate location area sets
    this.#locationAreas = new Map(
      [
        ["north", { buttonName: "North", toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["west", { buttonName: "West", toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["central", { buttonName: "Central", toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["east", { buttonName: "East", toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["south", { buttonName: "South", toggle: new Toggle(OFF_ON), locations: new Set() }],
      ]
    );

    // loop through the locations and sort then into area buckets
    // n.b. locations can fall into more than one area
    laPalmaData.locations.forEach((locationDetail, locationName) => {
      locationDetail.areas.forEach(area => {
        let areaSet = this.#locationAreas.get(area).locations;
        areaSet.add(locationName);
      })
    });
  }

  // only enable if valid
  enableInactive(setEnabled) {
    if (!this.#allAreasOff && !this.#allAreasOn) super.enableInactive(setEnabled);
  }

  // checks for invalid selection states
  checkAreasAreValid() {
    this.#allAreasOff = true;
    this.#allAreasOn = true;
    this.#locationAreas.forEach(area => {
      area.toggle.isOff ? this.#allAreasOn = false : this.#allAreasOff = false;
    });
  }

  /*** Accessors ***/

  get activeLocationAreas() { 
    // return this.#locationAreas;
    let activeAreas = new Array();
    this.#locationAreas.forEach((area, areaName) => {
      if (!area.toggle.isOff) {
        activeAreas.push(areaName);
      }
    }) 
    return activeAreas;
  }

  set activeLocationAreas(restoredActiveAreas) {
    restoredActiveAreas.forEach(areaName => {
      this.setLocationSelector(areaName, STATE_ON)
    });
  }

  get name() {
    return super.name;
  }

  // Returns false if all areas are selected or no areas selected, true otherwise
  // In other words, true only if the selection makes sense as a filter
  get hasValidAreasSelection() {
    this.checkAreasAreValid();

    return !this.#allAreasOff && !this.#allAreasOn;
  }

  get allAreasSelected() {
    return this.#allAreasOn;
  }

  get noAreasSelected() {
    return this.#allAreasOff;
  }

  /*** Area button click handlers ***/

  // Update location selector appearance and toggle state
  toggleLocationSelector(elementId) {
    this.setLocationSelector(elementId);
  }

  selectAllLocations() {
    for (let areaName of this.#locationAreas.keys()) {
      this.setLocationSelector(areaName, STATE_ON);
    }
  }

  clearAllLocations() {
    for (let areaName of this.#locationAreas.keys()) {
      this.setLocationSelector(areaName, STATE_OFF);
    }
  }

  // Helper method to set the area to the specified state and update the map accordingly
  setLocationSelector(areaKey, targetState) {
    let area = this.#locationAreas.get(areaKey);
    area.toggle.toggle(targetState);

    // className for an SVG path is an SVGAnimatedString so we need to use the 
    // SetAttribute method instead of assigning a string as we would with HTML
    let locationMapArea = document.getElementById(areaKey);
    if (area.toggle.isOff) {
      locationMapArea.setAttribute("class", "area-deselected");
    } else {
      locationMapArea.setAttribute("class", "area-selected");
    }
  }

  /*** Filtering ***/

  apply(route) {
    return this.isInSelectedAreas(route.start) || this.isInSelectedAreas(route.end);
  }

  // Returns true only if specified location is in the selected areas
  isInSelectedAreas(location) {
    let included = false;
    for (let area of this.#locationAreas.values()) {
      if (!area.toggle.isOff) {
        included = area.locations.has(location);
        if (included) break; // no need to look any further
      }
    }
    return included;
  }
}

/************************* FilterSet ************************/

// Handles the filter panel as a whole updating the active filter panel, locations grid,
// favourites and routes grid according to the user selections
class FilterSet {
  #allFilters;
  #filterIndex;
  #locationFilter;
  #activeFilterList;
  #generalFiltersHtml;
  #categoryFiltersHtml;
  #locationFilterHtml;

  constructor() {
    this.#generalFiltersHtml = "";
    this.#categoryFiltersHtml = "";
    this.#locationFilterHtml = "";

    // Filters added in order they are laid out in HTML
    this.#allFilters = new Array();
    this.#filterIndex = 0;
    this.addGeneralFilter(new Starred("starred"));
    this.addGeneralFilter(new Favourite("favourites"));

    this.startCategory("Basic");
    this.addCategoryFilter(new WalkType("circular"));
    this.addCategoryFilter(new AccessCar("car"));
    this.addCategoryFilter(new AccessBus("bus"));
    this.addCategoryFilter(new ShortWalk("short"));
    this.addCategoryFilter(new Waymarked("waymarked"));
    this.endCategory();

    this.startCategory("Interest");
    this.addCategoryFilter(new Interest("archeological"));
    this.addCategoryFilter(new Interest("peaks"));
    this.addCategoryFilter(new Interest("poi"));
    this.addCategoryFilter(new Interest("port"));
    this.addCategoryFilter(new Interest("scenic"));
    this.endCategory();

    this.startCategory("Terrain");
    this.addCategoryFilter(new Terrain("dragon"));
    this.addCategoryFilter(new Terrain("volcanic"));
    this.addCategoryFilter(new Terrain("laurisilva"));
    this.addCategoryFilter(new Terrain("coastal"));
    this.addCategoryFilter(new Terrain("pine"));
    this.endCategory();

    this.startCategory("Warnings");
    this.addCategoryFilter(new Warning("gps", false));
    this.addCategoryFilter(new Warning("steep", true));
    this.addCategoryFilter(new Warning("slippery", true));
    this.addCategoryFilter(new Warning("vertigo", true));
    this.addCategoryFilter(new Warning("weather", false));
    this.addLocationFilter(new Location("location"));
    this.endCategory();

    this.#activeFilterList = new Set();

    this.populateFilterPanel();
    this.updateActiveFilterGrid();
  }

  /*** Initialization ***/

  // return the current state of the filters
  getState() {
    return { 
      activeFilters: this.#activeFilterList,
      locationAreas: this.#locationFilter.activeLocationAreas
    }
  }

  // return filters to their previous state
  restoreState(state) {
    this.#activeFilterList = state.activeFilters;
    this.#locationFilter.activeLocationAreas = state.locationAreas;
    this.#activeFilterList.forEach(filter => {
      this.#allFilters[filter].toggle();
    })
    this.updateGrids();
  }

  // Add a filter to the collection and assign the collection index as the id
  // Add the filter to the list to be applied to variants if so indicated
  addFilter(filter) {
    filter.index = this.#filterIndex++;
    this.#allFilters.push(filter);
  }

  // Specific add methods build up HTML for injection into respective grids
  addGeneralFilter(filter) {
    this.addFilter(filter);
    this.#generalFiltersHtml += filter.html;
  }

  addCategoryFilter(filter) {
    this.addFilter(filter);
    this.#categoryFiltersHtml += filter.html;
  }

  startCategory(label) {
    this.#categoryFiltersHtml += `<div class="feature-heading">${label}</div><div class="filter-row">`;
  }

  endCategory() {
    this.#categoryFiltersHtml += `</div>`;
  }

  addLocationFilter(filter) {
    this.addFilter(filter);
    this.#locationFilterHtml = filter.html;
    this.#locationFilter = filter;
  }

  // Add grid content to the filter panel
  populateFilterPanel() {
    // general filters
    let generalFilterGridContent = this.#generalFiltersHtml;
    generalFilterGridContent += `<div id="clear-favourites" class="text-button middle">Clear favourites</div>`;
    document.getElementById("general-filter-grid").innerHTML = generalFilterGridContent;

    // category filters
    document.getElementById("category-filter-grid").innerHTML = this.#categoryFiltersHtml;

    // location filters
    let locationFilterGridContent = this.#locationFilterHtml;
    locationFilterGridContent += `
    <div id="location-message">${this.locationFilterMessage}</div>
    <div id="all-locations" class="text-button left-bottom">Select All</div>
    <div id="no-locations" class="text-button left-bottom">Select None</div>
    <div id="area-map">
      <svg width="272" height="402" viewbox="0 0 272 402" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="west" class="area-deselected" d="M150 241.5V276L1 321V89L69.5 104.5L80 137.5L105.5 156.5L90 212.5L103.5 241.5H150Z" stroke="#838383" stroke-width="1"/>
        <path id="central" class="area-deselected" d="M105.5 156.5L80 137.5L69.5 104.5L85.5 79L117.5 74L157 77L195.5 104.5L189 142.5L181.5 163L187.5 200L181.5 241.5H103.5L90 212.5L105.5 156.5Z"  stroke="#838383" stroke-width="1"/>
        <path id="north" class="area-deselected" d="M117 74L85.5 79L69.5 104.5L1 89V1H221V21L174 89L157 77L117 74Z" stroke="#838383" stroke-width="1"/>
        <path id="east" class="area-deselected" d="M221 1H271V241.5H181.5L187.5 200L181.5 163L189 142.5L195.5 104.5L174 89L221 21V1Z" stroke="#838383" stroke-width="1"/>
        <path id="south" class="area-deselected" d="M150 276L1 321V401H271V241.5H150V276Z" stroke="#838383" stroke-width="1"/>
      </svg>
    </div>`;
    document.getElementById("location-filter-grid").innerHTML = locationFilterGridContent;
  }

  /*** Accessors ***/

  get activeFilterCount() {
    return this.#activeFilterList.size;
  }

  get filterLimitReached() { 
    return this.#activeFilterList.size == MAX_FILTERS; 
  }

  get locationFilterMessage() {
    if (this.#locationFilter.allAreasSelected) return "Remove areas to enable filter.";
    if (this.#locationFilter.noAreasSelected) return "Add areas to enable filter.";
    return "";
  }

  /*** Update methods ***/

  updateGrids() {
    this.updateActiveFilterGrid();
    this.updateLocationMessage();
    this.updateFilterIcons();
    filterRoutes();
  }

  updateLocationMessage() {
    let message = "";
    this.#locationFilter.checkAreasAreValid();
    if (this.#locationFilter.allAreasSelected) {
      message = "Remove areas to enable filter.";
      this.#locationFilter.enabled = false;
    } else if (this.#locationFilter.noAreasSelected) {
      message = "Add areas to enable filter.";
      this.#locationFilter.enabled = false;
    } else {
      this.#locationFilter.enabled = true;
    }
    document.getElementById("location-message").innerHTML = message;
  }

  // Redraws active filter grid replacing old contents
  updateActiveFilterGrid() {
    let activeFilterGridContents = "";
    if (this.#activeFilterList.size == 0) {
      // Empty state message
      activeFilterGridContents = `
      <span class="emptyStateText">Tap an icon to add a filter.</span>`;
    } else {
      this.#activeFilterList.forEach(filterId => {
        let filter = this.#allFilters[filterId];
        activeFilterGridContents += `
          <div class="active-filter state-${filter.state}">
            <div>${filter.state}</div>
            <div>${filter.text}</div>
            <div id="active-${filter.id}" class="close-cross">&times;</div>
          </div>`
      });
    }
    document.getElementById("active-filter-grid").innerHTML = activeFilterGridContents;
  }

  // disables unused filter icons if the maximum number of filters is already set
  updateFilterIcons() {
    this.#allFilters.forEach(filter => {
      filter.enableInactive(!this.filterLimitReached);
    })
  }

  /*** Filter application ***/

  // variant filters are assumed to inherit their parent walk's attributes
  applyActiveFilters(route) {
    let matchesMainFilters = true;
    let matchesVariantFilters = true;

    // check the route to see if its filtered out or not
    this.#activeFilterList.forEach(filterId => {
      let filter = this.#allFilters[filterId];
      // record whether the route failed matching main or variant filters
      if (!this.routeIsIncluded(filter, route)) {
        if (filter.isVariantDefined) {
          matchesVariantFilters = false;
        } else {
          matchesMainFilters = false;
        }
      }
    });

    // if there is no match on the main filters there's no match on the variants 
    // either so we don't need to check them
    if (!matchesMainFilters) {
      return {route: false, variants: false}; 
    }

    // if the main route matches completely, there is no need to check the variants
    if (matchesMainFilters && matchesVariantFilters) {
      return {route: true, variants: undefined}; 
    }

    // matched on the main filters but not the variant filters - 
    // see if one or more variants match

    // there is no match if there are no variants
    if (!route.hasVariants) {
      return {route: true, variants: false}; 
    }

    // if any variant matches then there is no need to check the others
    let matchingVariantFound = false;
    for (let i = 0; i < route.variants.length; i++) {
      let included = true;
      this.#activeFilterList.forEach(filterId => {
        let filter = this.#allFilters[filterId];
        if (filter.isVariantDefined) {
          included = this.routeIsIncluded(filter, route.variants[i]);
        }
      });
      if (included) {
        matchingVariantFound = true;
        break;
      }
    }

    return {route: false, variants: matchingVariantFound}; 
  }

  // check if a route is filtered out by the given filter or not
  routeIsIncluded(filter, route) {
    let included = true;
    switch (filter.state) {
      case ONLY:
        included = filter.apply(route);
        break;
      case NO:
        included = !filter.apply(route);
        break;
    }
    return included;
  }

  // If any variant matches the route is included
  checkVariants(route) {
    let included = false;
    if (route.hasVariants) {
      route.variants.every(variant => {
        if (this.applyActiveFilters(variant, true)) included = true;
        return included;
      })
    }
  }

  /*** Respond to click events ***/

  // Returns true if the filter limit has not been reached or the filter is already selected
  filterIsSelectable(filter) {
    let activeFilterClicked = this.#activeFilterList.has(filter.index.toString());
    let limitReached = this.#activeFilterList.size == MAX_FILTERS;

    return !limitReached || activeFilterClicked;
  }

  // Deletion cross on an active filter clicked - remove filter
  deleteActiveFilter(elementId) {
    let activeFilterId = elementId.replace("active-filter", "");
    let activeFilter = this.#allFilters[activeFilterId];
    if (this.#activeFilterList.has(activeFilterId)) {
      this.#activeFilterList.delete(activeFilterId);
      activeFilter.reset();
    }
    this.updateGrids();
  }

  // Filter icon clicked - toggle its state
  toggle(elementId) {
    let filterId = elementId.replace("filter", ""); // strip prefix to get the filter name
    let selectedFilter = this.#allFilters[filterId];

    if (selectedFilter.enabled) {
        selectedFilter.toggle();
      if (selectedFilter.isOff) {
        this.#activeFilterList.delete(filterId);
      } else {
        this.#activeFilterList.add(filterId);
      }
      this.updateGrids();
    }
  }

  // Turn everything off and empty active filter list
  clearAllFilters() {
    this.#allFilters.forEach(filter => {
      filter.toggle(STATE_OFF);
    });
    this.#activeFilterList.clear();
    this.updateGrids();
  }

  // Deletes favourites and updates the routes grid accordingly before refreshing filter result
  clearFavourites() {
    favourites.clear();
    laPalmaData.routes.forEach(route => {
      document.getElementById("favourite" + route.id).src = "/img/icons/heart-empty.svg";
    })
    this.updateGrids();
    updateFavourites();
  }

  /*** Respond to location area click events ***/

  selectAllLocations() {
    if (this.filterIsSelectable(this.#locationFilter)) {
      this.#locationFilter.selectAllLocations();
      this.updateLocationFilter();
    }
  }

  clearAllLocations() {
    if (this.filterIsSelectable(this.#locationFilter)) {
      this.#locationFilter.clearAllLocations();
      this.updateLocationFilter();
    }
  }

  toggleLocationSelector(elementId) {
    if (this.filterIsSelectable(this.#locationFilter)) {
      this.#locationFilter.toggleLocationSelector(elementId);
      this.updateLocationFilter();
    }
  }

  // Changing the area selection automatically turns the filter on
  // Invalid selections (all areas or no areas) turn it off
  updateLocationFilter() {
    let filterId = this.#locationFilter.index.toString(); // active filter list uses string keys

    if (this.#locationFilter.isOff && this.#locationFilter.hasValidAreasSelection) {
      this.#locationFilter.toggle(STATE_ON);
      this.#activeFilterList.add(filterId); 
    }
    if (!this.#locationFilter.isOff && !this.#locationFilter.hasValidAreasSelection) {
      this.#locationFilter.toggle(STATE_OFF);
      this.#activeFilterList.delete(filterId);
    }
    this.updateGrids();
  }
}