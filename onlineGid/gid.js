var map = L.map("map").setView([47.087633, 37.544744], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let listTourDiv = document.querySelector(".list-tour-inner");
let userLocation;
const tourOuter = document.querySelector(".list-tour-outer");

//Список экскурсий
let tourList = [
  {
    name: "Экскурсия 1",
    desc: "Немного текста, который описывает суть экскурсии",
    //точки экскурсии
    points: [
      [47.09488, 37.55309, "Izba", 50],
      [47.094564, 37.554344, "Pobeda", 30]
    ]
  },
  {
    name: "Экскурсия 2",
    desc: "Немного текста, который описывает суть экскурсии",
    points: [
      ["lat", "lng", "text of tour point", "distance"],
      ["lat", "lng", "text of tour point", "distance"],
      ["lat", "lng", "text of tour point", "distance"]
    ]
  }
];

generateListTour();

function generateListTour() {
  tourList.forEach((item, index) => {
    listTourDiv.insertAdjacentHTML(
      "beforeend",
      `<div class="tour" data-id="${index}">
    <div class="col-8 tour-desc">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
    </div>
    <div class="col-4 tour-img">
      <img
        src="https://www.marmaristravel.ru/wp-content/uploads/2018/08/ephesus-08.jpg"
        alt=""
      />
    </div>
  </div>
  `
    );
  });
}
console.log(tourList[0].points[0][0], tourList[0].points[0][1]);
let generatedTour = tourOuter.querySelectorAll(".tour");
generatedTour.forEach(tour => {
  tour.addEventListener("click", function() {
    tourOuter.classList.add("hide");
    let indexOfTour = tour.getAttribute("data-id");
    // let polygon = L.polygon(
    //   [tourList[0].points[0][0], tourList[0].points[0][1]],
    //   [tourList[0].points[1][0], tourList[0].points[1][1]],
    //   { color: "red" }
    // ).addTo(map);
  });
});

//location code ↓
setInterval(1000, map.locate());

L.Routing.control({
  waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
  routeWhileDragging: true
}).addTo(map);

function onLocationFound(e) {
  userLocation = e.latlng;
  console.log(e.latlng.lat);
  L.marker(e.latlng).addTo(map);
}

map.on("locationfound", onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on("locationerror", onLocationError);

//Пробное построение маршрута
L.Routing.control({
  waypoints: [
    L.latLng(tourList[1][0], tourList[1][1]),
    L.latLng(tourList[0][0], tourList[0][1])
  ]
}).addTo(map);
