// Route data processing

var categories;
var locations;
var routes;
var filters = new Array();
var walkTypes, duration, effort, basics, interest, terrain, warnings;

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
    walkTypes = new Map(categories.walkType);
    duration = new Map(categories.duration);
    effort = new Map(categories.effort);
    basics = new Map(categories.basics);
    interest = new Map(categories.interest);
    terrain = new Map(categories.terrain);
    warnings = new Map(categories.warnings);

    populateRoutesGrid();
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
    if (currentRoute.starred = "true") {
      starred = `<div class="starred"><img src="/img/icons/star.svg" alt="" /></div>`;
    }

    let routeTitle = currentRoute.name;
    let routeShortDescription = currentRoute.shortDescription;

    // let duration = categories.duration.find(element => element.name == currentRoute.duration);
    let d = duration.get(currentRoute.duration);
    let durationText = d.text;
    let durationIconUrl = `/img/icons/${d.icon}.svg`;

    // let effort = categories.effort.find(element => element.name == currentRoute.effort);
    let e = effort.get(currentRoute.effort);
    let effortText = e.text;
    let effortIconUrl = `/img/icons/${e.icon}.svg`;

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

// Possible toggle state cycles
const offOnly = ["off", "only"];          // positive attributes to be ruled in
const offNo = ["off", "no"];              // undesirable attributes to be ruled out
const offOnlyNo = ["off", "only", "no"];  // neutral attributes to be ruled in or out

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
    return this.#currentState;
  }
}

function populateFilterGrid() {
  // row 1
  filters.add(new Filter("filter01", (route) => route.walkType == "circular", walkType.get("circular"), new Toggle(offOnly)));
  filters.add(new Filter("filter02", (route) => "archological" in route.interest, interest.get("archological"), new Toggle(offOnly)));
  filters.add(new Filter("filter03", (route) => "dragon" in route.terrain, terrain.get("dragon"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter04", (route) => "gps" in route.warnings, warnings.get("gps"), new Toggle(offNo)));

  // row 2
  filters.add(new Filter("filter05", (route) => route.accessCar == true, basics.get("car"), new Toggle(offOnly)));
  filters.add(new Filter("filter06", (route) => "peaks" in route.interest, interest.get("peaks"), new Toggle(offOnly)));
  filters.add(new Filter("filter07", (route) => "volcanic" in route.terrain, terrain.get("volcanic"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter08", (route) => "steep" in route.warnings, warnings.get("steep"), new Toggle(offNo)));

  // row 3
  filters.add(new Filter("filter09", (route) => route.accessBus == true, basics.get("bus"), new Toggle(offOnly)));
  filters.add(new Filter("filter10", (route) => "poi" in route.interest, interest.get("poi"), new Toggle(offOnly)));
  filters.add(new Filter("filter11", (route) => "laurisilva" in route.terrain, terrain.get("laurisilva"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter12", (route) => "slippery" in route.warnings, warnings.get("slippery"), new Toggle(offNo)));

  // row 4
  filters.add(new Filter("filter13", (route) => route.duration == "stroll" || route.duration == "half", duration.get("half"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter14", (route) => "ports" in route.interest, interest.get("ports"), new Toggle(offOnly)));
  filters.add(new Filter("filter15", (route) => "coastal" in route.terrain, terrain.get("coastal"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter16", (route) => "vertigo" in route.warnings, warnings.get("vertigo"), new Toggle(offNo)));

  // row 5
  filters.add(new Filter("filter17", (route) => route.waymarked == true, basics.get("waymarked"), new Toggle(offOnly)));
  filters.add(new Filter("filter18", (route) => "scenic" in route.interest, interest.get("scenic"), new Toggle(offOnly)));
  filters.add(new Filter("filter19", (route) => "pine" in route.terrain, terrain.get("pine"), new Toggle(offOnlyNo)));
  filters.add(new Filter("filter20", (route) => "weather" in route.warnings, warnings.get("weather"), new Toggle(offNo)));

  let filterGrid = "";
  filters.forEach(filter => {
    filterGrid +=
      `<div id="${filter.getId()}" onClick="${filter.toggle()}" class="">
      <img></img>
    <div>`
  });
}

class Filter {

  #id;
  #category;
  #toggle;
  #filter;

  constructor(id, filter, category, toggle) {
    this.#id = id;
    this.#category = category;
    this.#toggle = toggle;
    this.#filter = filter;
  }

  getId() {
    return this.#id;
  }

  getIcon() {
    return this.#category.icon;
  }

  toggle() {
    let newState = this.#toggle.toggle();
    // act on new state
  }
}

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};
