"use strict";

var locationList;
var locationSelector;
var forecastFrame;

// setup the forecast drop-down list and listen for changes
window.onload = function () {
  populateLocationList();

  locationSelector = document.getElementById("forecast-locations");
  forecastFrame = document.getElementById("iframe_aemet_id33044");

  locationSelector.addEventListener("change", locationChange);
};


// update the forecast iframe with the selected location URL
function locationChange() {
  let selectedValue = locationSelector.options[locationSelector.selectedIndex].value;
  let locationUrlFragment = locationList.get(selectedValue);
  forecastFrame.src = `https://www.aemet.es/en/eltiempo/prediccion/municipios/mostrarwidget/${locationUrlFragment}?w=g3p01110011ohmffffffw320z243x4f86d9t95b6e9r1s8n2`;
}


// map DDL selections to URL fragments defining each location
// location URL fragments extracted from AEMET widget page for each location
function populateLocationList() {
  locationList = new Map();
  locationList.set("0", "santa-cruz-de-la-palma-id38037"); // default
  locationList.set("1", "barlovento-id38007");
  locationList.set("2", "brena-alta-san-pedro-id38008");
  locationList.set("3", "brena-baja-san-jose-id38009");
  locationList.set("4", "fuencaliente-de-la-palma-canarios-los-id38014");
  locationList.set("5", "garafia-santo-domingo-id38016");
  locationList.set("6", "llanos-de-aridane-los-id38024");
  locationList.set("7", "puntagorda-pino-de-la-virgen-id38029");
  locationList.set("8", "puntallana-san-juan-de-puntallana-id38030");
  locationList.set("9", "san-andres-y-sauces-sauces-los-id38033");
  locationList.set("10", "santa-cruz-de-la-palma-id38037");
  locationList.set("11", "tazacorte-id38045");
  locationList.set("12", "tijarafe-pueblo-el-id38047");
  locationList.set("13", "villa-de-mazo-pueblo-el-id38053");
}