const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const fetch = require("node-fetch");
const axios = require("axios");

url = `https://tomato.ua/Mariupol/category/restaurant`; //url for parse

const places = [];
let countPlaces = 0;

//parse short information about places
const parse = async () => {
  const response = await request(url);
  let $ = cheerio.load(response, {
    xml: {
      normalizeWhitespace: true
    }
  });
  const companyCard = $(".search_item");
  companyCard.each((id, card) => {
    let domCard = $(card); //card of restaurants
    let title = domCard.find(".title").text();
    makeObject(domCard, title);
  });
  makeFetchLocation();
}; //end function parse()

parse(); //call func

//create object structure of place
function makeObject(domCard, title) {
  let obj = {
    type: "restaurants",
    name: title,
    href: domCard.find(".search_item_img").attr("href"),
    address: domCard.find(".address").text(),
    markerPosition: "",
    description: "",
    images: [],
    markerIcon: domCard
      .find(".search_item_img")
      .css("background-image")
      .replace(/.*\s?url\([\'\"]?/, "")
      .replace(/[\'\"]?\).*/, "")
  };
  places.push(obj);
} //end function makeObject()

//get location of restaurant on the map by google Geocoding API
async function makeFetchLocation() {
  let coords = [];
  for (place of places) {
    await fetch(
      encodeURI(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${"мариуполь " +
          place.name}&key=AIzaSyAfaEcMF7iaeuaK0VT8POocFReZ7IJ-LdQ`
      )
    )
      .then(res => res.json())
      .then(data => {
        let coord = data.results[0].geometry.location;
        place.markerPosition = [coord.lat, coord.lng];
        parseInfo(place);
      })
      .catch(err => {
        console.log(err);
      });
  }
} //end function makeFetchLocation()

//get info about place
async function parseInfo(place) {
  const response = await request(place.href);
  const $ = cheerio.load(response, {
    xml: {
      normalizeWhitespace: true
    }
  });
  const info = $(".panel");
  if (info.find(".all").text().length == 0) {
    place.description = info.find(".text_content").text();
  } else {
    place.description = info.find(".all").text();
  }
  parseImages(place.href + "/photos", place);
} //end of function parseInfo()

//parse images for restaurant description (popUp)
async function parseImages(imgUrl, place) {
  await axios
    .get(imgUrl)
    .then(res => {
      const imagesData = res.data.data.data;
      imagesData.forEach(img => {
        place.images.push(img.api_500.toString());
      });
    })
    .catch(err => console.log(err));
  countPlaces++;
  if (countPlaces == places.length) {
    storeData(places, "./data/places.json");
  }
} //end of function parseImages()

//write data to file
const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};
