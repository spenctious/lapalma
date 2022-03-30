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
var locationMap;
var statuses;
var poi;

// Additional data
var favourites;

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
  locationMap = new Map(locations.locations);
  statuses = new Map(trailStatuses);
  poi = new Map(pointsOfInterest);

  // retrieve favourites or create them new if missing
  if (localStorage.getItem("favourites") === null) {
    favourites = new Set();
    localStorage.setItem("favourites", JSON.stringify(favourites));
  } else {
    favourites = JSON.parse(localStorage.favourites);
  }

  // execute whatever initialization/setup is required post data load
  afterDataIsLoaded();
}