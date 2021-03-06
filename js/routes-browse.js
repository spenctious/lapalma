"use strict";

const MAX_FILTERS = 3;

// object handling filter panel and filters within
var filterSet;

// route selection status - values will be "in" or "out"
var selectedRoutes;

/************************* Initialization ************************/

// wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadDataThen(initialize);
};


// initial setup
function initialize() {

  // initially all routes are included (in numeric order)
  selectedRoutes = new Map();
  laPalmaData.routes.forEach(route => selectedRoutes.set(route.id, "in"));
  
  // create the filters and populate the routes grid
  filterSet = new FilterSet();
  filterSet.populateFilterPanel();
  populateRoutesGrid();

  // add event listeners
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("filter-overlay").addEventListener("click", closeFilterPanel);
  
  document.getElementById("browse-grid").addEventListener("click", routesGridClickHandler);
  document.getElementById("area-map").addEventListener("click", locationGridClickHandler);
  document.getElementById("filter-button").addEventListener("click", filterButtonClickHandler);

  // restore filter state if set
  // ensures navigating back after looking at a route's detail does not lose the set filters
  let retrievedState = window.history.state;
  if (retrievedState != undefined && retrievedState != null && JSON.stringify(retrievedState) != '{}') {
    filterSet.restoreState(retrievedState);
  }

  filterRoutes();
}



/************************* URL parameter handling ************************/


// note: should not be possible to call this method unless there is at least one route 
// not filtered out 
function getDetailPageQueryString(selectedRouteIndex) {
  // get route ids for all routes not filtered out
  let collection = "";
  selectedRoutes.forEach((state, id) => {
    if (state == "in") collection += id + ",";
  });
  if (collection.endsWith(',')) collection = collection.slice(0, -1); // strip trailing comma

  return `?${URL_PARAM_ROUTE}=${selectedRouteIndex}&${URL_PARAM_COLLECTION}=${collection}&${URL_PARAM_STEPS}=-1`;
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


// handle filter panel clicks
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


// handle clicks on the location image map
function locationGridClickHandler(event) {
  let elementId = event.target.id;
  filterSet.toggleLocationSelector(elementId);
}


// handle clicks for the routes grid
function routesGridClickHandler(event) {
  let elementId = event.target.id;
  let routeId = event.target.closest("#browse-grid > div").id;
  let routeIndex = routeId.replace("route", "")

  if (elementId.startsWith("favourite")) {
    // favourites icon clicked - toggle it
    if (favourites.has(routeIndex)) {
      favourites.delete(routeIndex);
      event.target.src = "img/icons/heart-empty.svg";
    } else {
      favourites.add(routeIndex);
      event.target.src = "img/icons/heart-full-black.svg";
    }
    filterSet.updateFavourites();
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

    window.location.href = `routes-detail.html${getDetailPageQueryString(routeIndex)}`;
  }
}



/************************* Routes grid ************************/


// populate the main grid:
// - Default content (usually hidden) for when there are no matched routes
// - Grid of routes, each of which contains:
//  - image with overlays for:
//    - route id
//    - number of variations (if any)
//    - star for highly recommended routes
//    - banner (usually hidden) to indicate a vairation matches
//  - description
//  - favourite icon selector
//  - basic stats icons and text for route duration and effort
//
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
      routeVarients = `
        <div class="route-varients">
          ${routeVarientCount} variation${routeVarientCount > 1 ? "s" : ""}
        </div>`;
    } else {
      routeVarients = `<div></div>`;
    }

    // starred
    let starred = "";
    if (route.isStarred) {
      starred = `
        <div class="starred">
          <img src="img/icons/${route.starredAttributes.icon}" alt="" />
        </div>`;
    } else {
      starred = `<div></div>`;
    }

    // favourite
    let favouriteIcon = favourites.has(route.id) ? "heart-full-black.svg" :  "heart-empty.svg";

    // build html content
    gridContent += `
        <div id="route${route.id}" class="item">
          <div class="item-pic">
            <img src="img/route${route.id}-01-250x187.webp" width="250" height="187" alt="" />
            <div class="pic-label">
              <div class="item-id">${route.id}</div>
              ${routeVarients}
              ${starred}
            </div>
            <div class="variant-match" id="variant-match${route.id}">Variation matches</div>
          </div>
          <div class="item-detail">
            <div class="title">
              <img
                id="favourite${route.id}"
                class="favourite"
                src="img/icons/${favouriteIcon}"
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
                <img src="img/icons/${route.durationAttributes.icon}" alt="" />
              </div>
              <div class="route-metric">
                <p>${route.effortAttributes.text}</p>
                <img src="img/icons/${route.effortAttributes.icon}" alt="" />
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

  laPalmaData.routes.forEach(route => {
    // check both the route and variants for a match
    let included = filterSet.applyActiveFilters(route);

    // elements to update
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
      // hide those that don't match
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

  // update filter count
  let filterCount = filterSet.activeFilterCount.toString();
  let filterClass = "active-filters";
  if (filterSet.activeFilterCount == 0) {
    filterCount = "OFF";
    filterClass = "active-filters none";
  }

  // update header with matches and filter count
  document.getElementById("header-title").innerHTML = `
    ${routeCount}
    <span class="${filterClass}">
      <img src="img/icons/funnel-fill.svg" alt=""> ${filterCount}
    </span>
    `;
}



/************************* Filter classes ************************/


// toggle states
const OFF = "OFF";
const ONLY = "ONLY";
const NO = "NO";
const ON = "ON";

// indexes for explicitly setting a toggle state
const STATE_OFF = 0;
const STATE_ON = 1;

// possible toggle state cycles
const INCLUDE = ["OFF", "ONLY"]; // positive attributes to be ruled in
const EXCLUDE = ["OFF", "NO"];  // undesirable attributes to be ruled out
const OFF_ON = ["OFF", "ON"];

// handles filter state of walk attributes
// allows for tri-state toggling if needed in the future 
// (e.g. off-only-on or off-only-only:strong)
//
class Toggle {
  #currentState;
  #states;

  // takes an array of states as defined in one of the above constants
  constructor(states) {
    this.#states = states;
    this.#currentState = 0;
  }


  // if targetState is specified move to that state, otherwise
  // move to the next toggle state which 'wraps around' back to 0
  toggle(targetState) {
    if (typeof targetState == 'undefined') {
      this.#currentState = ++this.#currentState % this.#states.length;
    }
    else {
      this.#currentState = targetState;
    }
  }


  // returns the actual state value
  get state() {
    return this.#states[this.#currentState];
  }


  // OFF should be the first state of any sequence
  get isOff() {
    return this.#currentState == 0;
  }
}



/******************************* Filter classes *******************************/


// base filter class - handles basic toggling and drawing of the filter
// derrived classes must supply an apply() method for filtering
//
class Filter {

  #index;
  #category;
  #toggleControl;
  #name;
  #isVariantDefined; // true if the filter is explicitly defined by variant walks, flase otherwise
  isEnabled;

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


  enable(enableStatus) {
    this.isEnabled = enableStatus;
    this.#updateScreenStatus();
  }


  //
  // public methods
  //


  get isOff() {
    return this.#toggleControl.isOff;
  }


  get isVariantDefined() { 
    return this.#isVariantDefined; 
  }


  set enabled(state) {
    this.isEnabled = state;
    this.#updateScreenStatus();
  }


  get enabled() { 
    return this.isEnabled; 
  }


  get name() { 
    return this.#name; 
  }


  set index(index) { 
    this.#index = index; 
  }


  get index() { 
    return this.#index; 
  }


  get id() { 
    return "filter" + this.#index; 
  }


  // the default category icon may not be suitable for using as a filter icon so 
  // if a specific filter icon is defined, use that in preference
  get icon() { 
    return "filterIcon" in this.#category ? this.#category.filterIcon : this.#category.icon; 
  }


  get state() { 
    return this.#toggleControl.state; 
  }


  get text() {
    return this.state == ONLY ? this.#category.filterIncludeText : this.#category.filterExcludeText;
  }

  
  // filter icons have unique ids and may be disabled
  get html() {
    let filterHtml =
    `<div id="${this.id}" class="icon ${this.enabled ? '' : ' disabled'}">
      <img src="img/icons/${this.icon}" class="icon-img" alt="" />
    </div>`;
    return filterHtml;
  }


  // turn on filter that was previously off
  enableInactive(setEnabled) {
    if (this.state == OFF) {
      this.enabled = setEnabled;
    }
  }


  //
  // private methods
  //

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



/******************************* Derived filter classes - actual filters *******************************/

// derrived filter classes must:
// - initialize the base class with
//  - name
//  - category object (from which icon etc. can be read)
//  - toggle values (include or exclude)
//  - whether or not the category is defined by variant walks or not (default false)
// - define an apply() method to do the actual filtering

class Starred extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("starred"), new Toggle(INCLUDE))
  }


  apply(route) {
    return route.isStarred;
  }
}


/******************************* Favourite *******************************/

class Favourite extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("favourite"), new Toggle(INCLUDE));
    super.isEnabled = this.hasFavourites;
  }


  apply(route) {
    return favourites.has(route.id);
  }


  updateEnabled() {
    super.enable(this.hasFavourites);
  }


  // override of the base class - only re-enable if there are favourites
  enableInactive(setEnabled) {
    super.enableInactive(setEnabled && this.hasFavourites);
  }


  get hasFavourites() {
    return favourites.size > 0;
  }
}


/******************************* ShortWalk *******************************/

class ShortWalk extends Filter {
  constructor(name) {
    super(name, laPalmaData.duration.get("half"), new Toggle(INCLUDE), true);
  }


  apply(route) {
    return route.isShort;
  }
}


/******************************* AccessCar *******************************/

class AccessCar extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("accessCar"), new Toggle(INCLUDE), true);
  }


  apply(route) {
    return route.isAccessibleByCar;
  }
}


/******************************* AccessBus *******************************/

class AccessBus extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("accessBus"), new Toggle(INCLUDE), true);
  }


  apply(route) {
    return route.isAccessibleByBus;
  }
}


/******************************* Waymarked *******************************/

class Waymarked extends Filter {
  constructor(name) {
    super(name, laPalmaData.basics.get("waymarked"), new Toggle(INCLUDE));
  }


  apply(route) {
    return route.isCompletelyWaymarked;
  }
}


/******************************* WalkType *******************************/

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


/******************************* Interest *******************************/

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


/******************************* Terrain *******************************/

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


/******************************* Warning *******************************/

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


/******************************* Location *******************************/

// handles the associated location selector grid as well as the location filter
class Location extends Filter {
  #locationAreas;
  #allAreasOff;
  #allAreasOn;

  constructor(name) {
    super(name, laPalmaData.categories.walkLocations, new Toggle(INCLUDE));

    this.#allAreasOff = true;
    this.#allAreasOn = false;
    super.isEnabled = false;

    // create and populate location area sets
    this.#locationAreas = new Map(
      [
        ["north", { toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["west", { toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["central", { toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["east", { toggle: new Toggle(OFF_ON), locations: new Set() }],
        ["south", { toggle: new Toggle(OFF_ON), locations: new Set() }],
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


  // only enable filter if valid areas have been selected
  enableInactive(setEnabled) {
    if (!this.#allAreasOff && !this.#allAreasOn) super.enableInactive(setEnabled);
  }


  // checks for invalid selection states
  // all areas selected or no areas selected are invalid filter states
  checkAreasAreValid() {
    this.#allAreasOff = true;
    this.#allAreasOn = true;
    this.#locationAreas.forEach(area => {
      area.toggle.isOff ? this.#allAreasOn = false : this.#allAreasOff = false;
    });
  }


  //
  // Accessors
  //


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


  //
  // area button click handlers
  //


  // update location selector appearance and toggle state
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


  // helper method to set the area to the specified state and update the map accordingly
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


  //
  // filtering
  //


  apply(route) {
    return this.isInSelectedAreas(route.start) || this.isInSelectedAreas(route.end);
  }


  // returns true only if specified location is in the selected areas
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



/******************************* FilterSet *******************************/


// handles the filter panel as a whole updating the active filter panel, locations grid,
// favourites and routes grid according to the user selections
class FilterSet {
  #allFilters;
  #filterIndex;
  #locationFilter;
  #favouritesFilter;
  #activeFilterList;
  #generalFiltersHtml;
  #categoryFiltersHtml;
  #locationFilterHtml;

  constructor() {
    this.#generalFiltersHtml = "";
    this.#categoryFiltersHtml = "";
    this.#locationFilterHtml = "";

    // filters are added in order they are laid out in HTML
    this.#allFilters = new Array();
    this.#filterIndex = 0;
    this.addGeneralFilter(new Starred("starred"));
    this.addFavouriteslFilter(new Favourite("favourites"));

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


  //
  // initialization
  //


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

    // users may change favourites in details page so check if the favourites
    // filter was on but is no longer applicable and if so remove it
    if (!this.#favouritesFilter.isOff && favourites.size == 0) {
      this.#favouritesFilter.toggle();
      this.#activeFilterList.delete(this.#favouritesFilter.index.toString());
    }

    this.updateGrids();
  }


  // add a filter to the collection and assign the collection index as the id
  addFilter(filter) {
    filter.index = this.#filterIndex++;
    this.#allFilters.push(filter);
  }


  //
  // specific add methods build up HTML for injection into respective grids
  //

  addFavouriteslFilter(filter) {
    this.#favouritesFilter = filter;
    this.addGeneralFilter(filter);
  }


  addGeneralFilter(filter) {
    this.addFilter(filter);
    this.#generalFiltersHtml += filter.html;
  }


  addCategoryFilter(filter) {
    this.addFilter(filter);
    this.#categoryFiltersHtml += filter.html;
  }


  addLocationFilter(filter) {
    this.addFilter(filter);
    this.#locationFilterHtml = filter.html;
    this.#locationFilter = filter;
  }


  //
  // filter headings
  //


  startCategory(label) {
    this.#categoryFiltersHtml += `<div class="feature-heading">${label}</div><div class="filter-row">`;
  }


  endCategory() {
    this.#categoryFiltersHtml += `</div>`;
  }


  //
  // populate
  //

  // add grid content to the filter panel:
  // - general filters for starred and favourites
  // - category filters
  // - location filter with SVG image map of areas
  //
  // N.B.
  //  - image map background is set as a background image on the element in CSS
  //  - image map derived from Figma file in assets folder (modified)
  //
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


  //
  // accessors
  //

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


  //
  // update methods
  //


  updateFavourites() {
    if (!this.#favouritesFilter.isOff) {
      this.toggle(this.#favouritesFilter.id);
    }
    if (!this.filterLimitReached) {
      this.#favouritesFilter.updateEnabled();
    }
  }

  updateGrids() {
    this.updateActiveFilterGrid();
    this.updateLocationStatus();
    this.updateFilterIcons();
    filterRoutes();
  }


  // updates the location filter to reflect the area selection status
  updateLocationStatus() {
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


  // redraws active filter grid replacing old contents
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


  //
  // filtering
  //


  // variant filters are assumed to inherit their parent walk's attributes
  // unless the filter is explicitly defined by a variant
  // returns match status for both the main route and the variants
  applyActiveFilters(route) {
    let matchesCommonFilters = true;
    let matchesVariantFilters = true;

    // check the route to see if its filtered out or not
    this.#activeFilterList.forEach(filterId => {
      let filter = this.#allFilters[filterId];
      // record point of failure: common filters or ones shared with variants
      if (!this.routeIsIncluded(filter, route)) {
        if (filter.isVariantDefined) {
          matchesVariantFilters = false;
        } else {
          matchesCommonFilters = false;
        }
      }
    });

    // if there is no match on the common filters then the route doesn't match period 
    // and there's no need to check the variants
    if (!matchesCommonFilters) {
      return {route: false, variants: false}; 
    }

    // if the main route matches completely, there is also no need to check the variants
    // as we don't care - we have a match already
    if (matchesCommonFilters && matchesVariantFilters) {
      return {route: true, variants: undefined}; 
    }

    // matched on the main filters but not the variant filters
    // but if there are no variants there's no match
    if (!route.hasVariants) {
      return {route: false, variants: false}; 
    }

    // matched on the main filters so see if one of them matches the variant filters
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


  //
  // responses to click events
  //


  // returns true if the filter limit has not been reached or the filter is already selected
  filterIsSelectable(filter) {
    let activeFilterClicked = this.#activeFilterList.has(filter.index.toString());
    let limitReached = this.#activeFilterList.size == MAX_FILTERS;

    return !limitReached || activeFilterClicked;
  }


  // deletion cross on an active filter clicked - remove filter
  deleteActiveFilter(elementId) {
    let activeFilterId = elementId.replace("active-filter", "");
    let activeFilter = this.#allFilters[activeFilterId];
    if (this.#activeFilterList.has(activeFilterId)) {
      this.#activeFilterList.delete(activeFilterId);
      activeFilter.reset();
    }
    this.updateGrids();
  }


  // filter icon clicked - toggle its state
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


  // turn everything off and empty active filter list
  clearAllFilters() {
    this.#allFilters.forEach(filter => {
      filter.toggle(STATE_OFF);
    });
    this.#activeFilterList.clear();
    this.updateGrids();
  }


  // deletes favourites and updates the routes grid accordingly before refreshing filter result
  clearFavourites() {
    favourites.clear();
    laPalmaData.routes.forEach(route => {
      document.getElementById("favourite" + route.id).src = "img/icons/heart-empty.svg";
    })
    updateFavourites();
    this.updateFavourites();
    this.updateGrids();
  }


  //
  // Respond to location area click events
  //


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


  // changing the area selection automatically turns the filter on
  // invalid selections (all areas or no areas) turn it off
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