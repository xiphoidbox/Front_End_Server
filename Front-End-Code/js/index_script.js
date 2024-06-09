var allowDisableScroll = false;

function scrollToTop() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    scrollToTop();
});

let myMap;
var moveInterval = null;
var revealMapTimeout;

function initMap() {
    const position = { lat: 29.4241, lng: -98.4936 };

    myMap = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    const marker = new google.maps.Marker({
        position: position,
        map: myMap,
        title: "San Antonio, Texas",
    });
}

function startMovingContent() {
    var content = document.querySelector('.svg-container');
    var screenWidth = window.innerWidth;
    var moveDistance = 0;
    var maxDistance = screenWidth <= 540 ? 200 : 1000;
    var speed = 5;
    var intervalTime = 1;

    if (moveInterval) {
        clearInterval(moveInterval);
    }

    moveInterval = setInterval(function() {
        moveDistance += speed;
        if (moveDistance >= maxDistance) {
            clearInterval(moveInterval);
        }
        content.style.transform = 'translate(50%, -50%)';
    }, intervalTime);
}

function resetContentPosition() {
    var content = document.querySelector('.svg-container');
    content.style.transform = 'translate(-50%, -50%)';
}

function disableScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

function enableScroll() {
    window.onscroll = null;
}

function scrollHandler() {
    var svgElement = document.querySelector('svg');
    var mapCover = document.getElementById('map-cover');
    let swiperNav1 = document.querySelector('.swiper-nav-container.swiper1');
    let swiperNav2 = document.querySelector('.swiper-nav-container.swiper2');
    var aboutMeCover = document.querySelector('.about-me-cover');
    var aboutMeContainer = document.querySelector('.about-me-container');
    var mapContainer = document.querySelector('.map-container');
if (window.scrollY > 0) {
    if (!document.body.classList.contains('scrolled')) {
        document.body.classList.add('scrolled');
        startMovingContent();

        disableScroll();
        setTimeout(enableScroll, 2000);
        svgElement.style.opacity = 0;
        svgElement.style.transition = 'opacity 1.0s cubic-bezier(0.4, 0, 0.4, 1)';

        clearTimeout(revealMapTimeout);
        revealMapTimeout = setTimeout(() => {
            mapCover.style.transform = 'translateX(100%)';
            aboutMeCover.style.transform = 'translateX(-100%)';
        }, 1500);
    }
} else {
    document.body.classList.remove('scrolled');
    resetContentPosition();

    svgElement.style.opacity = 1;
    svgElement.style.transition = 'opacity 1.0s cubic-bezier(1, 0, 1, 1)';

    clearTimeout(revealMapTimeout);
    mapCover.style.transition = 'transform 0.5s ease';
    mapCover.style.transform = 'translateX(0)';
    aboutMeCover.style.transition = 'transform 0.5s ease';
    aboutMeCover.style.transform = 'translateX(0)';
    if (swiperNav1 && swiperNav2) {
        swiperNav1.style.opacity = 0;
        swiperNav1.style.transform = 'translateX(40vw)';
        swiperNav2.style.opacity = 0;
        swiperNav2.style.transform = 'translateX(-40vw)';
    }
}
            if (window.scrollY >= 600) {
        if (swiperNav1 && swiperNav2) {
            swiperNav1.style.opacity = 1;
            swiperNav1.style.transform = 'translateX(0)';
            swiperNav2.style.opacity = 1;
            swiperNav2.style.transform = 'translateX(0)';
        }
    }
}

document.addEventListener('mousemove', function(e) {
    var gradientBar = document.querySelector('.gradient-bar');
    var width = window.innerWidth;
    var mouseX = e.clientX;
    var percentage = mouseX / width * 100;

    gradientBar.style.background = 'linear-gradient(to right, black 0%, black ' + (percentage - 20) + '%, #202a2d ' + percentage + '%, black ' + (percentage + 20) + '%, black 100%)';
});

window.addEventListener('scroll', scrollHandler);
window.initMap = initMap;

function loadGoogleMapsAPI() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/load-google-maps'; 
    document.head.appendChild(script);
}

setTimeout(loadGoogleMapsAPI, 1000);

document.addEventListener("DOMContentLoaded", function() {
    var swiper2 = new Swiper(".mySwiper2", {
        width: 800,
        slidesPerView: 3,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next-2",
            prevEl: ".swiper-button-prev-2",
        },
        autoplay: {
            delay: 8000,
            reverseDirection: true,
        },
    });

    var initialAutoplayDelay = 4000;

    setTimeout(function() {
        var swiper1 = new Swiper(".mySwiper1", {
            width: 800,
            slidesPerView: 3,
            spaceBetween: 0,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next-1",
                prevEl: ".swiper-button-prev-1",
            },
            autoplay: {
                delay: 8000,
            },
        });
    }, initialAutoplayDelay);
});

