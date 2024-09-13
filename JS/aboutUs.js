function EasyPeasyParallax() {
    scrollPos = $(this).scrollTop();
    $('#banner').css({
        'background-position': '50% ' + (-scrollPos / 4) + "px"
    });
    $('#bannertext').css({
        'margin-top': (scrollPos / 4) + "px",
        'opacity': 1 - (scrollPos / 250)
    });
}

$(document).ready(function () {
    $(window).scroll(function () {
        EasyPeasyParallax();
    });
});


$(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();
    var contentTop = $('#content').offset().top - window.innerHeight / 1.2;

    if (scrollTop > contentTop) {
        $('#content').addClass('show');
    }
});