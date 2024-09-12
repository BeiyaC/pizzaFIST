///// surligne nav bar /////////
window.onload = function() {
    const currentPath = window.location.pathname; // Obtenir l'URL de la page
    if (currentPath.includes('about')) {
      highlightMenu('about-link');
    } else if (currentPath.includes('rooms')) {
      highlightMenu('rooms-link');
    } else if (currentPath.includes('plans')) {
      highlightMenu('plans-link');
    } else if (currentPath.includes('shop')) {
      highlightMenu('shop-link');
    } else if (currentPath.includes('login')) {
      highlightMenu('login-link');
    }
  };

// Loading the navbar
function loadNavbar() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.log('Error loading header:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar);


function highlightMenu(activeLinkId) {
    // Supprimer la classe 'nav-item-active' de tous les éléments de navigation
    let navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.classList.remove('nav-item-active');
    });

    // Ajouter la classe 'nav-item-active' à l'élément cliqué
    let activeItem = document.getElementById(activeLinkId);
    activeItem.classList.add('nav-item-active');
}

var toggleButton = document.querySelector('.toggle-menu');
var navBar = document.querySelector('.nav-bar');
toggleButton.addEventListener('click', function () {
	navBar.classList.toggle('toggle');
});
