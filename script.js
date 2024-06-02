var sections = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('nav ul li a');
var menu = document.querySelector('.navbar-toggle')
var btn = document.querySelector('.navbar-toggle i');
var navbar = document.querySelector('.navbar-group');

// SPLASH SCREEN

let intro = document.querySelector('.intro');
let logo = document.querySelector('.intro-header');
let logoSpan = document.querySelectorAll('.intro-logo');

window.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        
        logoSpan.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add('active1');
            }, (idx + 1) * 400)
        });

        setTimeout(() => {

            logoSpan.forEach((span, idx) => {

                setTimeout(() => {
                    span.classList.remove('active1');
                    span.classList.add('fade');
                }, (idx + 1) * 50)
            })
        }, 2000);

        setTimeout(() => {
            intro.style.top = '-100vh';
        }, 2500);
    });
});




function startNow() {
    window.location.href = 'sign-up/signup-page.html'
}

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('nav ul li a[href*=' + id + ']').classList.add('active');
            })
        }
    })
}

function menuBtn() {
    if(btn.classList.contains("fa-bars")) {
        btn.classList.replace("fa-bars", "fa-xmark");
        navbar.style.right = "0px";
    }
    else {
        btn.classList.replace("fa-xmark", "fa-bars");
        navbar.style.right = "-1000px";
    }
}