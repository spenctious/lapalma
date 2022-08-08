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
  let previousVersionDate = localStorage.getItem("dataVersionDate");
  let currentVersionDate = new Date();
  let dataOutOfDate = 
    previousVersionDate == null || 
    previousVersionDate == undefined || 
    !datesAreOnSameDay(previousVersionDate, currentVersionDate);

  if (forceReload || dataOutOfDate) {
    // wait for all the data to come back
    var responses = await getAllUrls(dataSources);

    // distribute returned responses
    laPalmaData = await responses[0];
    trailStatuses = await responses[1];

    // augment the raw data with lookups & derrived data then save it locally
    AugmentData();
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
function AugmentData()
{
  laPalmaData.routes.forEach(r => {
    r.hasVariants = "variants" in r;
    r.variantsCount = r.hasVariants ? r.variants.length : 0;

    r.isStarred = r.attributes.find(a => a.feature_name == "starred") == true;

    let d = r.attributes.find(elt => elt.type == "duration");
    r.duration = laPalmaData.categories.find(elt => 
      elt.type == "duration" && 
      elt.name == d.feature_name);

    let e = r.attributes.find(elt => elt.type == "effort");
    r.effort = laPalmaData.categories.find(elt => 
      elt.type == "effort" &&
      elt.name == e.feature_name);

    r.start = laPalmaData.locations.find(elt => elt.name == r.start_name);
    r.finish = laPalmaData.locations.find(elt => elt.name == r.finish_name);

    r.hasPoi = r.poi_names[0] != "";

    r.hasDangers = "dangers" in r;
  });
}