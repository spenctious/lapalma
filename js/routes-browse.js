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
  
  laPalmaData.routes.forEach(route => {
    // number of route varients, if any
    let routeVarients = "";
    if (route.hasVariants) {
      routeVarients = `
        <div class="route-varients">
          ${route.variantsCount} variation${route.variantsCount > 1 ? "s" : ""}
        </div>`;
    } else {
      routeVarients = `<div></div>`;
    }

    // starred
    let starred = "";
    if (route.isStarred) {
      starred = `
        <div class="starred">
          <img src="img/icons/${route.starredIcon}" alt="" />
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
              ${route.short_description}
            </div>
            <div class="metrics">
              <div class="route-metric">
                <p>${route.durationAttributes.label}</p>
                <img src="img/icons/${route.durationAttributes.icon}" alt="" />
              </div>
              <div class="route-metric">
                <p>${route.effortAttributes.label}</p>
                <img src="img/icons/${route.effortAttributes.icon}" alt="" />
              </div>
            </div>
          </div>
        </div>`;
      })
      document.getElementById("browse-grid").innerHTML = gridContent;
};


// hide routes that don't fit the current filters
// update count of filters and matches
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


/******************************* Filter classes *******************************/


// enum substitute for filter states
const FilterState = {
  Disabled: "Disabled",
  Off: "Off",
  On: "On"
}



// base filter class
// - apply and text methods must be supplied by derrived classes
// - index values assigned in object creation order from 0 
class Filter {

  #index;
  #state;
  #category;
  #name;
  #onClass;
  #icon;

  static currentIndex = 0;

  constructor(name, onClass, alternativeIcon) {
    // assign next index
    this.#index = Filter.currentIndex++;

    // default state, may be overriden by derrived classes
    this.#state = FilterState.Off;

    // either 'included' or 'excluded' - set by derrived class constructors
    this.#onClass = onClass;

    // category name
    this.#name = name;

    // category attributes 
    this.#category = laPalmaData.categories.find(c => c.name == name);

    // specific attribute often referenced
    this.#icon = alternativeIcon == undefined ? this.#category.icon : alternativeIcon;
  }

  updateState(filterLimitReached) {
    switch (this.state) {
      case FilterState.Disabled:
        if (!filterLimitReached && this.isInternallyValid) this.state = FilterState.Off;
        break;
      case FilterState.Off:
        if (filterLimitReached) this.state = FilterState.Disabled;
        break;
      case FilterState.On:
        // leave on
        break;
    }
  }


  //
  // Accessors
  //


  // override in derrived classes
  get isInternallyValid() { 
    return true; 
  }


  // used to initialize the state without updatung the UI which may not be ready yet
  set defaultState(defaultState) {
    this.#state = defaultState;
  }


  // updates the state and refreshes on screen
  set state(newState) {
    this.#state = newState;
    this.#updateScreenStatus();
  }


  get state() {
    return this.#state;
  }


  // locates filter in map of all filters (in FilterSet)
  get index() { 
    return this.#index; 
  }


  // id used in UI
  get id() { 
    return "filter" + this.#index; 
  }


  get icon() { 
    return this.#icon; 
  }


  get category() {
    return this.#category;
  }

  
  // returns HTML to draw filter icon in current state
  get html() {
    let filterHtml =
    `<div id="${this.id}" class="${this.#getIconClasses()}">
      <img src="img/icons/${this.icon}" class="icon-img" alt="" />
    </div>`;
    return filterHtml;
  }


  //
  // private methods
  //

  #getIconClasses() {
    let iconClasses = "icon";
    switch (this.#state) {
      case FilterState.On:
        iconClasses += " " + this.#onClass;
        break;
      case FilterState.Disabled:
        iconClasses += " disabled";
      default:
        break;
    }
    return iconClasses;
  }

  #updateScreenStatus() {
    document.getElementById(this.id).className = this.#getIconClasses();
  }
}


/******************************* Inclusion *******************************/


class IncludeFilter extends Filter {
  constructor(name, alternativeIcon) {
    super(name, "included", alternativeIcon);
  }

  // used in the active filter box
  get filterTypeText() { 
    return "ONLY"; 
  }


  get text() {
    return this.category.include_text;
  }


  // does the route have the given attibute or not?
  apply(route) {
    return route.attributes.find(c => c.feature_name == this.category.name) != undefined;
  }
}



/******************************* Exclusion *******************************/


class ExcludeFilter extends Filter {

  #anyStrength;

  constructor(name, anyStrength) {
    super(name, "excluded");
    this.#anyStrength = anyStrength;
  }


  get text() {
    return this.category.exclude_text;
  }


  // used in the active filter box
  get filterTypeText() { 
    return "NO"; 
  }


  // rule route out if
  // - the specified attribute is missing OR
  // - the specified attribute is present but not the specified strength
  apply(route) {
    let category = route.attributes.find(c => c.feature_name == this.category.name);
    return !(category != undefined && (this.#anyStrength || category.isStrong));
  }
}


/******************************* Favourite *******************************/


class FavouriteFilter extends IncludeFilter {
  constructor() {
    super("favourite", "heart-full-black.svg");
    this.defaultState = this.isInternallyValid ? FilterState.Off : FilterState.Disabled;
  }


  // override in derrived classes
  get isInternallyValid() { 
    return favourites.size > 0; 
  }


  // rule route in if marked as a favourite
  apply(route) {
    return favourites.has(route.id);
  }
}


/******************************* Short walks *******************************/


class ShortWalkFilter extends IncludeFilter {
  constructor(name) {
    super(name, "short-walk.svg");
  }


  // rule route in if the duration is a half day or less
  apply(route) {
    return  route.attributes.find(c => c.feature_name == "stroll") != undefined || 
            route.attributes.find(c => c.feature_name == "half") != undefined;
  }
}


/******************************* Location *******************************/


//
// handles the associated location selector grid as well as the location filter
//
class LocationFilter extends IncludeFilter {
  #locationAreas;

  constructor(name) {
    super("walkLocations");

    this.#locationAreas = new Set();
    this.defaultState = FilterState.Disabled;
  }


  // checks for invalid selection states
  // all areas selected or no areas selected are invalid filter states
  get isInternallyValid() {
    return !(this.noAreasSelected || this.allAreasSelected);
  }

  get noAreasSelected() { 
    return this.#locationAreas.size == 0; 
  }

  get allAreasSelected() {
    return this.#locationAreas.size == 5; // north, west, south, east, central
  }


  //
  // Accessors
  //

  get activeLocationAreas() { 
    return Array.from(this.#locationAreas);
  }


  set activeLocationAreas(restoredActiveAreas) {
    this.#locationAreas = new Set(restoredActiveAreas);
  }


  //
  // area button click handlers
  //


  // update location selector appearance and toggle state
  toggleLocationSelector(area) {
    this.#setLocationSelector(area, !this.#locationAreas.has(area));
  }


  selectAllLocations() {
    this.#setLocationSelector("north", true);
    this.#setLocationSelector("west", true);
    this.#setLocationSelector("south", true);
    this.#setLocationSelector("east", true);
    this.#setLocationSelector("central", true);
  }


  clearAllLocations() {
    this.#setLocationSelector("north", false);
    this.#setLocationSelector("west", false);
    this.#setLocationSelector("south", false);
    this.#setLocationSelector("east", false);
    this.#setLocationSelector("central", false);
  }


  // helper method to set the area to the specified state and update the map accordingly
  #setLocationSelector(area, isSelected) {
    if (isSelected) {
      this.#locationAreas.add(area);
    }
    else {
      this.#locationAreas.delete(area);
    }

    // className for an SVG path is an SVGAnimatedString so we need to use the 
    // SetAttribute method instead of assigning a string as we would with HTML
    let locationMapArea = document.getElementById(area);
    locationMapArea.setAttribute("class", isSelected ? "area-selected" : "area-deselected");
  }


  //
  // filtering
  //

  apply(route) {
    for (let a of route.startAttributes.areas) {
      if (this.#locationAreas.has(a)) return true;
    }
    for (let a of route.finishAttributes.areas) {
      if (this.#locationAreas.has(a)) return true;
    }
    return false;
  }
}



/******************************* FilterSet *******************************/


//
// handles the filter panel as a whole updating the active filter panel, locations grid,
// favourites and routes grid according to the user selections
//
class FilterSet {
  #allFilters;

  // specific special filters
  #locationFilter;
  #favouritesFilter;

  // set of currently selected filters
  #activeFilterList;

  // content holders for filter areas
  #generalFiltersHtml;
  #categoryFiltersHtml;
  #locationFilterHtml;

  constructor() {
    this.#generalFiltersHtml = "";
    this.#categoryFiltersHtml = "";
    this.#locationFilterHtml = "";

    // filters are added in order they are laid out in HTML
    this.#allFilters = new Array();
    this.#addGeneralFilter(new IncludeFilter("starred", "star-black.svg"));
    this.#addFavouriteslFilter(new FavouriteFilter());

    this.#startCategory("Basic");
    this.#addCategoryFilter(new IncludeFilter("circular"));
    this.#addCategoryFilter(new IncludeFilter("accessCar"));
    this.#addCategoryFilter(new IncludeFilter("accessBus"));
    this.#addCategoryFilter(new ShortWalkFilter("half"));
    this.#addCategoryFilter(new IncludeFilter("waymarked"));
    this.#endCategory();

    this.#startCategory("Interest");
    this.#addCategoryFilter(new IncludeFilter("archeological"));
    this.#addCategoryFilter(new IncludeFilter("peaks"));
    this.#addCategoryFilter(new IncludeFilter("poi"));
    this.#addCategoryFilter(new IncludeFilter("port"));
    this.#addCategoryFilter(new IncludeFilter("scenic"));
    this.#endCategory();

    this.#startCategory("Terrain");
    this.#addCategoryFilter(new IncludeFilter("dragon"));
    this.#addCategoryFilter(new IncludeFilter("volcanic"));
    this.#addCategoryFilter(new IncludeFilter("laurisilva"));
    this.#addCategoryFilter(new IncludeFilter("coastal"));
    this.#addCategoryFilter(new IncludeFilter("pine"));
    this.#endCategory();

    this.#startCategory("Warnings");
    this.#addCategoryFilter(new ExcludeFilter("gps", true));       // any
    this.#addCategoryFilter(new ExcludeFilter("steep", false));    // only strong
    this.#addCategoryFilter(new ExcludeFilter("slippery", false)); // only strong
    this.#addCategoryFilter(new ExcludeFilter("vertigo", false));  // only strong
    this.#addCategoryFilter(new ExcludeFilter("weather", true));   // any

    this.#addLocationFilter(new LocationFilter());
    this.#endCategory();

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
      this.#allFilters[filter].state = FilterState.On;
    })

    // users may change favourites in details page so check if the favourites
    // filter was on but is no longer applicable and if so remove it
    if (this.#favouritesFilter.state == FilterState.On && favourites.size == 0) {
      this.#favouritesFilter.state = FilterState.Disabled;
      this.#activeFilterList.delete(this.#favouritesFilter.index.toString());
    }

    this.updateGrids();
  }


  //
  // specific add methods build up HTML for injection into respective grids
  //

  #addFavouriteslFilter(filter) {
    this.#favouritesFilter = filter;
    this.#addGeneralFilter(filter);
  }


  #addGeneralFilter(filter) {
    this.#allFilters.push(filter);
    this.#generalFiltersHtml += filter.html;
  }


  #addCategoryFilter(filter) {
    this.#allFilters.push(filter);
    this.#categoryFiltersHtml += filter.html;
  }


  #addLocationFilter(filter) {
    this.#allFilters.push(filter);
    this.#locationFilterHtml = filter.html;
    this.#locationFilter = filter;
  }


  #startCategory(label) {
    this.#categoryFiltersHtml += `<div class="feature-heading">${label}</div><div class="filter-row">`;
  }


  #endCategory() {
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
    switch (this.#favouritesFilter.state) {
      case FilterState.Disabled:
        if (favourites.size > 0 && !this.filterLimitReached)
          this.#favouritesFilter.state = FilterState.Off;
        break;
      
      case FilterState.Off:
        if (favourites.size == 0)
          this.#favouritesFilter.state = FilterState.Disabled;
        break;

      case FilterState.On:
        if (favourites.size == 0) {
          this.#favouritesFilter.state = FilterState.Disabled;
          this.#activeFilterList.delete(this.#favouritesFilter.index.toString());        
        }
        this.updateGrids();
        break;
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
    if (this.#locationFilter.allAreasSelected) {
      message = "Remove areas to enable filter.";
      // this.#locationFilter.enabled = false;
    } else if (this.#locationFilter.noAreasSelected) {
      message = "Add areas to enable filter.";
      // this.#locationFilter.enabled = false;
    } else {
      // this.#locationFilter.enabled = true;
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
          <div class="active-filter state-${filter.filterTypeText}">
            <div>${filter.filterTypeText}</div>
            <div>${filter.text}</div>
            <div id="active-${filter.id}" class="close-cross">&times;</div>
          </div>`
      });
    }
    document.getElementById("active-filter-grid").innerHTML = activeFilterGridContents;
  }


  // disables or re-enables filters according to filter limit
  updateFilterIcons() {
    this.#allFilters.forEach(filter => {
      filter.updateState(this.filterLimitReached);
    })
  }


  //
  // filtering
  //


  // variant filters are assumed to inherit their parent walk's attributes
  // unless the filter is explicitly defined by a variant
  // returns match status for both the main route and the variants
  applyActiveFilters(route) {
    let matchCommon = true;
    let matchOther = true;
    let matchCommonAnyVariants = true;

    this.#activeFilterList.forEach(filterId => {
      let filter = this.#allFilters[filterId];

      // check main route
      let routeMatch = filter.apply(route);

      // check 
      switch (filter.name) {
        case "circular":
        case "accessCar":
        case "accessBus":
        case "short":
          if (!route.any_variant[filter.name]) matchCommonAnyVariants = false;
          if (!routeMatch) matchCommon = false;
          break;

        default:
          if (!routeMatch) matchOther = false;
        }
    })

    return {
      route: matchCommon && matchOther, 
      variants: matchCommonAnyVariants && matchOther
    }; 
  }


  //
  // responses to click events
  //


  // deletion cross on an active filter clicked - remove filter
  deleteActiveFilter(elementId) {
    let activeFilterId = elementId.replace("active-filter", "");
    let activeFilter = this.#allFilters[activeFilterId];

    if (this.#activeFilterList.has(activeFilterId)) {
      this.#activeFilterList.delete(activeFilterId);
      activeFilter.state = FilterState.Off;
    }
    this.updateGrids();
  }


  // filter icon clicked - toggle its state
  toggle(elementId) {
    let filterId = elementId.replace("filter", ""); // strip prefix to get the filter name
    let selectedFilter = this.#allFilters[filterId];

    switch (selectedFilter.state) {
      case FilterState.Off:
        if (!this.filterLimitReached) {
          selectedFilter.state = FilterState.On;
          this.#activeFilterList.add(filterId);
        }
        break;

      case FilterState.On:
        selectedFilter.state = FilterState.Off;
        this.#activeFilterList.delete(filterId);
        break;

      default:
        // disabled - do nothing
        break;
    }

    this.updateGrids();
  }


  // turn everything off and empty active filter list
  clearAllFilters() {
    this.#allFilters.forEach(filter => {
      if (filter.isInternallyValid)
        filter.state = FilterState.Off;
      else
        filter.state = FilterState.Disabled;
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
    if (!this.filterLimitReached) {
      this.#locationFilter.selectAllLocations();
      this.updateLocationFilter();
    }
  }


  clearAllLocations() {
    if (!this.filterLimitReached) {
      this.#locationFilter.clearAllLocations();
      this.updateLocationFilter();
    }
  }


  toggleLocationSelector(elementId) {
    if (!this.filterLimitReached) {
      this.#locationFilter.toggleLocationSelector(elementId);
      switch (this.#locationFilter.state) {
        case FilterState.Disabled:
        case FilterState.Off:
          if (this.#locationFilter.isInternallyValid) {
            this.#locationFilter.state = FilterState.On;
            this.#activeFilterList.add(this.#locationFilter.index.toString());
          }
          break;

        case FilterState.On:
          if (!this.#locationFilter.isInternallyValid) {
            this.#locationFilter.state = FilterState.Disabled;
            this.#activeFilterList.delete(this.#locationFilter.index.toString());
          }
          break;
      }
      this.updateGrids();
    }
  }


  // changing the area selection automatically turns the filter on
  // invalid selections (all areas or no areas) turn it off
  updateLocationFilter() {
    if (this.#locationFilter.state == FilterState.On) {
      this.#activeFilterList.delete(this.#locationFilter.index.toString());
    }
    this.#locationFilter.state = FilterState.Disabled;
    this.updateGrids();
  }
}