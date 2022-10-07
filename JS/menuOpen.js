const navbar = document.getElementsByClassName("navbar");
const menu = document.getElementsByClassName("menu");

function menuOpen() {
  if (navbar[0].classList[1] == "active") {
    navbar[0].classList.remove("active");
    menu[0].classList.remove("activeMenu");
  } else {
    navbar[0].classList.add("active");
    menu[0].classList.add("activeMenu");
  }
}
