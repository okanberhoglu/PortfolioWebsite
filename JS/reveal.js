function reveal() {
    var reveals = document.querySelectorAll(".reveal");

for (let i = 0; i < reveals.length; i++) {
  var windowHeight = window.innerHeight;
  var elementTop = reveals[i].getBoundingClientRect().top;
  var elementVisible = 150;
  if($(window).width > 800) {
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("revealActive");
    } else {
      reveals[i].classList.remove("revealActive");
    }
  }else{
    reveals[i].classList.add("revealActive");
  }
}
}

window.addEventListener("scroll",reveal);
