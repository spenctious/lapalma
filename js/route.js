// The raw data in JSON format
var categories;
var locations;
var routes;

// Maps generated from data segments
var walkType;
var duration;
var effort;
var basics;
var interest;
var terrain;
var warnings;
var locationMap;

// Additional data
var favourites;

// For diagnostics
var reloadData = false;

// Object handling filter panel and filters within
var filterSet;


/************************* Data loading and initialization ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};

async function loadData() {
  try {
    if (reloadData || localStorage.getItem("dataLoaded") === null) {
      // read data from JSON files
      const result1 = await fetch('/data/categories.json');
      categories = await result1.json();
      const result2 = await fetch('/data/locations.json');
      locations = await result2.json();
      const result3 = await fetch('/data/routes.json');
      routes = await result3.json();

      // save it in local storage for other pages to use
      localStorage.setItem("categories", JSON.stringify(categories));
      localStorage.setItem("locations", JSON.stringify(locations));
      localStorage.setItem("routes", JSON.stringify(routes));
      localStorage.setItem("dataLoaded", "true");
    }
    else {
      // read the data from local storage if we have it
      categories = JSON.parse(localStorage.categories);
      locations = JSON.parse(localStorage.locations);
      routes = JSON.parse(localStorage.routes);
    }
    initialize();
  } catch (error) {
    console.log('Request failed', error);
  }
}

function initialize() {
  // unpack categories into maps
  walkType = new Map(categories.walkType);
  duration = new Map(categories.duration);
  effort = new Map(categories.effort);
  basics = new Map(categories.basics);
  interest = new Map(categories.interest);
  terrain = new Map(categories.terrain);
  warnings = new Map(categories.warnings);
  locationMap = new Map(locations.locations);

  favourites = new Set();
  filterSet = new FilterSet();

  filterSet.populateFilterPanel();
  populateRoutesGrid();

  // add event listeners on the routes grid and filters panel
  document.getElementById("filter").addEventListener("click", filterClickHandler);
  document.getElementById("routes-grid").addEventListener("click", routesGridClickHandler);
}


/************************* Click handlers ************************/

function filterClickHandler(event) {
  console.log(event.target);
  console.log(event.target.closest("div").id);
  let elementId = event.target.closest("div").id;

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

  // buttons to toggle selected areas for the location filter
  if (elementId.startsWith("location")) {
    filterSet.toggleLocationSelector(elementId, event.target);
    return;
  }
}

function routesGridClickHandler(event) {
  let elementId = event.target.id;
  let routeId = event.target.closest("#routes-grid > div").id;
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
  }
  else {
    // route clicked - open route detail page for the specified route
    window.location.href = `./route-detail.html?route=${routeIndex}`;
  }
}

/************************* Routes grid ************************/

function populateRoutesGrid() {
  let gridContent = "";

  for (let i = 0; i < routes.routes.length; i++) {
    let currentRoute = routes.routes[i];

    // title image
    let titleImageUrl = `/img/route${currentRoute.id}-400x300.jpg`;
    let routeId = currentRoute.id;

    // number of route varients, if any
    let routeVarients = "";
    if ('variants' in currentRoute) {
      let routeVarientCount = currentRoute.variants.length;
      routeVarients = `<span class="route-varients">
        ${routeVarientCount} variation${routeVarientCount > 1 ? "s" : ""}</span>`;
    }

    // starred
    let starred = "";
    if (currentRoute.starred == "true") {
      starred = `<div class="starred"><img src="/img/icons/star.svg" alt="" /></div>`;
    }

    // title
    let routeTitle = currentRoute.name;
    let routeShortDescription = currentRoute.shortDescription;

    // duration
    let d = duration.get(currentRoute.duration);
    let durationText = d.text;
    let durationIconUrl = `/img/icons/${d.icon}`;

    // effort
    let e = effort.get(currentRoute.effort);
    let effortText = e.text;
    let effortIconUrl = `/img/icons/${e.icon}`;

    // build html content
    gridContent += `
        <div id="route${routeId}" class="route">
          <div class="route-pic">
            <img src="${titleImageUrl}" alt="" />
            <div class="pic-label">
              <span class="route-id">${routeId}</span>
              ${routeVarients}
            </div>
            ${starred}
          </div>
          <div class="route-detail">
            <div class="title">
              <img
                id="favourite${routeId}"
                class="favourite"
                src="/img/icons/heart-empty.svg"
                alt=""
              />
              ${routeTitle}
            </div>
            <div class="description">
              ${routeShortDescription}
            </div>
            <div class="metrics">
              <div class="route-metric">
                <p>${durationText}</p>
                <img src="${durationIconUrl}" alt="" />
              </div>
              <div class="route-metric">
                <p>${effortText}</p>
                <img src="${effortIconUrl}" alt="" />
              </div>
            </div>
          </div>
        </div>`;
  }
  document.getElementById("routes-grid").innerHTML = gridContent;
};

// Hide routes that don't fit the current filters
// Update count of filters and matches
function filterRoutes() {
  let matchesCount = 0;

  // hide filtered out routes and update count of how many are matched
  routes.routes.forEach(route => {
    let included = filterSet.applyActiveFilters(route);
    let routeDiv = document.getElementById("route" + route.id);
    if (included) {
      routeDiv.style.display = "block";
      matchesCount++;
    }
    else {
      routeDiv.style.display = "none";
    }
  });

  // update match count
  let matchCountText = document.getElementById("match-count");
  switch (matchesCount) {
    case 0:
      matchCountText.innerHTML = "No matches";
      break;
    case 1:
      matchCountText.innerHTML = "1 match";
      break;
    default:
      matchCountText.innerHTML = matchesCount + " matches";
      break;
  }

  // update filter count
  let filtersCount = filterSet.activeFilterCount;
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

  constructor(category, toggle) {
    this.#category = category;
    this.#toggleControl = toggle;
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

  // getters and setters
  set index(index) { this.#index = index; }
  get index() { return this.#index; }
  get id() { return "filter" + this.#index; }
  get icon() { return this.#category.icon; }
  get state() { return this.#toggleControl.state; }

  get text() {
    return this.state == ONLY ? this.#category.filterIncludeText : this.#category.filterExcludeText;
  }

  get html() {
    let filterHtml =
      `<div id="${this.id}" class="icon">
      <img src="/img/icons/${this.icon}" class="icon-img" alt="" />
      <img id="${this.id + "cross"}" class="filter-status" src="/img/icons/red-cross.svg" style="display: none;" alt="" />
      <img id="${this.id + "tick"}" class="filter-status" src="/img/icons/green-tick.svg" style="display: none;" alt="" />
    </div>`;
    return filterHtml;
  }

  #updateScreenStatus() {
    let tick = document.getElementById(this.id + "tick");
    let cross = document.getElementById(this.id + "cross");
    switch (this.#toggleControl.state) {
      case OFF:
        tick.style.display = "none";
        cross.style.display = "none";
        break;

      case ONLY:
        tick.style.display = "block";
        cross.style.display = "none";
        break;

      case NO:
        tick.style.display = "none";
        cross.style.display = "block";
        break;
    }
  }
}

/**** Derived filter classes - actual filters ****/

class Starred extends Filter {
  constructor() {
    super(basics.get("starred"), new Toggle(INCLUDE))
  }

  apply(route) {
    return route.starred == "true";;
  }
}

class Favourite extends Filter {
  constructor() {
    super(basics.get("favourite"), new Toggle(INCLUDE))
  }

  apply(route) {
    return favourites.has(route.id);
  }
}

class ShortWalk extends Filter {
  constructor() {
    super(duration.get("half"), new Toggle(INCLUDE));
  }

  apply(route) {
    return route.duration == "stroll" || route.duration == "half";
  }
}

class BasicAttribute extends Filter {
  #specificAttribute;

  constructor(specificAttribute) {
    super(basics.get(specificAttribute), new Toggle(INCLUDE));
    this.#specificAttribute = specificAttribute;
  }

  apply(route) {
    return (this.#specificAttribute in route) && (route[this.#specificAttribute] == "true");
  }
}

class WalkType extends Filter {
  #specificType;

  constructor(specificType) {
    super(walkType.get(specificType), new Toggle(INCLUDE));
    this.#specificType = specificType;
  }

  apply(route) {
    return route.walkType == this.#specificType;
  }
}

class Interest extends Filter {
  #specificInterest;

  constructor(specificInterest) {
    super(interest.get(specificInterest), new Toggle(INCLUDE));
    this.#specificInterest = specificInterest;
  }

  apply(route) {
    return this.#specificInterest in route.interest;
  }
}

class Terrain extends Filter {
  #specificTerrain;
  constructor(specificTerrain) {
    super(terrain.get(specificTerrain), new Toggle(INCLUDE));
    this.#specificTerrain = specificTerrain;
  }

  apply(route) {
    return this.#specificTerrain in route.terrain;
  }
}

class Warning extends Filter {
  #strong;
  #specificWarning;

  constructor(specificWarning, strong) {
    super(warnings.get(specificWarning), new Toggle(EXCLUDE));
    this.#strong = strong;
    this.#specificWarning = specificWarning;
  }

  apply(route) {
    return (this.#specificWarning in route.warnings) && (route.warnings[this.#specificWarning] == this.#strong);
  }
}

//
// Handles the linked location selector grid as well as the location filter
//
class Location extends Filter {
  #locationAreas;
  #allAreasOff;
  #allAreasOn;

  constructor() {
    super(categories.walkLocations, new Toggle(INCLUDE));

    this.#allAreasOff = true;
    this.#allAreasOn = false;

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
    locationMap.forEach((locationDetail, locationName) => {
      locationDetail.areas.forEach(area => {
        let areaSet = this.#locationAreas.get(area).locations;
        areaSet.add(locationName);
      })
    });
  }

  /*** Accessors ***/

  // Returns the HTML for the area selector buttons
  get locationSelectorsHtml() {
    let locationSelectorsHtml = "";
    for (let [areaName, area] of this.#locationAreas) {
      locationSelectorsHtml += `
        <div id="location-${areaName}" class="filter-button">${area.buttonName}</div>`;
    }
    return locationSelectorsHtml;
  }

  // Returns false if all areas are selected or no areas selected, true otherwise
  // In other words, true only if the selection makes sense as a filter
  get hasValidAreasSelection() {
    this.#allAreasOff = true;
    this.#allAreasOn = true;
    this.#locationAreas.forEach(area => {
      area.toggle.isOff ? this.#allAreasOn = false : this.#allAreasOff = false;
    });
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
    let locationKey = elementId.replace("location-", ""); // strip prefix to get the filter key
    this.setLocationSelector(locationKey);
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

  // Helper method to set the area to the specified state and update the button state accordingly
  setLocationSelector(areaKey, targetState) {
    let area = this.#locationAreas.get(areaKey);
    let locationButton = document.getElementById("location-" + areaKey);
    area.toggle.toggle(targetState);
    if (area.toggle.isOff) {
      locationButton.className = "filter-button"
    } else {
      locationButton.className = "filter-button-on"
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
      if (!area.toggle.state.isOff) {
        included = area.locations.has(location);
        if (included) break; // no need to look any further
      }
    }
    return included;
  }
}

//
// Handles the filter panel as a whole updating the active filter panel, locations grid,
// favourites and routes grid according to the user selections
//
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
    this.addGeneralFilter(new Starred());
    this.addGeneralFilter(new Favourite());
    this.addCategoryFilter(new WalkType("circular"));
    this.addCategoryFilter(new Interest("archeological"));
    this.addCategoryFilter(new Terrain("dragon"));
    this.addCategoryFilter(new Warning("gps", false));
    this.addCategoryFilter(new BasicAttribute("accessCar"));
    this.addCategoryFilter(new Interest("peaks"));
    this.addCategoryFilter(new Terrain("volcanic"));
    this.addCategoryFilter(new Warning("steep", true));
    this.addCategoryFilter(new BasicAttribute("accessBus"));
    this.addCategoryFilter(new Interest("poi"));
    this.addCategoryFilter(new Terrain("laurisilva"));
    this.addCategoryFilter(new Warning("slippery", true));
    this.addCategoryFilter(new ShortWalk());
    this.addCategoryFilter(new Interest("port"));
    this.addCategoryFilter(new Terrain("coastal"));
    this.addCategoryFilter(new Warning("vertigo", true));
    this.addCategoryFilter(new BasicAttribute("waymarked"));
    this.addCategoryFilter(new Interest("scenic"));
    this.addCategoryFilter(new Terrain("pine"));
    this.addCategoryFilter(new Warning("weather", false));
    this.addLocationFilter(new Location());

    this.#activeFilterList = new Set();

    this.populateFilterPanel();
    this.updateActiveFilterGrid();
  }

  /*** Initialization ***/

  // Add a filter to the collection and assign the collection index as the id
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

  addLocationFilter(filter) {
    this.addFilter(filter);
    this.#locationFilterHtml = filter.html;
    this.#locationFilter = filter;
  }

  // Add grid content to the filter panel
  populateFilterPanel() {
    // general filters
    let generalFilterGridContent = `<div id="clear-favourites" class="text-button">Clear favourites</div>`;
    generalFilterGridContent += this.#generalFiltersHtml;
    document.getElementById("general-filter-grid").innerHTML = generalFilterGridContent;

    // category filters
    let categoryFilterGridContent = `
    <div class="feature-heading">Basic</div>
    <div class="feature-heading">Interest</div>
    <div class="feature-heading">Terrain</div>
    <div class="feature-heading">Warnings</div>`;
    categoryFilterGridContent += this.#categoryFiltersHtml;
    document.getElementById("category-filter-grid").innerHTML = categoryFilterGridContent;

    // location filters
    let locationFilterGridContent = this.#locationFilterHtml;
    locationFilterGridContent += `
    <div id="location-message">${this.locationFilterMessage}</div>
    <div id="location-area-grid">`;
    locationFilterGridContent += this.#locationFilter.locationSelectorsHtml;
    locationFilterGridContent += `
    <div id="all-locations" class="text-button">Select All</div>
    <div id="no-locations" class="text-button">Select None</div>
    </div>`;
    document.getElementById("location-filter-grid").innerHTML = locationFilterGridContent;
  }

  /*** Accessors ***/

  get activeFilterCount() {
    return this.#activeFilterList.size;
  }

  get locationFilterMessage() {
    if (this.#locationFilter.allAreasSelected) return "Remove one or more areas to apply filter.";
    if (this.#locationFilter.noAreasSelected) return "Add one or more areas to apply filter.";
    return "";
  }

  /*** Update methods ***/

  updateGrids() {
    this.updateActiveFilterGrid();
    this.updateLocationMessage();
    filterRoutes();
  }

  updateLocationMessage() {
    document.getElementById("location-message").innerHTML = this.locationFilterMessage;
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
          <div class="active-filter-${filter.state}">
            <div>${filter.state}</div>
            <div>${filter.text}</div>
            <div id="active-${filter.id}" class="close-cross">&times;</div>
          </div>`
      });
    }
    document.getElementById("active-filter-grid").innerHTML = activeFilterGridContents;
  }

  /*** Filter application ***/

  applyActiveFilters(route) {
    let included = true;
    // Keep applying active filters until one of them rules a route out
    this.#allFilters.every(filter => {
      switch (filter.state) {
        case ONLY:
          included = filter.apply(route);
          break;
        case NO:
          included = !filter.apply(route);
          break;
      }
      return included;
    });
    return included;
  }

  /*** Respond to click events ***/

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
    selectedFilter.toggle();

    if (selectedFilter.isOff) {
      this.#activeFilterList.delete(filterId);
    } else {
      this.#activeFilterList.add(filterId);
    }
    this.updateGrids();
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
    routes.routes.forEach(route => {
      document.getElementById("favourite" + route.id).src = "/img/icons/heart-empty.svg";
    })
    this.updateGrids();
  }

  /*** Respond to location area click events ***/

  selectAllLocations() {
    this.#locationFilter.selectAllLocations();
    this.updateLocationFilter();
  }

  clearAllLocations() {
    this.#locationFilter.clearAllLocations();
    this.updateLocationFilter();
  }

  toggleLocationSelector(elementId) {
    this.#locationFilter.toggleLocationSelector(elementId);
    this.updateLocationFilter();
  }

  // Changing the area selection automatically turns the filter on
  // Invalid selections (all areas or no areas) turn it off
  updateLocationFilter() {
    let filterChanged = false;
    let filterId = this.#locationFilter.index.toString(); // active filter list uses string keys

    if (this.#locationFilter.isOff && this.#locationFilter.hasValidAreasSelection) {
      this.#locationFilter.toggle(STATE_ON);
      this.#activeFilterList.add(filterId); 
      filterChanged = true;
    }
    if (!this.#locationFilter.isOff && !this.#locationFilter.hasValidAreasSelection) {
      this.#locationFilter.toggle(STATE_OFF);
      this.#activeFilterList.delete(filterId);
      filterChanged = true;
    }
    if (filterChanged) {
      this.updateGrids();
    }
    this.updateLocationMessage();
  }
}