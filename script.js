document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.querySelector('.menu-toggle');
    var navigation = document.querySelector('.navigation');

    menuToggle.addEventListener('click', function () {
        navigation.style.display = navigation.style.display === 'block' ? 'none' : 'block';
    });
});
