"use strict";

// The raw data in JSON format
var categories;
var locations;
var routes;
var trailStatuses;
var pointsOfInterest;

// Maps generated from data segments
var walkType;
var duration;
var effort;
var basics;
var interest;
var terrain;
var warnings;
var locations;
var statuses;
var poi;

// Additional data
var favourites;
var routeFormat;

var laPalmaData;

var dataSources = [
  "/data/categories.json",
  "/data/locations.json",
  "/data/routes.json",
  "/data/trail-statuses.json",
  "/data/POI.json",
];

// For diagnostics and development
var forceReload = true;

/************************* Data loading setup ************************/

// Reads the data from the various JSON data sources in parallel
async function getAllUrls(dataSources) {
  try {
    var data = await Promise.all(
      dataSources.map(url => fetch(url)
        .then((response) => response.json()))
    );
    return (data)
  } catch (error) {
    console.log(error)
    throw (error)
  }
}

// Loads the data from local storage or gets it from URL sources
// Unpacks data into usable elements
// Once the data is loaded the callback function is called
async function loadDataThen(afterDataIsLoaded) {
  if (forceReload || localStorage.getItem("lapalmaData") === null) {
    // wait for all the data to come back then store it for later
    var responses = await getAllUrls(dataSources);
    localStorage.setItem("lapalmaData", JSON.stringify(responses));
  } else {
    // retrieve from local storage
    responses = JSON.parse(localStorage.lapalmaData);
  }

  // distribute the returned data
  categories = await responses[0];
  locations = await responses[1];
  routes = await responses[2];
  trailStatuses = await responses[3];
  pointsOfInterest = await responses[4];

  // create maps for the data components
  walkType = new Map(categories.walkType);
  duration = new Map(categories.duration);
  effort = new Map(categories.effort);
  basics = new Map(categories.basics);
  interest = new Map(categories.interest);
  terrain = new Map(categories.terrain);
  warnings = new Map(categories.warnings);
  locations = new Map(locations);
  statuses = new Map(trailStatuses);
  poi = new Map(pointsOfInterest);

  // retrieve favourites or create them new if missing
  let storedFavourites = localStorage.getItem("favourites");
  if (forceReload || storedFavourites === null) {
    favourites = new Set();
    localStorage.setItem("favourites", JSON.stringify(favourites));
  } else {
    favourites = JSON.parse(storedFavourites);
  }

  // retrieve preferred route download format or set default
  routeFormat = localStorage.getItem("routeFormat");
  if (forceReload || routeFormat === null) {
    routeFormat = "gpx";
    localStorage.setItem("routeFormat", routeFormat);
  }

  // execute whatever initialization/setup needs to wait until the data is loaded
  afterDataIsLoaded();
}

function updateFavourites() {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

function updateRouteFormat() {
  localStorage.setItem("routeFormat", routeFormat);
}

// class Data {
//   // raw data
//   #routes;
//   #categories;
//   #locations;
//   #trailStatuses;
//   #pointsOfInterest;

//   // extracted maps and objects
//   #walkType;
//   #duration;
//   #effort;
//   #basics;
//   #interest;
//   #terrain;
//   #warnings;
//   #walkLocations;
//   #danger;
//   #locations;
//   #statuses;
//   #poi;

//   // constructed
//   #allRoutes;

//   constructor(routes, categories, locations, pointsOfInterest, trailStatuses) {
//     this.#routes = routes;
//     this.#categories = categories;
//     this.#locations = locations;
//     this.#pointsOfInterest = pointsOfInterest;
//     this.#trailStatuses = trailStatuses;

//     this.#allRoutes = new Array();
//     routes.forEach( route => this.#allRoutes.push(new Route(route)));

//     this.#walkType = new Map(categories.walkType);
//     this.#duration = new Map(categories.duration);
//     this.#effort = new Map(categories.effort);
//     this.#basics = new Map(categories.basics);
//     this.#interest = new Map(categories.interest);
//     this.#terrain = new Map(categories.terrain);
//     this.#warnings = new Map(categories.warnings);
//     this.#walkLocations = categories.get("walkLocations");
//     this.#danger = categories.get("danger");  
//     this.#locations = new Map(locations.locations);
//     this.#statuses = new Map(trailStatuses);
//     this.#poi = new Map(pointsOfInterest);
//   }

//   get routes() { return this.#allRoutes; }
//   getRoute(id) { return this.#routes.find( route => route.id == id); }
// }

// Common between variants and routes
class BasicRoute {
  #route;
  #accessCar;
  #accessBus;
  #walkTypeDetails;
  #durationDetails;
  #effortDetails;
  #startDetails;
  #endDetails;

  constructor(route) {
    this.#route = route;

    // lookups
    this.#accessCar = basics.get("accessCar");
    this.#accessCar.isPossible = this.#route.accessCar == "true" ? true : false;

    this.#accessBus = basics.get("accessBus");
    this.#accessBus.isPossible = this.#route.accessBus == "true" ? true : false;

    this.#walkTypeDetails = walkType.get(route.walkType);
    this.#walkTypeDetails.type = this.#route.walkType;

    this.#durationDetails = duration.get(route.duration);
    this.#durationDetails.type = this.#route.duration;

    this.#effortDetails = effort.get(route.effort);
    this.#effortDetails.type = this.#route.effort;

    this.#startDetails = locations.get(route.start);
    this.#startDetails.name = route.start;

    this.#endDetails = locations.get(route.end);
    this.#endDetails.name = route.end;
  }

  // simple accessors
  get id() { return this.#route.id; }
  get name() { return this.#route.name; }
  get description() { return this.#route.description; }
  get routeFile() { return this.#route.routeFile; }
  get walkType() { return this.#walkTypeDetails; }
  get duration() { return this.#durationDetails; }
  get effort() { return this.#effortDetails; }
  get start() { return this.#startDetails; }
  get end() { return this.#endDetails; }
  get accessCar() { return this.#accessCar; }
  get accessBus() { return this.#accessBus; }
  get directions() { return this.#route.routeDirections; }

  // true/false attributes
  // get isWaymarked() { return this.#route.waymarked == "true"; }
  get hasRouteFile() { return "routeFile" in this.#route; }
  get hasRouteDirections() { return "routeDirections" in this.#route; }
}

// Extra information in the full route
class Route extends BasicRoute {
  #route;
  #notes;
  #refreshmentsData;
  #waymarkingData;
  #starredData;
  #terrainData;
  #interestData;
  #warningsData;
  #dangersData;
  #variantsData;
  #poiData;

  constructor(route) {
    super(route);
    this.#route = route;
    this.#notes = new Map(route.notes);

    // refreshments
    this.#refreshmentsData = basics.get("refreshments");
    this.#refreshmentsData.text = route.refreshments;

    // waymarked
    this.#waymarkingData = basics.get("waymarked");
    this.#waymarkingData.isComplete = this.#route.isWaymarked == "true";

    // starred
    this.#starredData = basics.get("starred");
    this.#starredData.isSet = route.isStarred == "true";

    // interests
    let routeInterest = new Map(route.interest);
    this.#interestData = new Array();
    routeInterest.forEach((strength, interestType) => {
      let interestDetail = interest.get(interestType);
      // if there is a note for this type, override the default description with it
      if (this.#notes.has(interestType)) {
        interestDetail.description = this.#notes.get(interestType);
      }
      // add properties
      interestDetail.type = interestType;
      interestDetail.isFeature = true;
      interestDetail.isStrong = strength == "strong" ? true : false;
      // add to list
      this.#interestData.push(interestDetail);
    });

    // warnings
    let routeWarnings = new Map(route.warnings);
    this.#warningsData = new Array();
    routeWarnings.forEach((strength, warningType) => {
      let warningDetail = warnings.get(warningType);
      // if there is a note for this type, override the default description with it
      if (this.#notes.has(warningType)) {
        warningDetail.description = this.#notes.get(warningType);
      }
      // add properties
      warningDetail.type = warningType;
      warningDetail.isFeature = false;
      warningDetail.isStrong = strength == "strong" ? true : false;
      // add to list
      this.#warningsData.push(warningDetail);
    });

    // terrain
    let routeTerrain = new Map(this.#route.terrain);
    this.#terrainData = new Array();
    routeTerrain.forEach((strength, terrainType) => {
      let terrainDetail = terrain.get(terrainType);
      // add properties
      terrainDetail.type = terrainType;
      terrainDetail.isStrong = strength == "strong" ? true : false;
      // add to list
      this.#terrainData.push(terrainDetail);
    });

    // dangers
    this.#dangersData = new Array();
    if ("dangers" in this.#route) {
      this.#route.dangers.forEach(danger => {
        this.#dangersData.push(
          {
            name: danger.danger,
            description: danger.description,
            isStrong: danger.strength == "strong" ? true : false
          }
        )
      });
    }

    // variants
    this.#variantsData = new Array();
    if ("variants" in this.#route) {
      this.#route.variants.forEach(variant => {
        this.#variantsData.push(new BasicRoute(variant));
      })
    }

    // poi
    this.#poiData = new Array();
    this.#route.poi.forEach(poiName => {
      this.#poiData.push(poi.get(poiName));
    })
  }

  // simple accessors
  get lengthKm() { return this.#route.lengthKm; }
  get lengthMiles() { return this.#route.lengthMiles; }
  get walkingTime() { return this.#route.walkingTime; }
  get shortDescription() { return this.#route.shortDescription; }
  get paths() { return this.#route.paths; }
  get hasVariants() { return "variants" in this.#route; }
  get variants() { return this.#variantsData; }
  get starred() { return this.#starredData; }
  get hasRouteDirections() { return false; }
  get waymarking() { return this.#waymarkingData; }

  // optional attributes - return empty string if missing
  get accessOther() { return "accessOther" in this.#route ? this.#route.accessOther : ""; }

  // accessors to derrived data
  get refreshments() { return this.#refreshmentsData; }
  get terrain() { return this.#terrainData; }
  get features() { return this.#interestData; }
  get warnings() { return this.#warningsData; }
  get dangers() { return this.#dangersData; }
  get poi() { return this.#poiData; }

  get featuresInDisplayOrder() {
    let orderedFeatures = new Array();
    interest.forEach((value, key) => {
      let foundFeature = this.features.find(f => f.type == key);
      if (foundFeature !== undefined) {
        orderedFeatures.push(foundFeature);
      }
    });
    return orderedFeatures;
  }

  get warningsInDisplayOrder() {
    let orderedWarnings = new Array();
    warnings.forEach((value, key) => {
      let foundWarning = this.warnings.find(f => f.type == key);
      if (foundWarning !== undefined) {
        orderedWarnings.push(foundWarning);
      }
    });
    return orderedWarnings;
  }
}