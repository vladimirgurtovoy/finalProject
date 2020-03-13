let slider = document.querySelector(".slider");
let rightBtn = slider.querySelector(".slider-right");
let leftBtn = slider.querySelector(".slider-left");
let img = slider.querySelectorAll(".slider-img");
let sliderImgCount = 0;
hidePhotos();
hideButtons();
rightBtn.addEventListener("click", e => {
  sliderImgCount++;
  hideButtons();
  hidePhotos();
});

leftBtn.addEventListener("click", e => {
  sliderImgCount--;
  hideButtons();
  hidePhotos();
});

function hidePhotos() {
  img.forEach(i => {
    i.classList.add("hide");
    if (i.classList.contains("slider-img-" + sliderImgCount)) {
      i.classList.remove("hide");
    }
  });
}

function hideButtons() {
  if (sliderImgCount == 0) {
    leftBtn.classList.add("hide");
  }
  if (sliderImgCount > 0) {
    leftBtn.classList.remove("hide");
    rightBtn.classList.remove("hide");
  }
  if (sliderImgCount == img.length - 1) {
    rightBtn.classList.add("hide");
  }
}
