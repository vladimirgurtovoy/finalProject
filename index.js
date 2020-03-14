const welcomeDiv = document.querySelector(".bgc");
const welcomeDivBtn = document.querySelector(".bgc-btn");
welcomeDivBtn.addEventListener("click", hideWelcomeDiv);

function hideWelcomeDiv() {
  welcomeDiv.classList.add("hide");
}
