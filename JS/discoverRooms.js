document.addEventListener('DOMContentLoaded', function () {
    const shopButtons = document.querySelectorAll('.shop-button');

    shopButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.location.href = './shop.html';
        });
    });
});