"use strict";

var favourites;
var routeFormat;
var laPalmaData;

const dataSources = [
  "/data/categories.json",
  "/data/locations.json",
  "/data/routes.json",
  "/data/trail-statuses.json",
  "/data/POI.json",
];

// For diagnostics and development
var forceReload = true;
var performIntegrityCheck = false;

// URL paramater names - defining here ensures consistency
const URL_PARAM_ROUTE = "route";
const URL_PARAM_COLLECTION = "collection";

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
  let categories = await responses[0];
  let locations = await responses[1];
  let routes = await responses[2];
  let trailStatuses = await responses[3];
  let pointsOfInterest = await responses[4];

  laPalmaData = new Data(categories, locations, routes, trailStatuses, pointsOfInterest);

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

    // map of POI created from raw data
    this.#poiCollection = new Map();
    this.poiMap.forEach((poiData, key) => {
      this.#poiCollection.set(key, this.getPoi(poiData));
    })

    // map of routes created from raw route data
    this.#routeCollection = new Map();
    routes.routes.forEach(route => {
      if (performIntegrityCheck) this.integrityCheck(route);
      this.#routeCollection.set(route.id, this.getRoute(route));
    })

    // relate routes back to POIs
    this.#poiCollection.forEach(poi => {
      this.#routeCollection.forEach(route => {
        if (route.hasPoi && route.poi.has(poi.id)) {
          poi.relatedWalks.push(poi.id);
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

      variants: this.getVariantsArray(route),
      hasVariants: "variants" in route,

      terrain: this.getListMap(route.terrain, this.terrain, notes),
      interest: this.getListMap(route.interest, this.interest, notes),
      warnings: this.getListMap(route.warnings, this.warnings, notes),

      poi: this.getPoiMap(route),
      hasPoi: "poi" in route,

      dangers: "dangers" in route ? new Array(route.dangers) : new Array(),
      hasDangers: "dangers" in route
    }
  }

  // creates a POI object derrived from the raw poi data but with reference lookups
  // resolved and derrived data added
  getPoi(poi) {
    return {
      id: poi.id,
      name: poi.name,
      tags: poi.tags,
      description: poi.description,
      entryCost: poi.entryCost,
      
      tel: poi.tel,
      hasTel: "tel" in poi,

      location: poi.location,
      locationAttributes: this.locations.get(poi.location),

      openingTimes: poi.openingTimes,
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

          effort: variant.effort,
          effortAttributes: this.effort.get(variant.effort),

          accessCar: variant.accessCar == "true",
          accessCarAttributes: this.basics.get("accessCar"),

          accessBus: variant.accessBus == "true",
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

  // checks the incoming route data for missing fields, wrong types and (in some cases) wrong values
  integrityCheck(route) {
    // mandatory fields
    console.assert("id" in route, `id is a required field`);
    console.assert(typeof route.id == "string", `id must be a string`);
    console.assert(route.id != "", `id must not be empty`);

    this.requiredNonEmptyString(route, "name", route.id);
    this.requiredNonEmptyString(route, "lengthKm", route.lengthKm);
    this.requiredNonEmptyString(route, "lengthMiles", route.lengthMiles);
    this.requiredNonEmptyString(route, "walkingTime", route.walkingTime);
    this.requiredNonEmptyString(route, "shortDescription", route.shortDescription);
    this.requiredNonEmptyString(route, "description", route.description);
    this.requiredNonEmptyString(route, "province", route.province); //?
    this.requiredNonEmptyString(route, "town", route.town); //?
    this.requiredNonEmptyString(route, "routeFile", route.routeFile);
    this.requiredNonEmptyString(route, "refreshments", route.refreshments);

    if ("accessOther" in route) {
      console.assert(typeof route.accessOther == "string", `route ${route.id}: accessOther must be a string`);
      console.assert(route.accessOther != "", `route ${route.id}: accessOther must not be empty`);
    }

    this.requiredNonEmptyString(route, "starred", route.starred);
    this.requiredBoolean(route, "starred", route.starred);

    this.requiredNonEmptyString(route, "duration", route.duration);
    console.assert(duration.has(route.duration), `route ${route.id}: ${route.duration} is not a listed duration type`);

    this.requiredNonEmptyString(route, "effort", route.effort);
    console.assert(effort.has(route.effort), `route ${route.id}: ${route.effort} is not a listed effort type`);

    this.requiredNonEmptyString(route, "waymarked", route.waymarked);
    this.requiredBoolean(route, "accessBus", route.accessBus);

    this.requiredNonEmptyString(route, "accessCar", route.accessCar);
    this.requiredBoolean(route, "accessCar", route.accessCar);

    this.requiredNonEmptyString(route, "accessBus", route.accessBus);
    this.requiredBoolean(route, "accessBus", route.accessBus);

    this.requiredNonEmptyString(route, "start", route.start);
    console.assert(locations.has(route.start), `route ${route.id}: ${route.start} is not a listed location`);

    this.requiredNonEmptyString(route, "end", route.end);
    console.assert(locations.has(route.end), `route ${route.id}: ${route.end} is not a listed location`);

    if ("paths" in route) {
      console.assert(Array.isArray(route.paths), `route ${route.id}: paths field must be array`);
      console.assert(route.paths.length > 0, `route ${route.id}: paths cannot be empty`);
    }

    if ("poi" in route) {
      console.assert(Array.isArray(route.poi), `route ${route.id}: poi field must be an array`);
      console.assert(route.poi.length > 0, `route ${route.id}: poi cannot be empty`);
      route.poi.forEach(routePoi => {
        console.assert(routePoi != "", `route ${route.id}: poi must not be empty`);
        console.assert(poi.has(routePoi), `route ${route.id}: ${routePoi} is not a listed POI`);
      });
    }

    console.assert("terrain" in route, `route ${route.id}: terrain is a required field`);
    console.assert(Array.isArray(route.terrain), `route ${route.id}: terrain field must be an array`);
    console.assert(route.terrain.length > 0, `route ${route.id}: terrain cannot be empty`);
    route.terrain.forEach(routeTerrain => {
      let terrainType = routeTerrain[0];
      let terrainValue = routeTerrain[1];
      console.assert(terrain.has(terrainType), `route ${route.id}: ${terrainType} is not a listed terrain`);
      console.assert(terrainValue == "normal" || terrainValue == "strong", `route ${route.id}: ${terrainValue} is not a valid terrain value`);
    });

    console.assert("interest" in route, `route ${route.id}: interest is a required field`);
    console.assert(Array.isArray(route.interest), `route ${route.id}: interest field must be an array`);
    console.assert(route.interest.length > 0, `route ${route.id}: interest cannot be empty`);
    route.interest.forEach(routeInterest => {
      let interestType = routeInterest[0];
      let interestValue = routeInterest[1];
      console.assert(interest.has(interestType), `route ${route.id}: ${interestType} is not a listed interest`);
      console.assert(interestValue == "normal" || interestValue == "strong", `route ${route.id}: ${interestValue} is not a valid interest value`);
    });

    console.assert("warnings" in route, `route ${route.id}: warnings is a required field`);
    console.assert(Array.isArray(route.warnings), `route ${route.id}: warnings field must be an array`);
    console.assert(route.warnings.length > 0, `route ${route.id}: warnings cannot be empty`);
    route.warnings.forEach(routeWarning => {
      let warningType = routeWarning[0];
      let warningValue = routeWarning[1];
      console.assert(warnings.has(warningType), `route ${route.id}: ${warningType} is not a listed warning`);
      console.assert(warningValue == "normal" || warningValue == "strong", `route ${route.id}: ${warningValue} is not a valid warning value`);
    });

    if ("notes" in route) {
      console.assert(Array.isArray(route.notes), `route ${route.id}: notes field must be an array`);
      console.assert(route.notes.length > 0, `route ${route.id}: notes cannot be empty`);
      route.notes.forEach(routeNote => {
        let noteField = routeNote[0];
        let i = route.interest.find(x => x[0] == noteField);
        let w = route.warnings.find(x => x[0] == noteField);
        console.assert(i !== undefined || w !== undefined, `route ${route.id}: ${noteField} does not relate to a feature or warning`);
      });
    }

    if ("variants" in route) {
      console.assert(Array.isArray(route.variants), `route ${route.id}: variants field must be an array`);
      route.variants.forEach(variant => {
        this.requiredNonEmptyString(route, "id", variant.id);
        this.requiredNonEmptyString(route, "name", variant.id);
        this.requiredNonEmptyString(route, "description", variant.description);

        if ("routeFile" in variant) {
          console.assert(typeof variant.routeFile == "string", `route ${route.id}: routeFile must be a string`);
          console.assert(variant.routeFile != "", `route ${route.id}: routeFile must not be empty`);
        }

        this.requiredNonEmptyString(route, "start", variant.start);
        console.assert(locations.has(variant.start), `variant ${variant.id}: ${variant.start} is not a listed location`);

        this.requiredNonEmptyString(route, "end", variant.end);
        console.assert(locations.has(variant.end), `variant ${variant.id}: ${variant.end} is not a listed location`);

        if ("routeDirections" in variant) {
          console.assert(typeof variant.routeDirections == "string", `variant ${variant.id}: routeDirections must be a string`);
          console.assert(variant.routeDirections != "", `variant ${variant.id}: routeDirections must not be empty`);
        }
      })
    }
  }

  // checks field is either 'true' or 'false'
  requiredBoolean(route, fieldName, field) {
    console.assert(field == "true" || field == "false", `route ${route.id}: ${fieldName} must be 'true' or 'false'`);
  }

  // checks field exists and is a string and is not empty
  requiredNonEmptyString(route, fieldName, field) {
    console.assert(fieldName in route, `route ${route.id}: ${fieldName} is a required field`);
    if (fieldName in route) {
      console.assert(typeof field == "string", `route ${route.id}: ${fieldName} must be a string`);
      console.assert(field != "", `route ${route.id}: ${fieldName} must not be empty`);
    }
  }

}