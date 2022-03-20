// Route data processing

var categories;
var locations;
var routes;
var filters = new Array();
var walkTypes, duration, effort, basics, interest, terrain,warnings;

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

function getCategoryObject( category, name ) {

}

function populateFilterGrid() {
  // row 1
  filters.add(new Filter( "filter01", walkType.get("circular"), true));
  filters.add(new Filter( "filter02", interest.get("archological"), true));
  filters.add(new Filter( "filter03", terrain.get("dragon"), true));
  filters.add(new Filter( "filter04", warnings.get("gps"), false));

  // row 2
  filters.add(new Filter( "filter05", basics.get("car"), true));
  filters.add(new Filter( "filter06", interest.get("peaks"), true));
  filters.add(new Filter( "filter07", terrain.get("volcanic"), true));
  filters.add(new Filter( "filter08", warnings.get("steep"), false));

  // row 3
  filters.add(new Filter( "filter09", basics.get("bus"), true));
  filters.add(new Filter( "filter10", interest.get("poi"), true));
  filters.add(new Filter( "filter11", terrain.get("laurisilva"), true));
  filters.add(new Filter( "filter12", warnings.get("slippery"), false));

  // row 4
  filters.add(new Filter( "filter13", duration.get("half"), true));
  filters.add(new Filter( "filter14", interest.get("ports"), true));
  filters.add(new Filter( "filter15", terrain.get("coastal"), true));
  filters.add(new Filter( "filter16", warnings.get("vertigo"), false));

  // row 5
  filters.add(new Filter( "filter17", basics.get("waymarked"), true));
  filters.add(new Filter( "filter18", interest.get("scenic"), true));
  filters.add(new Filter( "filter19", terrain.get("pine"), true));
  filters.add(new Filter( "filter20", warnings.get("weather"), false));

  let filterGrid = "";
  filters.forEach( filter => {
    filterGrid += 
    `<div id="${filter.getId()}" onClick="${filter.toggle()}" class="">
      <img></img>
    <div>`
  });
}

class Filter {

  #id;
  #category;
  #include;

  constructor (id, category, include) {
    this.#id = id;
    this.#category = category;
    this.#include = include;
  }

  getId() {
    return this.#id;
  }

  getIcon() {
    return this.#category.icon;
  }

  toggle() {

  }
}

// Wait for everything to finish loading before trying to populate grid
window.onload = function () {
  loadData();//.then(populateRoutesGrid());
};
