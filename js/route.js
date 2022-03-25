// Route data processing

var categories;
var locations;
var routes;
var filters = new Array();
var areaFilters;
var locationFilters = new Array();
var walkType, duration, effort, basics, interest, terrain, warnings;
var locationMap;

var locationAreas = new Map(
  [
    ["north", new Set()],
    ["west", new Set()],
    ["central", new Set()],
    ["east", new Set()],
    ["south", new Set()]
  ]
);

var gridContent;
var reloadData = true;

var favourites = new Set();

/************************* Data loading ************************/

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};

async function loadData() {
  try {
    if (reloadData || sessionStorage.getItem("dataLoaded") === null) {
      // read data from local source
      const result1 = await fetch('/data/categories.json');
      categories = await result1.json();
      const result2 = await fetch('/data/locations.json');
      locations = await result2.json();
      const result3 = await fetch('/data/routes.json');
      routes = await result3.json();

      // save it in session for other pages to use
      sessionStorage.setItem("categories", JSON.stringify(categories));
      sessionStorage.setItem("locations", JSON.stringify(locations));
      sessionStorage.setItem("routes", JSON.stringify(routes));
      sessionStorage.setItem("dataLoaded", "true");
    }
    else {
      // read the data from session if we have it
      categories = JSON.parse(sessionStorage.categories);
      locations = JSON.parse(sessionStorage.locations);
      routes = JSON.parse(sessionStorage.routes);
    }

    // unpack categories into maps
    walkType = new Map(categories.walkType);
    duration = new Map(categories.duration);
    effort = new Map(categories.effort);
    basics = new Map(categories.basics);
    interest = new Map(categories.interest);
    terrain = new Map(categories.terrain);
    warnings = new Map(categories.warnings);
    locationMap = new Map(locations.locations);

    // Create area location sets from location data
    locationMap.forEach( (locationDetail, locationName) => {
      locationDetail.areas.forEach( area => {
        let areaSet = locationAreas.get(area);
        areaSet.add(locationName);
      })
    });

    populateRoutesGrid();
    populateGeneralGrid();
    populateCategoriesGrid();
    populateLocationGrid();
  } catch (error) {
    console.log('Request failed', error);
  }
}

/************************* Routes grid ************************/

function populateRoutesGrid() {
  gridContent = "";

  for (let i = 0; i < routes.routes.length; i++) {
    let currentRoute = routes.routes[i];

    let titleImageUrl = `/img/route${currentRoute.id}-400x300.jpg`;
    let routeId = currentRoute.id;

    let routeVarients = "";
    if ('variants' in currentRoute) {
      let routeVarientCount = currentRoute.variants.length;
      routeVarients = `<span class="route-varients">
      ${routeVarientCount} variation${routeVarientCount > 1 ? "s" : ""}</span>`;
    }

    let starred = "";
    if (currentRoute.starred == "true") {
      starred = `<div class="starred"><img src="/img/icons/star.svg" alt="" /></div>`;
    }

    let routeTitle = currentRoute.name;
    let routeShortDescription = currentRoute.shortDescription;

    // let duration = categories.duration.find(element => element.name == currentRoute.duration);
    let d = duration.get(currentRoute.duration);
    let durationText = d.text;
    let durationIconUrl = `/img/icons/${d.icon}`;

    // let effort = categories.effort.find(element => element.name == currentRoute.effort);
    let e = effort.get(currentRoute.effort);
    let effortText = e.text;
    let effortIconUrl = `/img/icons/${e.icon}`;

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
              onClick="toggleFavourite('${routeId}')"
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

    document.getElementById("routes-grid").innerHTML = gridContent;
  }
}

/************************* Filter logic ************************/

class ActiveFilters {

  static #activeFilters = new Map();
  static emptyMessage = "<span class='emptyStateText'>Tap an icon to add a filter. Tap multiple times to cycle through options.</span>";

  static updateCurrentFilterGrid() {
    let currentFilterGrid = document.getElementById("current-filter-grid");
    if (this.#activeFilters.size == 0) {
      currentFilterGrid.innerHTML = this.emptyMessage;
    } else {
      let gridContent = "";
      this.#activeFilters.forEach(filter => {
        gridContent += `
          <div class="active-filter-${filter.getToggleState()}"  onClick="clearFilter('${filter.getId()}')">
            <div>${filter.getToggleState()}</div>
            <div>${filter.getFilterText()}</div>
            <div class="close-cross">&times;</div>
          </div>`
      });
      currentFilterGrid.innerHTML = gridContent;
    }
  }

  static add(filter) {
    this.#activeFilters.set(filter.getId(), filter);
    this.updateCurrentFilterGrid();
  }

  static remove(filterId) {
    this.#activeFilters.delete(filterId);
    this.updateCurrentFilterGrid();
  }

  static clear() {
    this.#activeFilters.forEach( filter => {
      filter.reset();
    })
    this.#activeFilters.clear();
    this.updateCurrentFilterGrid();
  }

  static getActiveFilterCount() {
    return this.#activeFilters.length;
  }
}

// Toggle states
const OFF = "OFF";
const ONLY = "ONLY";
const NO = "NO";

// Possible toggle state cycles
const INCLUDE = [OFF, ONLY]; // positive attributes to be ruled in
const EXCLUDE = [OFF, NO];  // undesirable attributes to be ruled out
const INCLUDE_EXCLUDE = [OFF, ONLY, NO]; // neutral attributes to be ruled in or out

// Handles filter state of walk attributes
class Toggle {
  #currentState;
  #states;

  // Takes an array of states
  constructor(states) {
    this.#states = states;
    this.#currentState = 0;
  }

  // Move to the next toggle state which 'wraps around' back to 0
  toggle() {
    this.#currentState = ++this.#currentState % this.#states.length;
    return this.#states[this.#currentState];
  }

  reset() {
    this.#currentState = 0;
    return this.#states[0];
  }

  toggleOn() {
    this.#currentState = 1;
    return this.#currentState;
  }
}

class CategoryFilter {

  #id;
  #category;
  #toggle;
  #filter;
  #toggleState;

  constructor(id, filter, category, toggle) {
    this.#id = id;
    this.#category = category;
    this.#toggle = toggle;
    this.#filter = filter;
    this.#toggleState = OFF;
  }

  #updateScreenStatus() {
    let tick = document.getElementById(this.#id + "tick");
    let cross = document.getElementById(this.#id + "cross");
    switch (this.#toggleState) {
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

  getId() {
    return this.#id;
  }

  getIcon() {
    return this.#category.icon;
  }

  getFilterText() {
    return this.#toggleState == ONLY ? this.#category.filterIncludeText : this.#category.filterExcludeText;
  }

  clear() {
    this.#toggleState = this.#toggle.reset();
    this.#updateScreenStatus();
  }

  toggle() {
    this.#toggleState = this.#toggle.toggle();
    this.#updateScreenStatus();
  }

  reset() {
    this.#toggleState = this.#toggle.reset();
    this.#updateScreenStatus();
  }

  getToggleState() {
    return this.#toggleState;
  }

  applyFilter(route) {
    return this.#filter(route);
  }
}

class AreaFilter {
  #id;
  #area;
  #buttonText;
  #toggle;
  #toggleState;

  constructor(id, area, buttonText, toggle) {
    this.#id = id;
    this.#area = area;
    this.#buttonText = buttonText;
    this.#toggle = toggle;
    this.#toggleState = OFF;
  }

  getId() {
    return this.#id;
  }

  getText() {
    return this.#buttonText;
  }

  getArea() {
    return this.#area;
  }

  toggle() {
    this.#toggleState = this.#toggle.toggle();
    this.#updateScreenStatus();
  }

  toggleOn() {
    this.#toggleState = this.#toggle.toggleOn();
    this.#updateScreenStatus();
  }

  getToggleState() {
    return this.#toggleState;
  }

  clear() {
    this.#toggleState = this.#toggle.reset();
    this.#updateScreenStatus();
  }

  reset() {
    this.#toggleState = this.#toggle.reset();
    this.#updateScreenStatus();
  }

  #updateScreenStatus() {
    let locationButton = document.getElementById(this.#id);
    if (this.#toggleState == OFF) {
      locationButton.className = "filter-button"
    } else {
      locationButton.className = "filter-button-on"
    }
  }
}

// Static methods for filtering routes
class Filter {

  // Favourites and starred
  static isStarred(route) { return route.starred == "true"; }
  static isFavourite(route) { return favourites.has(route.id); }

  // Basic categories
  static isCircular(route) { return route.walkType == "circular"; }
  static isAccessibleByCar(route) { return route.accessCar == "true"; }
  static isAccessibleByBus(route) { return route.accessBus == "true"; }
  static isShortWalk(route) { return route.duration == "stroll" || route.duration == "half"; }
  static isWaymarked(route) { return route.waymarked == "true"; }

  // Features
  static hasArcheologicalInterest(route) { return "archeological" in route.interest; }
  static hasPeaks(route) { return "peaks" in route.interest; }
  static hasPointsOfInterest(route) { return "poi" in route.interest; }
  static hasPort(route) { return "port" in route.interest; }
  static isScenic(route) { return "scenic" in route.interest; }

  // Terrain
  static hasDragonTrees(route) { return "dragon" in route.terrain; }
  static isVolcanic(route) { return "volcanic" in route.terrain; }
  static passesThroughLaurisilvaForest(route) { return "laurisilva" in route.terrain; }
  static isCoastalWalk(route) { return "coastal" in route.terrain; }
  static passesThroughPineForest(route) { return "pine" in route.terrain; }

  // Warnings - mostly these only activate when strong
  static hasUnreliableGPS(route) { return "gps" in route.warnings; }
  static isSteep(route) { return "steep" in route.warnings && route.warnings.steep.strong == "true"; }
  static isSlippery(route) { return "slippery" in route.warnings && route.warnings.slippery.strong == "true"; }
  static isVertigoInducing(route) { return "vertigo" in route.warnings && route.warnings.vertigo.strong == "true"; }
  static isWeatherDependent(route) { return "weather" in route.warnings; }

  // Location
  static isInLocationSet(route) {
    // loop through area selectors and see if location is in any selected area
    let included = false;
    areaFilters.every( filter => {
      if (filter.getToggleState() != OFF) {
        let area = locationAreas.get(filter.getArea());
        included = area.has(route.start) || area.has(route.end);
      }
      return !included;
    })
    // see if route start or end is in set
    return included;
  }

  // Reset all filters and update the walks grid accordingly
  static clearAllFilters() {
    filters.forEach(filter => {
      filter.clear();
    });
    this.filterRoutes();
  }

  // Hide routes that don't fit the current filters
  // Update count of filters and matches
  static filterRoutes() {
    let matchesCount = 0;

    routes.routes.forEach(route => {
      let included = true;
      // Keep applying active filters until one of them rules a route out
      filters.every(currentFilter => {
        switch (currentFilter.getToggleState()) {
          case ONLY:
            included = currentFilter.applyFilter(route);
            break;
          case NO:
            included = !currentFilter.applyFilter(route);
            break;
        }
        return included;
      });

      // hide filtered out routes and update count of how many are matched
      let routeDiv = document.getElementById("route" + route.id);
      if (included) {
        routeDiv.style.display = "block";
        matchesCount++;
      }
      else {
        routeDiv.style.display = "none";
      }
    });

    // update number of matches
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

    // count how many filters are applied and update accordingly
    let filtersCount = 0
    filters.forEach(filter => {
      if (filter.getToggleState() != OFF) ++filtersCount;
    });
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
}

/************************* Populate filter grids ************************/

// Builds the HTML for a filter icon with tick and cross overlays
function getCategoryIconHtml(filter) {
  let id = filter.getId();
  let icon = filter.getIcon();
  let categoryIconHtml =
    `<div id="${filter.getId()}" onClick="toggleFilter('${filter.getId()}')" class="icon">
    <img src="/img/icons/${filter.getIcon()}" class="icon-img" alt="" />
    <img id="${filter.getId() + "cross"}" class="filter-status" src="/img/icons/red-cross.svg" style="display: none;" alt="" />
    <img id="${filter.getId() + "tick"}" class="filter-status" src="/img/icons/green-tick.svg" style="display: none;" alt="" />
  </div>`;
  return categoryIconHtml;
}

function populateLocationGrid() {
  areaFilters = [
    new AreaFilter("area01", "north", "North", new Toggle(INCLUDE)),
    new AreaFilter("area02", "west", "West", new Toggle(INCLUDE)),
    new AreaFilter("area03", "central", "Central", new Toggle(INCLUDE)),
    new AreaFilter("area04", "east", "East", new Toggle(INCLUDE)),
    new AreaFilter("area05", "south", "South", new Toggle(INCLUDE))
  ];

  let locationFilter = new CategoryFilter("location", Filter.isInLocationSet, categories.walkLocations, new Toggle(INCLUDE));
  filters = filters.concat(locationFilter);

  let locationFilterGrid = getCategoryIconHtml(locationFilter);
  locationFilterGrid += "<div>Filter will apply to selected areas below.</div>";
  locationFilterGrid += `<div id="location-area-grid">`;
  areaFilters.forEach(filter => {
    locationFilterGrid += `
      <div id="${filter.getId()}" onClick="toggleLocationFilter('${filter.getId()}')" class="filter-button">${filter.getText()}</div>`;
  })
  locationFilterGrid += `<div id="all-locations" class="text-button" onClick="selectAllLocations()">Select All</div>`;
  locationFilterGrid += `<div id="all-locations" class="text-button" onClick="selectNoLocations()">Select None</div>`;
  locationFilterGrid += `</div>`;

  document.getElementById("location-filter-grid").innerHTML = locationFilterGrid;
}

function populateGeneralGrid() {
  let generalFilters = [
    new CategoryFilter("starred", Filter.isStarred, basics.get("starred"), new Toggle(INCLUDE)),
    new CategoryFilter("favourite", Filter.isFavourite, basics.get("favourite"), new Toggle(INCLUDE))
  ];

  // add to complete list of filters
  filters = filters.concat(generalFilters);

  // build general filters grid
  let generalFilterGrid = `
  <div class="text-button" onClick="clearFavourites()">Clear favourites</div>`;
  generalFilterGrid += getCategoryIconHtml(generalFilters[0]);
  generalFilterGrid += getCategoryIconHtml(generalFilters[1]);
  document.getElementById("general-filter-grid").innerHTML = generalFilterGrid;
}

function populateCategoriesGrid() {
  let categoryFilters = [
    // row 1
    new CategoryFilter("filter01", Filter.isCircular, walkType.get("circular"), new Toggle(INCLUDE)),
    new CategoryFilter("filter02", Filter.hasArcheologicalInterest, interest.get("archeological"), new Toggle(INCLUDE)),
    new CategoryFilter("filter03", Filter.hasDragonTrees, terrain.get("dragon"), new Toggle(INCLUDE)),
    new CategoryFilter("filter04", Filter.hasUnreliableGPS, warnings.get("gps"), new Toggle(EXCLUDE)),

    // row 2
    new CategoryFilter("filter05", Filter.isAccessibleByCar, basics.get("car"), new Toggle(INCLUDE)),
    new CategoryFilter("filter06", Filter.hasPeaks, interest.get("peaks"), new Toggle(INCLUDE)),
    new CategoryFilter("filter07", Filter.isVolcanic, terrain.get("volcanic"), new Toggle(INCLUDE)),
    new CategoryFilter("filter08", Filter.isSteep, warnings.get("steep"), new Toggle(EXCLUDE)),

    // row 3
    new CategoryFilter("filter09", Filter.isAccessibleByBus, basics.get("bus"), new Toggle(INCLUDE)),
    new CategoryFilter("filter10", Filter.hasPointsOfInterest, interest.get("poi"), new Toggle(INCLUDE)),
    new CategoryFilter("filter11", Filter.passesThroughLaurisilvaForest, terrain.get("laurisilva"), new Toggle(INCLUDE)),
    new CategoryFilter("filter12", Filter.isSlippery, warnings.get("slippery"), new Toggle(EXCLUDE)),

    // row 4
    new CategoryFilter("filter13", Filter.isShortWalk, duration.get("half"), new Toggle(INCLUDE)),
    new CategoryFilter("filter14", Filter.hasPort, interest.get("port"), new Toggle(INCLUDE)),
    new CategoryFilter("filter15", Filter.isCoastalWalk, terrain.get("coastal"), new Toggle(INCLUDE)),
    new CategoryFilter("filter16", Filter.isVertigoInducing, warnings.get("vertigo"), new Toggle(EXCLUDE)),

    // row 5
    new CategoryFilter("filter17", Filter.isWaymarked, basics.get("waymarked"), new Toggle(INCLUDE)),
    new CategoryFilter("filter18", Filter.isScenic, interest.get("scenic"), new Toggle(INCLUDE)),
    new CategoryFilter("filter19", Filter.passesThroughPineForest, terrain.get("pine"), new Toggle(INCLUDE)),
    new CategoryFilter("filter20", Filter.isWeatherDependent, warnings.get("weather"), new Toggle(EXCLUDE)),
  ];

  // add to complete list of filters
  filters = filters.concat(categoryFilters);

  // build filter icon grid
  let categoryFilterGrid = `
    <div class="feature-heading">Basic</div>
    <div class="feature-heading">Interest</div>
    <div class="feature-heading">Terrain</div>
    <div class="feature-heading">Warnings</div>`;
  categoryFilters.forEach(filter => {
    categoryFilterGrid += getCategoryIconHtml(filter);
  });
  document.getElementById("category-filter-grid").innerHTML = categoryFilterGrid;
}

/************************* Click handlers ************************/

// Click handler for filters
function toggleFilter(filterId) {
  let selectedFilter = filters.find(f => f.getId() == filterId);
  selectedFilter.toggle();
  if (selectedFilter.getToggleState() == OFF) {
    ActiveFilters.remove(selectedFilter.getId());
  }
  else {
    ActiveFilters.add(selectedFilter);
  }
  Filter.filterRoutes();
}

function clearFilter(filterId) {
  let selectedFilter = filters.find(f => f.getId() == filterId);
  selectedFilter.reset();
  ActiveFilters.remove(selectedFilter.getId());
  Filter.filterRoutes();
}

// click handler for favourites icon
function toggleFavourite(routeId) {
  let iconId = "favourite" + routeId;
  if (favourites.has(routeId)) {
    favourites.delete(routeId);
    document.getElementById(iconId).src = "/img/icons/heart-empty.svg";
  } else {
    favourites.add(routeId);
    document.getElementById(iconId).src = "/img/icons/heart-full-black.svg";
  }
}

function clearFavourites() {
  favourites.clear();
  // reset icons
  routes.routes.forEach(route => {
    document.getElementById("favourite" + route.id).src = "/img/icons/heart-empty.svg";
  });
}

function toggleLocationFilter(locationId) {
  let selectedFilter = areaFilters.find(f => f.getId() == locationId);
  selectedFilter.toggle();
}

function selectAllLocations() {
  areaFilters.forEach( filter => {
    filter.toggleOn();
  })
}

function selectNoLocations() {
  areaFilters.forEach( filter => {
    filter.reset();
  })
}

function clearAllFilters() {
  ActiveFilters.clear();
  Filter.filterRoutes();
}
