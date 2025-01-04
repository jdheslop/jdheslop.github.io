

// DROPDOWN LANGUAGE MENU
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function dropDown() {
    document.getElementById("langDropdown").classList.toggle("show");
}

// STICKY NAVBAR
// When the user scrolls the page, execute stickyNavbar
window.onscroll = function () {stickyHeader()};

// Get the navbar
let navbar = document.getElementById("stickIt");
let themeBox = document.getElementById("themeBox");

// Get the offset position of the navbar
let sticky = navbar.offsetTop

// Add the sticky class to the navbar when you reach its scroll position. 
// Remove the sticky class when you leave the scroll position.
function stickyHeader() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("stickyHeader");
        themeBox.classList.add("stickyPadding");
    } else {
        navbar.classList.remove("stickyHeader");
        themeBox.classList.remove("stickyPadding");
    }
}





