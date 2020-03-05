const welcomeDiv = document.querySelector(".bgc");
const welcomeDivBtn = document.querySelector(".bgc-btn");
welcomeDivBtn.addEventListener("click", e => {
  welcomeDiv.classList.add("hide");
});
