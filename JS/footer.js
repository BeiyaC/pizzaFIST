// Loading the navbar
function loadNavbar() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.log('Error loading footer:', error));
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar);
