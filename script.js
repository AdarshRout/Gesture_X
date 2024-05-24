var sections = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('nav ul li a');
var menu = document.querySelector('.navbar-toggle')
var btn = document.querySelector('.navbar-toggle i');
var navbar = document.querySelector('.navbar-group');

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
        navbar.style.display = "block";
    }
    else {
        btn.classList.replace("fa-xmark", "fa-bars");
        navbar.style.display = "none";
    }
}