"use strict";

var favourites;
var laPalmaData;
var dataVersion;

const dataSources = [
  "/data/categories.json",
  "/data/locations.json",
  "/data/routes.json",
  "/data/trail-statuses.json",
  "/data/POI.json",
];

// For diagnostics and development
var forceReload = true;
var forceReloadFavourites = false;
var performIntegrityCheck = false;

// URL paramater names - defining here ensures consistency
const URL_PARAM_ROUTE = "route";
const URL_PARAM_COLLECTION = "collection";
const URL_PARAM_STEPS = "steps";

/************************* Data loading setup ************************/

// returns true iff:
//  a) there is no previously stored version number (first time program run)
//  b) the file version number on the server is larger than the retrieved version
//
// Note: comparing versions is non-trivial so version numbers are simple integers
function isLaterVersion(currentVersionFromFile, retrievedVersionFromData) {
  if (retrievedVersionFromData === null) return true;

  return Number.parseInt(currentVersionFromFile) > Number.parseInt(retrievedVersionFromData);
}

// reads a tiny file containing just the current data version number (an integer)
async function getDataVersion() {
  let response = await fetch('/data-version.txt');

  if (response.status === 200) {
    dataVersion = await response.text();
    console.log("Data version " + dataVersion);
  }
}

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
  let retrievedVersion = localStorage.getItem("dataVersion");
  await getDataVersion();
  let dataNotCurrent = isLaterVersion(dataVersion, retrievedVersion);

  if (forceReload || dataNotCurrent) {
    // wait for all the data to come back then store it for later
    var responses = await getAllUrls(dataSources);
    localStorage.setItem("lapalmaData", JSON.stringify(responses));
    localStorage.setItem("dataVersion", dataVersion);
  } else {
    // retrieve from local storage
    responses = JSON.parse(localStorage.lapalmaData);
  }

  // distribute the returned data
  let categories = await responses[0];
  let locations = await responses[1];
  let routes = await responses[2];
  let trailStatuses = await responses[3];
  let pointsOfInterest = await responses[4];

  laPalmaData = new Data(categories, locations, routes, trailStatuses, pointsOfInterest);

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

/************************************* Wrapper for raw data *******************************/

class Data {
  #routeCollection;
  #poiCollection;

  constructor(categories, locations, routes, trailStatuses, pointsOfInterest) {
    // raw data
    this.categories = categories;
    this.locations = locations;
    this.trailStatuses = trailStatuses;
    this.pointsOfInterest = pointsOfInterest;

    // extracted maps from categories data
    this.walkType = new Map(categories.walkType);
    this.duration = new Map(categories.duration);
    this.effort = new Map(categories.effort);
    this.basics = new Map(categories.basics);
    this.interest = new Map(categories.interest);
    this.terrain = new Map(categories.terrain);
    this.warnings = new Map(categories.warnings);
    this.locations = new Map(locations);

    // extracted maps from other sources
    this.statuses = new Map(trailStatuses);
    this.poiMap = new Map(pointsOfInterest);

    // optionally check the data is valid before using it
    if (performIntegrityCheck) this.checkData(routes.routes);

    // map of POI created from raw data
    this.#poiCollection = new Map();
    this.poiMap.forEach((poiData, key) => {
      this.#poiCollection.set(key, this.getPoi(poiData));
    })

    // map of routes created from raw route data
    this.#routeCollection = new Map();
    routes.routes.forEach(route => {
      this.#routeCollection.set(route.id, this.getRoute(route));
    })

    // relate routes back to POIs
    this.#poiCollection.forEach(poi => {
      this.#routeCollection.forEach(route => {
        if (route.hasPoi && route.poi.has(poi.id)) {
          poi.relatedWalks.push(route.id);
          poi.hasRelatedWalks = true;
        }
      });
    })
  }


  get routes() { return this.#routeCollection; }
  get poi() { return this.#poiCollection; }

  // creates a route object derrived from the raw route data but with reference lookups
  // resolved, data in more digestible formats, and additional helper properties
  getRoute(route) {
    let notes = "notes" in route ? new Map(route.notes) : new Map();
    return {
      id: route.id,
      name: route.name,
      lengthKm: route.lengthKm,
      lengthMiles: route.lengthMiles,
      walkingTime: route.walkingTime,
      shortDescription: route.shortDescription,
      description: route.description,

      isStarred: route.starred == "true",
      starredAttributes: this.basics.get("starred"),

      walkType: route.walkType,
      walkTypeAttributes: this.walkType.get(route.walkType),

      duration: route.duration,
      durationAttributes: this.duration.get(route.duration),
      isShort: route.duration == "stroll" || route.duration == "half",

      effort: route.effort,
      effortAttributes: this.effort.get(route.effort),

      isCompletelyWaymarked: route.waymarked == "true",
      waymarkedAttributes: this.basics.get("waymarked"),

      isAccessibleByCar: route.accessCar == "true",
      accessCarAttributes: this.basics.get("accessCar"),

      isAccessibleByBus: route.accessBus == "true",
      accessBusAttributes: this.basics.get("accessBus"),

      routeFile: route.routeFile,

      refreshments: route.refreshments,
      refreshmentsAttributes: this.basics.get("refreshments"),

      start: route.start,
      startAttributes: this.locations.get(route.start),

      end: route.end,
      endAttributes: this.locations.get(route.end),

      paths: this.getPathsMap(route),
      hasPaths: "paths" in route,

      images: route.images,

      variants: this.getVariantsArray(route),
      hasVariants: "variants" in route,

      terrain: this.getListMap(route.terrain, this.terrain, notes),
      interest: this.getListMap(route.interest, this.interest, notes),
      warnings: this.getListMap(route.warnings, this.warnings, notes),

      poi: this.getPoiMap(route),
      hasPoi: "poi" in route,

      dangers: "dangers" in route ? route.dangers : new Array(),
      hasDangers: "dangers" in route
    }
  }

  // creates a POI object derrived from the raw poi data but with reference lookups
  // resolved and derrived data added
  getPoi(poi) {
    return {
      id: poi.id,
      name: poi.name,
      fullName: poi.fullName,
      tags: poi.tags,
      description: poi.description,
      locationDescription: poi.locationDescription,

      entryCost: poi.entryCost,
      hasEntryCost: "entryCost" in poi,
      
      tel: "tel" in poi ? poi.tel : "",
      hasTel: "tel" in poi,

      email: "email" in poi ? poi.email : "",
      hasEmail: "email" in poi,

      web: "web" in poi ? poi.web : "",
      hasWeb: "web" in poi,

      location: poi.location,
      locationAttributes: this.locations.get(poi.location),

      openingTimes: poi.openingTimes,
      hasOpeningTimes: "openingTimes" in poi,

      relatedWalks: new Array(),
      hasRelatedWalks: false
    }
  }

  // returns a POI map with the POI reference resolved and the POI id as the key
  getPoiMap(route) {
    let poiMap = new Map();
    if ("poi" in route) {
      route.poi.forEach(poiKey => {
        let poiAttributes = this.#poiCollection.get(poiKey);
        poiMap.set(poiAttributes.id, poiAttributes);
      })
    }
    return poiMap;
  }

  // returns a paths map with the path as key and the current path status as value
  getPathsMap(route) {
    let paths = new Map();
    if ("paths" in route) {
      route.paths.forEach(path => {
        paths.set(path, this.statuses.get(path));
      })
    }
    return paths;
  }

  // returns an array of new variant objects with references resolved and helper properties
  getVariantsArray(route) {
    let variants = new Array();
    if ("variants" in route) {
      route.variants.forEach(variant => {
        variants.push({
          id: variant.id,
          name: variant.name,
          description: variant.description,

          walkType: variant.warningType,
          walkTypeAttributes: this.walkType.get(variant.walkType),

          duration: variant.duration,
          durationAttributes: this.duration.get(variant.duration),
          isShort: variant.duration == "stroll" || variant.duration == "half",

          effort: variant.effort,
          effortAttributes: this.effort.get(variant.effort),

          isAccessibleByCar: variant.accessCar == "true",
          accessCarAttributes: this.basics.get("accessCar"),

          isAccessibleByBus: variant.accessBus == "true",
          accessBusAttributes: this.basics.get("accessBus"),

          start: variant.start,
          startAttributes: this.locations.get(variant.start),

          end: variant.end,
          endAttributes: this.locations.get(variant.end),

          routeFile: "routeFile" in variant ? variant.routeFile : "",
          hasRouteFile: "routeFile" in variant,

          routeDirections: "routeDirections" in variant ? variant.routeDirections : "",
          hasRouteDirections: "routeDirections" in variant
        })
      })
    }
    return variants;
  }

  // returns a map from the base data in which the entries are added in the order they
  // appear in the lookup map which ensures a consistent order in the map regardless of
  // the order of items in the JSON data.
  getListMap(baseMapData, lookup, notes) {
    let baseData = new Map(baseMapData);
    let listMap = new Map();
    lookup.forEach((attributes, name) => {
      if (baseData.has(name)) {
        // if there is a note for this type, override the default description with it
        let noteModifiedDescription = attributes.description;
        if (notes.has(name)) {
          noteModifiedDescription = notes.get(name);
        }

        listMap.set(
          name,
          {
            isStrong: baseData.get(name) == "strong",
            noteModifiedDescription: noteModifiedDescription,
            text: attributes.text,
            filterIncludeText: attributes.filterIncludeText,
            filterExcludeText: attributes.filterExcludeText,
            description: attributes.description,
            strongTag: attributes.strong,
            icon: attributes.icon
          })
      }
    })
    return listMap;
  }

  /*************** raw data integrity checking  ****************************/

  // A schema would be better but wouldn't do the refferential integrity checking
  // The following is not definitive but does catch the vast majority of errors
  // that come from manually updated data

  checkData(routes) {
    // walk locations
    try {
      console.log(`Checking walkLocations:`);

      // mandatory fields
      this.isNonEmptyString("text", this.categories.walkLocations.text);
      this.isNonEmptyString("filterIncludeText", this.categories.walkLocations.filterIncludeText);
      this.isDefined("filterExcludeText", this.categories.walkLocations.filterExcludeText);
      this.isDefined("description", this.categories.walkLocations.description);
      this.isSVG("icon", this.categories.walkLocations.icon);
    }
    catch (error) {
      console.log(`walkLocations checking error:\n${error}`);
      console.log(error.stack);
    }

    // danger
    try {
      console.log(`Checking danger:`);

      // mandatory fields
      this.isNonEmptyString("text", this.categories.danger.text);
      this.isDefined("filterIncludeText", this.categories.danger.filterIncludeText);
      this.isNonEmptyString("filterExcludeText", this.categories.danger.filterExcludeText);
      this.isDefined("description", this.categories.danger.description);
      this.isSVG("icon", this.categories.danger.icon);
    }
    catch (error) {
      console.log(`walkLocations checking error:\n${error}`);
      console.log(error.stack);
    }

    // poiCategories
    try {
      this.categories.poiCategories.forEach(poiCategory => {
        console.log(`Checking ${poiCategory.id}`);
        // mandatory fields
        this.isNonEmptyString("id", poiCategory.id);
        this.isNonEmptyString("description", poiCategory.description);
      })
    }
    catch (error) {
      console.log(`poiCategories checking error:\n${error}`);
      console.log(error.stack);
    }

    // walk type
    try {
      this.walkType.forEach((property, propertyName) => {
        console.log(`Checking walkType ${propertyName}:`);

        // mandatory fields
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`WalkType checking error:\n${error}`);
      console.log(error.stack);
    }

    // duration
    try {
      this.duration.forEach((property, propertyName) => {
        console.log(`Checking walkType ${propertyName}:`);

        // mandatory fields
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Duration checking error:\n${error}`);
      console.log(error.stack);
    }

    // effort
    try {
      this.effort.forEach((property, propertyName) => {
        console.log(`Checking effort ${propertyName}:`);

        // mandatory field checks
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Effort checking error:\n${error}`);
      console.log(error.stack);
    }

    // basics
    try {
      this.basics.forEach((property, propertyName) => {
        console.log(`Checking basics ${propertyName}:`);

        // mandatory field checks
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Basics checking error:\n${error}`);
      console.log(error.stack);
    }

    // interest
    try {
      this.interest.forEach((property, propertyName) => {
        console.log(`Checking interest ${propertyName}:`);

        // mandatory field checks
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isNonEmptyString("strong", property.strong);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Interests checking error:\n${error}`);
      console.log(error.stack);
    }

    // terrain
    try {
      this.terrain.forEach((property, propertyName) => {
        console.log(`Checking terrain ${propertyName}:`);

        // mandatory fields
        this.isNonEmptyString("text", property.text);
        this.isNonEmptyString("filterIncludeText", property.filterIncludeText);
        this.isDefined("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isNonEmptyString("strong", property.strong);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Terrain checking error:\n${error}`);
      console.log(error.stack);
    }

    // warnings    
    try {
      this.warnings.forEach((property, propertyName) => {
        console.log(`Checking warnings ${propertyName}:`);

        // mandatory field checks
        this.isNonEmptyString("text", property.text);
        this.isDefined("filterIncludeText", property.filterIncludeText);
        this.isNonEmptyString("filterExcludeText", property.filterExcludeText);
        this.isDefined("description", property.description);
        this.isNonEmptyString("strong", property.strong);
        this.isSVG("icon", property.icon);
      })
    }
    catch (error) {
      console.log(`Warnings checking error:\n${error}`);
      console.log(error.stack);
    }

    // statuses
    try {
      this.statuses.forEach((trailStatus, trailName) => {
        console.log(`Checking trail statuses`);

        // mandatory field checks
        this.isValidTrailName("trailName", trailName);
        this.isValidTrailStatus("trailStatus", trailStatus);
      })
    }
    catch (error) {
      console.log(`Trail status checking error:\n${error}`);
      console.log(error.stack);
    }  

    // locations
    try {
      this.locations.forEach((location, locatioName) => {
        console.log(`Checking location ${locatioName}:`);

        // mandatory fields
        this.areValidCoordinates("coordinates", location.coordinates);
        this.areValidAreas("areas", location.areas);
        this.isNonEmptyArray("areas", location.areas);
        this.isNonEmptyString("province", location.province);

        // optional fields 
        if ("notes" in location) { this.isNonEmptyString("notes", location.notes); }
        if ("parking" in location) { this.isNonEmptyString("parking", location.parking); }
        if ("taxi" in location) { this.isNonEmptyString("taxi", location.taxi); }
        if ("bus" in location) {
          if ("notes" in location.bus) { this.isNonEmptyString("bus.notes", location.bus.notes); }
          this.areValidRouteNumbers("bus.routes", location.bus.routes);
        }
      })
    }
    catch (error) {
      console.log(`Location checking error:\n${error}`);
      console.log(error.stack);
    }

    // POI
    try {
      this.poiMap.forEach((poi, poiName) => {
        console.log(`Checking POI ${poiName}:`);

        // mandatory fields
        this.isNumber("id", poi.id);
        this.isNonEmptyString("name", poi.name);
        this.isNonEmptyString("fullName", poi.fullName);
        this.areValidPoiTags("tags", poi.tags);
        this.isNonEmptyString("description", poi.description);
        this.isNonEmptyString("location", poi.location);
        this.isNonEmptyString("locationDescription", poi.locationDescription);
        
        // optional fields
        if ("entryCost" in poi) { this.isNonEmptyString("entryCost", poi.entryCost); }

        // NB. not testing correct format of these, only that they exist
        if ("tel" in poi) { this.isNonEmptyString("tel", poi.tel); }
        if ("email" in poi) { this.isNonEmptyString("email", poi.email); }
        if ("web" in poi) { 
          this.isNonEmptyString("web.name", poi.web.name); 
          this.isNonEmptyString("web.link", poi.web.link); 
        }

        if ("openingTimes" in poi) {
          this.isNonEmptyArray("openingTimes", poi.openingTimes);
          poi.openingTimes.forEach(entry => {
            this.isNonEmptyString("when", entry.when);
            this.isNonEmptyString("times", entry.times);
          })
        }
      })
    }
    catch (error) {
      console.log(`POI checking error:\n${error}`);
      console.log(error.stack);
    }

    // routes
    try {
      routes.forEach(route => {
        console.log(`Checking Route ${route.id}:`);

        // mandatory fields
        this.isNumber("id", route.id);
        this.isNonEmptyString("name", route.name);
        this.isNumber("lengthKm", route.lengthKm);
        this.isNumber("lengthMiles", route.lengthMiles);
        this.isNonEmptyString("walkingTime", route.walkingTime);
        this.isNonEmptyString("shortDescription", route.shortDescription);
        this.isNonEmptyString("description", route.description);
        this.isBoolean("starred", route.starred);
        this.isValidLookup("walkType", route.walkType, this.walkType, "walkType");
        this.isValidLookup("duration", route.duration, this.duration, "duration");
        this.isValidLookup("effort", route.effort, this.effort, "effort");
        this.isBoolean("waymarked", route.waymarked);
        this.isBoolean("accessCar", route.accessCar);
        this.isBoolean("accessBus", route.accessBus);
        this.isNonEmptyString("province", route.province);
        this.isNonEmptyString("town", route.town);
        this.isNonEmptyString("routeFile", route.routeFile);
        this.isNonEmptyString("refreshments", route.refreshments);
        this.isValidLookup("start", route.start, this.locations, "locations");
        this.isValidLookup("end", route.end, this.locations, "locations");

        this.isNonEmptyArray("images", route.images);
        route.images.forEach(image => {
          this.isNumber("image.id", image.id);
          this.isNonEmptyString("image.caption", image.caption);
        })

        this.isArray("terrain", route.terrain);
        route.terrain.forEach(t => {
          this.isValidLookup(t[0], t[0], this.terrain, "terrain");
        })

        this.isArray("interest", route.interest);
        route.interest.forEach(i => {
          this.isValidLookup(i[0], i[0], this.interest, "interest");
        })

        this.isArray("warnings", route.warnings);
        route.warnings.forEach(w => {
          this.isValidLookup(w[0], w[0], this.warnings, "warning");
        })

        // optional fields 
        if ("variants" in route) {
          this.isNonEmptyArray("pvariantsoi", route.variants);
          route.variants.forEach(v => {
            // mandatory fields
            this.isNonEmptyString("variant.id", v.id);
            this.isNonEmptyString("variant.name", v.name);
            this.isNonEmptyString("variant.description", v.description);
            this.isValidLookup("variant.walkType", v.walkType, this.walkType, "walkType");
            this.isValidLookup("variant.duration", v.duration, this.duration, "duration");
            this.isValidLookup("variant.effort", v.effort, this.effort, "effort");
            this.isBoolean("variant.accessCar", v.accessCar);
            this.isBoolean("variant.accessBus", v.accessBus);
            this.isNonEmptyString("variant.start", v.start, this.locations, "locations");
            this.isNonEmptyString("variant.end", v.end, this.locations, "locations");
            this.isNonEmptyString("variant.routeDirections", v.routeDirections);

            // optional fields
            if ("routeFile" in v) {
              this.isNonEmptyString("variant.routeFile", v.routeFile);
            }
          })
        }

        if ("paths" in route) {
          this.isNonEmptyArray("paths", route.paths);
          route.paths.forEach(path => {
            this.isValidLookup(path, path, this.statuses, "path");
          })
        }

        if ("poi" in route) {
          this.isNonEmptyArray("poi", route.poi);
          route.poi.forEach(poi => {
            this.isValidLookup("variant.poi", poi, this.poiMap, "POI");
          })
        }

        // Notes refer to interests or warnings
        if ("notes" in route) {
          this.isNonEmptyArray("notes", route.notes);
          route.notes.forEach(n => {
            let foundInInterest = route.interest.find(i => n[0] == i[0]) != undefined;
            let foundInWarnings = route.warnings.find(w => n[0] == w[0]) != undefined;
            let foundInTerrain = route.terrain.find(t => n[0] == t[0]) != undefined;
            console.assert(foundInInterest || foundInWarnings || foundInTerrain, 
              `${n} is not a valid interest, warning or terrain reference`);
          })
        }

        if ("dangers" in route) {
          this.isNonEmptyArray("dangers", route.dangers);
          route.dangers.forEach(danger => {
            this.isNonEmptyString("danger.name", danger.name);
            this.isNonEmptyString("danger.description", danger.description);
          })
        }
      })
    }
    catch (error) {
      console.log(`Routes checking error:\n${error}`);
      console.log(error.stack);
    }
  }

  /*************** helper checking methods  ****************************/

  isValidLookup(propertyName, property, category, categoryName) {
    console.assert(category.has(property), `${propertyName} is not a valid ${categoryName}`);
  }

  isDefined(propertyName, property) {
    console.assert(property != undefined, `${propertyName} is a required property`);
    return property != undefined;
  }

  isNonEmptyString(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      console.assert(property.length > 0, `${propertyName} must not be empty string`);
    }
  }

  isBoolean(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      console.assert(property === "true" || property === "false", `${propertyName} must be boolean`);
    }
  }

  isNumber(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      // Note: number check can be fooled
      console.assert(!isNaN(property), `${propertyName} '${property}' is not a number`);
    }
  }

  isSVG(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      this.isNonEmptyString(propertyName, property);
      console.assert(property.endsWith(".svg"), `${propertyName} must be SVG type`);
    }
  }

  isArray(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      console.assert(Array.isArray(property), `${propertyName} is not an Array`);
    }
  }

  isNonEmptyArray(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      this.isArray(propertyName, property);
      console.assert(property.length > 0, `${propertyName} must not be empty`);
    }
  }

  isValidTrailName(propertyName, trailName) {
    let nameParts = trailName.split(' ');
    const validRouteTypes = ["GR", "PR", "SL"];
    const validAreaTypes = ["LP", "BB", "BL", "EP", "FU", "PL", "SC", "TJ", "VG", "VM", "PG"];
    const gr130Stages = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const gr131Stages = ["1", "2", "3"];
    if (nameParts[0] == "GR") {
      console.assert(nameParts[1] == "130" || nameParts[1] == "131", `${trailName} is not a valid GR route`);
      console.assert(nameParts[2] == "Etapa", `${trailName} missing Etapa designation`);
      if (nameParts[1] == "130") {
        console.assert(gr130Stages.includes(nameParts[3]), `${trailName} is not a valid GR stage`);
      } else {
        console.assert(gr131Stages.includes(nameParts[3]), `${trailName} is not a valid GR stage`);
      }
    } else {
      console.assert(validRouteTypes.includes(nameParts[0]), `${trailName} has invalid route type`);
      console.assert(validAreaTypes.includes(nameParts[1]), `${trailName} has invalid area type`);
      // Note: number check can be fooled
      console.assert(!isNaN(nameParts[2]), `${trailName} has invalid trail number`);
    }
  }

  isValidTrailStatus(propertyName, trailStatus) {
    const validStatuses = ["open", "closed", "unknown"];
    console.assert(validStatuses.includes(trailStatus), `${trailStatus} is not a valid trail status`);
  }


  areValidAreas(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      this.isNonEmptyArray(propertyName, property);
      const validAreas = ["north", "west", "south", "east", "central"];
      property.forEach(area => {
        console.assert(validAreas.includes(area), `'${area}' is not a valid location area`);
      })
    }
  }

  areValidRouteNumbers(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      this.isNonEmptyArray(propertyName, property);
      property.forEach(route => {
        this.isNumber(propertyName, route);
      })
    }
  }

  areValidPoiTags(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      this.isNonEmptyArray(propertyName, property);
      let tags = this.categories.poiCategories;
      property.forEach(tag => {
        let found = tags.find(t => t.id == tag) != undefined;
        console.assert(found, `${tag} is not a valid POI tag`);
      })
    }
  }

  areValidCoordinates(propertyName, property) {
    if (this.isDefined(propertyName, property)) {
      let coords = property.split(",");
      console.assert(coords.length > 0, `${property.name} does not have two values`);
      let lat = Number.parseFloat(coords[0].trim());
      let long = Number.parseFloat(coords[1].trim());
      console.assert(lat != NaN, "Latitude is not a number");
      console.assert(long != NaN, "Longitude is not a number");
    }
  }

}