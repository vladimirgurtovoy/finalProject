const mymap = L.map("mapid").setView([47.097053, 37.542409], 12); //create map
let markers = []; //array of markers
let mapLayers; //array of map layers
let restaurants; //array of restaurants markers
let attractions; //array of attractions markers

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
const url = `https://cors-anywhere.herokuapp.com/tomato.ua/Mariupol/category/restaurant`;
const places = [];

makeFetch();

//get places
async function makeFetch() {
  const res = await fetch(
    "https://vladimirgurtovoy.github.io/parse/places.json"
  );
  const data = await res.json();
  data.forEach(d => {
    makeObject(d);
  });
  createMarkers();
  createLayers();
} //end function MakeFetch()

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
  }); //end function createMarkers()

  //add event to markers
  markers.forEach(marker => {
    let index;
    places.forEach((place, ind) => {
      if (place.name == marker.options.title) {
        index = ind;
      }
    });

    //add event by click on marker
    marker.addEventListener("click", e => {
      outerPopUp.classList.add("open");
      mymap.panTo(places[index].markerPosition);
      createPopUpContent(places[index]);
    });
  });
} //<- End function createMarkers()

//create layers
function createLayers() {
  attractions = L.layerGroup([markers[0]]);
  let arr = [];
  markers.forEach((m, index) => {
    if (places[index].type == "restaurants") {
      arr.push(m);
    }
  }); //end function createLayers()

  restaurants = L.layerGroup(arr); //set group marker
  mapLayers = [attractions, restaurants];
  addLayersToMap();
} //end of function createLayers()

//create object with restaurant info
function makeObject(item) {
  let obj = {
    type: item.type,
    name: item.name,
    href: item.href,
    address: item.address,
    markerPosition: item.markerPosition,
    description: item.description,
    images: [],
    markerIcon: new LeafIcon({
      iconUrl: item.markerIcon
    })
  };
  places.push(obj);
} //end function makeObject()

//set popup content
function createPopUpContent(place) {
  innerPopUp.innerHTML = `
      <h2>${place.name}</h2>
      <p>${place.address}</p>
      <p>${place.description}</p>
      
      `;
} //end function createPopUpContent()

//pop-up javascript ↓
const innerPopUp = document.querySelector(".pop-up-inner");
const outerPopUp = document.querySelector(".pop-up-outer");

outerPopUp.addEventListener("click", hidePopUp);

//hide popUp
function hidePopUp(e) {
  if (e.target == e.currentTarget) {
    outerPopUp.classList.remove("open");
  }
}

const mapBtnAll = document.querySelector(".map-btn-all"); //filter button all
const mapBtnRestaurants = document.querySelector(".map-btn-restaurants"); //filter button restaurants
const mapBtnAttractions = document.querySelector(".map-btn-attractions"); //filter button attractions
const mapBtnLayers = [mapBtnAll, mapBtnAttractions, mapBtnRestaurants]; //array of filter buttons

//add event by restaurant Btn click
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

//add event by attraction Btn click
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

//add event by ALL Btn click
mapBtnAll.addEventListener("click", btn => {
  activeLayerBtn(btn.target);
  removeLayersFromMap();
  addLayersToMap();
});

//works with layers
//add layers to map
function addLayersToMap() {
  mapLayers.forEach(layer => {
    mymap.addLayer(layer);
  });
}
//remove layers from map
function removeLayersFromMap() {
  mapLayers.forEach(layer => {
    mymap.removeLayer(layer);
  });
}

//work with layers buttons
//set active btn
function activeLayerBtn(elem) {
  removeActiveClass();
  if (!elem.classList.contains("active")) {
    elem.classList.add("active");
  }
}

//remove active class
function removeActiveClass() {
  mapBtnLayers.forEach(btn => {
    btn.classList.remove("active");
  });
}

let mapBtn = document.querySelector(".map-btns");
let filterBtn = mapBtn.querySelector(".filter-btns");
let hideBtn = mapBtn.querySelector(".hideBtn");
let mapDiv = document.querySelector(".map");

//event on hide btn click
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
