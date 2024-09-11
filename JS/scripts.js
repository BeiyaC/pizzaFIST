// Loading the navbar
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.log('Error loading navbar:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar);
