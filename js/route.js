// Route data processing

var categories;
var locations;
var routes;
var filters = new Array();
var walkType, duration, effort, basics, interest, terrain, warnings;

var gridContent;
var reloadData = true;

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

    populateRoutesGrid();
    populateFilterGrid();
  } catch (error) {
    console.log('Request failed', error);
  }
}

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

    document.getElementById("routes-grid").innerHTML = gridContent;
  }
}

// Toggle states
const OFF = "off";
const ONLY = "only";
const NO = "no";

// Possible toggle state cycles
const offOnly = [OFF, ONLY];        // positive attributes to be ruled in
const offNo = [OFF, NO];            // undesirable attributes to be ruled out
const offOnlyNo = [OFF, ONLY, NO];  // neutral attributes to be ruled in or out

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
}

class Filter {

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

  // Warnings
  static hasUnreliableGPS(route) { return "gps" in route.warnings; }
  static isSteep(route) { return "steep" in route.warnings; }
  static isSlippery(route) { return "slippery" in route.warnings; }
  static isVertigoInducing(route) { return "vertigo" in route.warnings; }
  static isWeatherDependent(route) { return "weather" in route.warnings; }

  // Reset all filters and update the walks grid accordingly
  static clearAllFilters() {
    filters.forEach( filter => {
      filter.clear();
    });
    this.filterRoutes();
  }

  // Hide routes that don't fit the current filters
  static filterRoutes() {
    routes.routes.forEach( route => {
      // Assume a route is included until proven otherwise
      // Once one filter rules a route out, look no further
      let included = true;
      filters.every( currentFilter => {
        switch (currentFilter.getToggleState()) {
          case ONLY:
            included = currentFilter.applyFilter(route);
            break;
          case NO:
            included = !currentFilter.applyFilter(route);
            break;
        }
        return included;
      })
      document.getElementById("route" + route.id).style.display = included ? "block" : "none";
    })
  }
}

function populateFilterGrid() {
  // row 1
  filters.push(new CategoryFilter("filter01", Filter.isCircular, walkType.get("circular"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter02", Filter.hasArcheologicalInterest, interest.get("archeological"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter03", Filter.hasDragonTrees, terrain.get("dragon"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter04", Filter.hasUnreliableGPS, warnings.get("gps"), new Toggle(offNo)));

  // row 2
  filters.push(new CategoryFilter("filter05", Filter.isAccessibleByCar, basics.get("car"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter06", Filter.hasPeaks, interest.get("peaks"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter07", Filter.isVolcanic, terrain.get("volcanic"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter08", Filter.isSteep, warnings.get("steep"), new Toggle(offNo)));

  // row 3
  filters.push(new CategoryFilter("filter09", Filter.isAccessibleByBus, basics.get("bus"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter10", Filter.hasPointsOfInterest, interest.get("poi"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter11", Filter.passesThroughLaurisilvaForest, terrain.get("laurisilva"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter12", Filter.isSlippery, warnings.get("slippery"), new Toggle(offNo)));

  // row 4
  filters.push(new CategoryFilter("filter13", Filter.isShortWalk, duration.get("half"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter14", Filter.hasPort, interest.get("port"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter15", Filter.isCoastalWalk, terrain.get("coastal"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter16", Filter.isVertigoInducing, warnings.get("vertigo"), new Toggle(offNo)));

  // row 5
  filters.push(new CategoryFilter("filter17", Filter.isWaymarked, basics.get("waymarked"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter18", Filter.isScenic, interest.get("scenic"), new Toggle(offOnly)));
  filters.push(new CategoryFilter("filter19", Filter.passesThroughPineForest, terrain.get("pine"), new Toggle(offOnlyNo)));
  filters.push(new CategoryFilter("filter20", Filter.isWeatherDependent, warnings.get("weather"), new Toggle(offNo)));

  let filterGrid = `
    <div class="feature-heading">Basic</div>
    <div class="feature-heading">Interest</div>
    <div class="feature-heading">Terrain</div>
    <div class="feature-heading">Warnings</div>`;

  // The foreach algorithm iterates through in ascending index order so items should fall
  // correctly in their appropriate columns
  filters.forEach(filter => {
    filterGrid +=
      `<div id="${filter.getId()}" onClick="toggleFilter('${filter.getId()}')" class="icon">
      <img src="/img/icons/${filter.getIcon()}" class="icon-img" alt="" />
      <img id="${filter.getId() + "cross"}" class="filter-status" src="/img/icons/red-cross.svg" style="display: none;" alt="" />
      <img id="${filter.getId() + "tick"}" class="filter-status" src="/img/icons/green-tick.svg" style="display: none;" alt="" />
      </div>`;
  });

  document.getElementById("category-filter-grid").innerHTML = filterGrid;
}

// Click handler for filters
function toggleFilter(filterId) {
  let selectedFilter = filters.find(f => f.getId() == filterId);
  selectedFilter.toggle();
  Filter.filterRoutes();
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
  }

  #updateScreenStatus() {
    let clickedIcon = document.getElementById(this.#id);
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

  clear() {
    this.#toggleState = this.#toggle.reset();
    this.#updateScreenStatus();
  }

  toggle() {
    this.#toggleState  = this.#toggle.toggle();
    this.#updateScreenStatus();
  }

  getToggleState() {
    return this.#toggleState;
  }

  applyFilter(route) {
    return this.#filter(route);
  }
}

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};
