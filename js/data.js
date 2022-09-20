"use strict";

//
// Data classes for the whole app
//  - the data is stored in JSON files and stored locally
//  - as the data did not originate from a database there are integrity
//    checking methods to perform some validation that can be turned on for development
//
// Note that POI stands for Place Of Interest and is used throughout
// though in the UI 'Places' is used.
//

var favourites;   // global object for storing user route bookmarks
var laPalmaData;  // global object that packages the data in convenient formats
var trailStatuses;

// data sources
const URL_DATA = "data/lapalma-data.json";

// local testing: https://localhost:7033/api/TrailStatuses
const URL_STATUSES = "https://lapalmatrailstatusapi.azurewebsites.net/api/TrailStatuses";

// timeouts im ms
const TIMEOUT_DATA = 4000;
const TIMEOUT_STATUSES = 20000; 

// For diagnostics and development
var forceReload = false;
var forceReloadFavourites = false;

// URL paramater names - defining here ensures consistency
const URL_PARAM_ROUTE = "route";
const URL_PARAM_COLLECTION = "collection";
const URL_PARAM_STEPS = "steps";



/************************* Data loading setup ************************/


// returns true if the two dates are the same
const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();


// fetch doesn't have a direct timeout option so we control the behaviour
// through an AbortController and wrap the functionality up for general reuse
// from https://dmitripavlutin.com/timeout-fetch-request/
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 4000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}


// returns true if:
// - dataNameDate is not defined in local storage
// - dataNameDate is more than a day older than the current date
// - forecReload is true
function isOutOfDate(dataName) {
  let previousVersionDate = new Date(localStorage.getItem(dataName + "Date"));
  let currentVersionDate = new Date();
  return forceReload || previousVersionDate == NaN ||
    !datesAreOnSameDay(previousVersionDate, currentVersionDate);
}


// sets trailStatuses to:
// - the value in local storage if that value is still in date
// - the value retrieved from a call to the API to retrieve the data from the offical website
// - an error value otherwise
async function getTrailStatuses() {
    try {  
      if (isOutOfDate("trailStatuses")) {
        // get JSON response from API
        const data = await fetchWithTimeout(URL_STATUSES,{ timeout: TIMEOUT_STATUSES })
          .then(response => response.json());
        
        // set/update cache values
        trailStatuses = data;
        localStorage.setItem("trailStatuses", JSON.stringify(trailStatuses));
        localStorage.setItem("trailStatusesDate", new Date().toString());
        console.log("trailStatuses read from API");
    } else {
      // cached data is present and still current so use it
      console.log("trailStatuses retrieved from cache");
      trailStatuses = JSON.parse(localStorage.trailStatuses);
    }
  } catch (error) {
    console.log(error);
    // timeouts, network failures etc - create a failure result
    trailStatuses = {
      result: { type: "Exception", message: error.name, detail: error.message }
    };
    console.log("trailStatuses exception result created");
  }
}


// sets laPalmaData to:
// - the value in local storage if that value is still in date
// - the value retrieved from the local file if retrieved successfully
// throws an exception otherwise
async function getLaPalmaData() {
  if (isOutOfDate("laPalmaData")) {
    // get JSON data from file
    const data = await fetchWithTimeout(URL_DATA, { timeout: TIMEOUT_DATA })
      .then(response => response.json());
    
    // set/update cache values
    laPalmaData = data;
    localStorage.setItem("laPalmaData", JSON.stringify(laPalmaData));
    localStorage.setItem("laPalmaDataDate", new Date().toString());
    console.log("laPalmaData retrieved from file");
  } else {
    // cached data is present and still current so use it
    console.log("laPalmaData retrieved from cache");
    laPalmaData = JSON.parse(localStorage.laPalmaData);
  }
}



// loads the data from local storage or gets it from URL sources
// once the data is loaded the callback function is called
async function loadDataThen(afterDataIsLoaded) {
  try {
    // get the data and add convenient additional attributes to it
    await getLaPalmaData();
    augmentData();

    // retrieve favourites or create them new if missing
    let storedFavourites = localStorage.getItem("favourites");
    if (forceReloadFavourites || storedFavourites === null) {
      favourites = new Set();
    } else {
      favourites = new Set(JSON.parse(storedFavourites));
    }

    // execute whatever initialization/setup needs to wait until the data is loaded
    afterDataIsLoaded();
  }
  catch (error) {
    // fatal error - could not retrieve main dataset
    console.log(error);
    document.getElementById("main-content").innerHTML = "Fatal error: could not read data";
  }
}


// save favourites as an array (can't directly stringify a set)
function updateFavourites() {
  localStorage.setItem("favourites", JSON.stringify(Array.from(favourites)));
}


// perform lookups and checks and add these as additional
// fields to route elements make working with the data easier
function augmentData()
{
  // global attributes
  laPalmaData.dangerAttributes = laPalmaData.categories.find(elt => elt.name == "danger");
  laPalmaData.accessBusAttributes = laPalmaData.categories.find(elt => elt.name == "accessBus");
  laPalmaData.accessCarAttributes = laPalmaData.categories.find(elt => elt.name == "accessCar");
  laPalmaData.waymarkedAttributes = laPalmaData.categories.find(elt => elt.name == "waymarked");
  laPalmaData.refreshmentsAttributes = laPalmaData.categories.find(elt => elt.name == "refreshments");

  // poi
  laPalmaData.poi.forEach(p => {
    p.hasRelatedWalks = p.related_walks[0] != "";
    p.hasTel = "tel" in p;
    p.hasEmail = "email" in p;
    p.hasWeb = ("web_name" in p) && ("web_address" in p);
    p.hasEntryCost = "entry_cost" in p;
    p.hasOpeningTimes = "opening_times" in p;

    p.locationAttributes = laPalmaData.locations.find(elt => elt.name == p.location);
  })

  // locations
  const ZOOM_LEVEL = 16;
  laPalmaData.locations.forEach(l => {
    l.googleMapLink = 
      `https://www.google.com/maps/place/${l.lat},${l.long}/@${l.lat},${l.long}/data=!3m1!1e3`;
    l.osmMapLink = 
      `https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.long}#map=${ZOOM_LEVEL}/${l.lat}/${l.long}`;
  });

  // routes
  laPalmaData.routes.forEach(r => {
    // variants
    r.hasVariants = "variants" in r;
    r.variantsCount = r.hasVariants ? r.variants.length : 0;

    // starred
    r.isStarred = r.attributes.find(elt => elt.feature_name == "starred") != undefined;
    r.starredIcon = laPalmaData.categories.find(elt =>
        elt.name == "starred").icon;

    // waymarked
    r.isCompletelyWaymarked = r.attributes.find(elt => elt.feature_name == "waymarked") != undefined;

    // transport accessibility
    r.isAccessibleByBus = r.attributes.find(elt => elt.feature_name == "accessBus") != undefined;
    r.isAccessibleByCar = r.attributes.find(elt => elt.feature_name == "accessCar") != undefined;

    // walk type attributes
    let w = r.attributes.find(elt => elt.type == "walkType");
    r.walkTypeAttributes = laPalmaData.categories.find(elt => 
      elt.type == "walkType" && 
      elt.name == w.feature_name);

    // duration attributes
    let d = r.attributes.find(elt => elt.type == "duration");
    r.durationAttributes = laPalmaData.categories.find(elt => 
      elt.type == "duration" && 
      elt.name == d.feature_name);

    // effort attributes
    let e = r.attributes.find(elt => elt.type == "effort");
    r.effortAttributes = laPalmaData.categories.find(elt => 
      elt.type == "effort" &&
      elt.name == e.feature_name);
  
    // locations
    r.startAttributes = laPalmaData.locations.find(elt => elt.name == r.start_name);
    r.finishAttributes = laPalmaData.locations.find(elt =>  elt.name == r.finish_name);

    // tests for optional content
    r.hasTrails = r.trails[0] != "";
    r.hasPoi = "poi" in r;
    r.hasVariants = "variants" in r;
    r.hasDangers = "dangers" in r;

    // attribute categories (arrays)
    r.warnings = r.attributes.filter(elt => elt.type == "warning");
    r.terrains = r.attributes.filter(elt => elt.type == "terrain");
    r.interests = r.attributes.filter(elt => elt.type == "interest");

    // variants
    if (r.hasVariants) {
      r.variants.forEach( v => {
        // tests for optional content
        v.hasRouteFile = "route_file" in v;

        // transport accessibility attributes
        v.accessBusAttributes = laPalmaData.categories.find(elt => elt.name == "accessBus") != undefined;
        v.accessCarAttributes = laPalmaData.categories.find(elt => elt.name == "accessCar") != undefined;

        // walk type attributes
        v.walkTypeAttributes = laPalmaData.categories.find(elt => 
          elt.type == "walkType" && 
          elt.name == v.walk_type);
        
        // duration attributes
        v.durationAttributes = laPalmaData.categories.find(elt => 
          elt.type == "duration" && 
          elt.name == v.duration);

        // effort attributes
        v.effortAttributes = laPalmaData.categories.find(elt => 
          elt.type == "effort" &&
          elt.name == v.effort);
          })
    }
  });
}