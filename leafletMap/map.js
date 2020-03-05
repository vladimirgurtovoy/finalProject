const mymap = L.map("mapid").setView([47.097053, 37.542409], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

//create marker class
var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "./images/markers/marker-shadow.png",
    iconSize: [48, 48],
    shadowSize: [32, 32],
    iconAnchor: [24, 48],
    shadowAnchor: [10, 32],
    popupAnchor: [-3, -76]
  }
});
L.icon = function(options) {
  return new L.Icon(options);
};

let places = [];
places[0] = {
  name: "Городской парк",
  type: "",
  description: `Городско́й сад города Мариуполь — центральный парк культуры и отдыха (в послевоенное время официальное название — Детский ЦПКиО), основан в 1863 году на, тогда ещё южной, окраине города. Расположен в Центральном районе Мариуполя, ограничен проспектом Металлургов, улицей Семенишина и крутым склоном у Слободки.

  В городском саду расположены 3 памятника:
  
  Лётчикам-героям Великой Отечественной войны Семенишину и Лавицкому.
  Героям Гражданской Войны («Пушка»).
  Памятник героям Великой Отечественной войны.
  На территории Горсада расположен летний кинотеатр, городской дворец пионеров, дворец спорта «Спартак» и др. В саду также находятся небольшой макет-водоём Черного и Азовского морей.`,
  images: ["CityPark1.jpg", "CityPark2.jpg", "CityPark3.jpg"],
  adress: "",
  markerPosition: [47.087633, 37.544744],
  markerIcon: new LeafIcon({ iconUrl: "./images/markers/CityParkMarker.png" })
};

places[1] = {
  name: "MAFIA",
  type: "Restaurants",
  description:
    "MAFIA — це сучасний демократичний ресторан італійської та японської кухні з якісним обслуговуванням та цінами, доступними для людей із середнім рівнем достатку. Меню ресторану поєднує в собі дві найпопулярніші в Україні кулінарні традиції — японську й італійську, і в цьому криється один із секретів успіху. Фірмова метрова піца, регулярні спеціальні пропозиції та акції вже стали візитними картками MAFIA.",
  images: ["Mafia1.jpg"],
  adress:
    "ТРЦ ПортCity, Запорізьке шосе, 2, Маріуполь, Донецька область, 87500",
  markerPosition: [47.114772, 37.508811],
  markerIcon: new LeafIcon({ iconUrl: "./images/markers/mafia-marker.png" })
};

let markers = [];
places.forEach(place => {
  markers.push(
    L.marker(
      place.markerPosition,
      { icon: place.markerIcon },
      { title: place.name }
    ).addTo(mymap)
  );
});
let attractions = L.layerGroup([markers[0]]);
let restaurants = L.layerGroup([markers[1]]);
let mapLayers = [attractions, restaurants];

addLayersToMap();

markers.forEach((marker, index) => {
  marker.addEventListener("click", e => {
    outerPopUp.classList.add("open");
    mymap.panTo(places[index].markerPosition);
    innerPopUp.innerHTML = `
    <h2>${places[index].name}</h2>
    <p>${places[index].description}</p>
    <img src="./images/${places[index].images[0]}" alt="${places[index].name} image ${index}">
    `;
  });
});

//pop-up javascript ↓
const innerPopUp = document.querySelector(".pop-up-inner");
const outerPopUp = document.querySelector(".pop-up-outer");

outerPopUp.addEventListener("click", hidePopUp);

function hidePopUp(e) {
  if (e.target == e.currentTarget) {
    outerPopUp.classList.remove("open");
  }
}
const mapBtnAll = document.querySelector(".map-btn-all");
const mapBtnRestaurants = document.querySelector(".map-btn-restaurants");
const mapBtnAttractions = document.querySelector(".map-btn-attractions");
const mapBtnLayers = [mapBtnAll, mapBtnAttractions, mapBtnRestaurants];

mapBtnRestaurants.addEventListener("click", btn => {
  if (btn.target.classList.contains("active")) {
    addLayersToMap();
    btn.target.classList.remove("active");
    mapBtnAll.classList.add("active");
  } else {
    activeLayerBtn(btn.target);
    removeLayersFromMap();
    mymap.addLayer(mapLayers[1]);
  }
});

mapBtnAttractions.addEventListener("click", btn => {
  if (btn.target.classList.contains("active")) {
    addLayersToMap();
    btn.target.classList.remove("active");
    mapBtnAll.classList.add("active");
  } else {
    activeLayerBtn(btn.target);
    removeLayersFromMap();
    mymap.addLayer(mapLayers[0]);
  }
});

mapBtnAll.addEventListener("click", btn => {
  activeLayerBtn(btn.target);
  removeLayersFromMap();
  addLayersToMap();
});

function addLayersToMap() {
  mapLayers.forEach(layer => {
    mymap.addLayer(layer);
  });
}

function removeLayersFromMap() {
  mapLayers.forEach(layer => {
    mymap.removeLayer(layer);
  });
}

function activeLayerBtn(elem) {
  removeActiveClass();
  if (!elem.classList.contains("active")) {
    elem.classList.add("active");
  }
}

function removeActiveClass() {
  mapBtnLayers.forEach(btn => {
    btn.classList.remove("active");
  });
}
let mapBtn = document.querySelector(".map-btns");
let filterBtn = mapBtn.querySelector(".filter-btns");
let hideBtn = mapBtn.querySelector(".hideBtn");
let mapDiv = document.querySelector(".map");

hideBtn.addEventListener("click", e => {
  if (filterBtn.classList.contains("hide")) {
    filterBtn.classList.remove("hide");
    hideBtn.innerText = "< Скрыть фильтр";
    mapBtn.classList.remove("hide-filter");
    mapDiv.classList.remove("hide-filter");
  } else {
    filterBtn.classList.add("hide");
    hideBtn.innerText = ">";
    mapBtn.classList.add("hide-filter");
    mapDiv.classList.add("hide-filter");
  }
});
