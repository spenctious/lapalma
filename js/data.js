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

const dataSources = [
  "data/lapalma-data.json",
  "data/trail-statuses.json"
];

// For diagnostics and development
var forceReload = true;
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


// reads the data from the various JSON data sources in parallel
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


// loads the data from local storage or gets it from URL sources
// unpacks data into usable elements
// once the data is loaded the callback function is called
async function loadDataThen(afterDataIsLoaded) {
  // see if we need to reload data or can use stored version
  let previousVersionDate = new Date(localStorage.getItem("dataVersionDate"));
  let currentVersionDate = new Date();
  let dataOutOfDate = 
    previousVersionDate == NaN ||
    !datesAreOnSameDay(previousVersionDate, currentVersionDate);

  if (forceReload || dataOutOfDate) {
    // wait for all the data to come back
    var responses = await getAllUrls(dataSources);

    // distribute returned responses
    laPalmaData = await responses[0];
    trailStatuses = await responses[1];

    // augment the raw data with lookups & derrived data then save it locally
    augmentData();
    localStorage.setItem("laPalmaData", JSON.stringify(laPalmaData));
    localStorage.setItem("dataVersionDate", currentVersionDate.toDateString());
    localStorage.setItem("trailStatuses", JSON.stringify(trailStatuses));
  } else {
    // retrieve from local storage
    laPalmaData = JSON.parse(localStorage.laPalmaData);
    trailStatuses = JSON.parse(localStorage.trailStatuses);
  }

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