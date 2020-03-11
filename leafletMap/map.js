let status = 0;
const mymap = L.map("mapid").setView([47.097053, 37.542409], 12);
let markers = [];
let mapLayers;
let restaurants;
let attractions;
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
//----------------------------------
const request = require("request-promise");
const cheerio = require("cheerio");

const url = `https://tomato.ua/Mariupol/category/restaurant`;
const places = [];

const parse = async () => {
  const response = await request(url);
  let $ = cheerio.load(response, {
    xml: {
      normalizeWhitespace: true
    }
  });

  const companyCard = $(".search_item");
  const countAllRest = companyCard.length;
  console.log(countAllRest);
  companyCard.each((id, card) => {
    let domCard = $(card);
    let title = domCard.find(".title").text();
    makeObject(domCard, title);
  });
  if (countRestaurants >= countAllRest) {
    places.forEach((place, index) => {
      makeFetchLocation(place, index);
    });
  }
}; //<- end function parse()

parse(); //call function

//create markers on the map
function createMarkers() {
  places.forEach(place => {
    if (place.markerPosition !== "") {
      markers.push(
        L.marker(place.markerPosition, {
          icon: place.markerIcon,
          title: place.name,
          clickable: true,
          draggable: true
        }).addTo(mymap)
      );
    }
  });

  //add event to markers
  markers.forEach(marker => {
    let index;
    places.forEach((place, ind) => {
      if (place.name == marker.options.title) {
        index = ind;
      }
    });

    marker.addEventListener("click", e => {
      outerPopUp.classList.add("open");
      mymap.panTo(places[index].markerPosition);
      parseInfo(places[index]);
    });
  });
} //<- End function createMarkers()

//create layers
function createLayers() {
  attractions = L.layerGroup([markers[0]]);
  let arr = [];
  let countMarkers = 0;
  markers.forEach((m, index) => {
    if (places[index].type == "restaurants") {
      arr.push(m);
      countMarkers++;
    }
  });

  restaurants = L.layerGroup(arr);
  mapLayers = [attractions, restaurants];
  if (countMarkers >= countRestaurants) {
    addLayersToMap();
  }
} //end of function createLayers()

let countRestaurants = 0;

//create object with restaurant info
function makeObject(domCard, title) {
  let obj = {
    type: "restaurants",
    name: title,
    href: domCard.find(".search_item_img").attr("href"),
    address: domCard.find(".address").text(),
    markerPosition: "",
    description: "",
    images: [],
    markerIcon: new LeafIcon({
      iconUrl: domCard
        .find(".search_item_img")
        .css("background-image")
        .replace(/.*\s?url\([\'\"]?/, "")
        .replace(/[\'\"]?\).*/, "")
    })
  };
  countRestaurants++;
  places.push(obj);
}

//parse info about restaurant
async function parseInfo(place) {
  let response = await request(place.href);
  let $ = cheerio.load(response, {
    xml: {
      normalizeWhitespace: true
    }
  });
  let info = $(".panel");
  console.log("kuku", info.find(".all").text().length);
  if (info.find(".all").text().length == 0) {
    place.description = info.find(".text_content").text();
  } else {
    place.description = info.find(".all").text();
  }
  console.log(place.href + "/photos");
  parseImages(place.href + "/photos");

  createPopUpContent(place);
} //end of function parseInfo()

async function parseImages(imgUrl) {
  const response = await request(imgUrl);
  $ = cheerio.load(response, {
    xml: {
      normalizeWhitespace: true
    }
  });
  info = $(".image_block");
  console.log(info.length);
  // let images = info.find(".images_col>.image_block");
  // console.log(images);
}

function createPopUpContent(place) {
  innerPopUp.innerHTML = `
      <h2>${place.name}</h2>
      <p>${place.address}</p>
      <p>${place.description}</p>
      
      `;
}

//get location of restaurant on the map
async function makeFetchLocation(place, index) {
  let res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${"мариуполь " +
      place.name}&key=AIzaSyAfaEcMF7iaeuaK0VT8POocFReZ7IJ-LdQ`
  );
  let json = await res.json();
  let data = await json.results[0].geometry.location;
  place.markerPosition = [data.lat, data.lng];
  if (index >= places.length - 1) {
    createMarkers();
    createLayers();
  }
} //end function of makeFetchLocation()

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

//works with layers
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

//work with layers buttons
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
