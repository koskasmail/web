///----[css selector & queryselector method]------------
const navbarElement = document.querySelector(".navbar");

const buttomContainerElement = document.querySelector(".button-container");
/// console.log(navbarElement);
console.log("buttomContainerElement position:: " + buttomContainerElement.offsetTop);
console.log("navbarElement:: " + navbarElement.offsetHeight);

///----[event listener for catch the scrolling event and then trigger a function]------------
window.addEventListener("scroll", () => {
    if (window.scrollY > buttomContainerElement.offsetTop - navbarElement.offsetHeight - 60) {
        navbarElement.classList.add("active");
    }
    else {
        navbarElement.classList.remove("active");
    }
    ///eventOutput();
});


function eventOutput() {
    console.log("window.scrollY:: " + window.scrollY);
    console.log("buttomContainerElement::"); 
    console.log(buttomContainerElement);
}

