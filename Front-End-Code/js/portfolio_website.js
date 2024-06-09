document.addEventListener('mousemove', function(e) {
    var gradientBar = document.querySelector('.static_gradient-bar');
    var width = window.innerWidth;
    var mouseX = e.clientX;
    var percentage = mouseX / width * 100;
    gradientBar.style.background = 'linear-gradient(to right, black 0%, black ' + (percentage - 20) + '%, #202a2d ' + percentage + '%, black ' + (percentage + 20) + '%, black 100%)';
});
