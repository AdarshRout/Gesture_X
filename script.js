var navHome = document.querySelector('.nav-home');
var navAbout = document.querySelector('.nav-about');
var navContact = document.querySelector('.nav-contact');
var sections = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('nav ul li a');

function startNow() {
    window.location.href = 'sign-up/signup-page.html'
}

function activeHome() {
    navHome.classList.add("active");
    navAbout.classList.remove("active");
    navContact.classList.remove("active");
}

function activeAbout() {
    navHome.classList.remove("active");
    navAbout.classList.add("active");
    navContact.classList.remove("active");
}

function activeContact() {
    navHome.classList.remove("active");
    navAbout.classList.remove("active");
    navContact.classList.add("active");
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

