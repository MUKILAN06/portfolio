document.addEventListener("DOMContentLoaded", function () {

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when a link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-up").forEach((el) => {
        observer.observe(el);
    });

    // Active Navigation Link Highlighting via IntersectionObserver
    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll(".navbar-nav .nav-item .nav-link");

    const sectionObserverOptions = {
        root: null,
        threshold: 0.25, // Trigger when 25% of the section is visible
        rootMargin: "-100px 0px -50px 0px" // Offset for navbar height
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                let current = entry.target.getAttribute("id");

                // Special case for "Home" if near top
                if (window.scrollY < 100) {
                    current = "home";
                }

                navLi.forEach((li) => {
                    li.classList.remove("active");
                    if (li.getAttribute("href").includes(current)) {
                        li.classList.add("active");
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    // Refined Typing Effect
    const typingText = document.querySelector('#typing-text');
    if (typingText) {
        const words = [
            "Software Engineer",
            "Full Stack Architect",
            "Machine Learning Enthusiast",
            "Systems Innovator"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex--);
            } else {
                typingText.textContent = currentWord.substring(0, charIndex++);
            }

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
            } else {
                setTimeout(typeEffect, isDeleting ? 40 : 100);
            }
        }
        typeEffect();
    }

    // Professional Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ms-2"></i>';
            formStatus.style.display = 'block';
            formStatus.className = 'mt-4 text-center text-info';
            formStatus.textContent = 'Processing your inquiry...';

            const formData = new FormData(contactForm);
            const params = new URLSearchParams();
            for (const pair of formData) {
                params.append(pair[0], pair[1]);
            }

            // Your Google Apps Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyfz96agr796vqSQPdnBEVXRZY5n-LcnhOn22kILg_c5sy13DBVFeq5YXM5IUTtwiVs/exec';

            fetch(scriptURL, {
                method: 'POST',
                body: params,
                mode: 'no-cors'
            })
                .then(() => {
                    formStatus.className = 'mt-4 text-center text-success uppercase-first';
                    formStatus.textContent = 'Thank you. Your message has been received successfully.';
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    formStatus.className = 'mt-4 text-center text-success';
                    formStatus.textContent = 'Thank you. Your message has been received successfully.';
                    contactForm.reset();
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Inquiry <i class="fas fa-paper-plane ms-2"></i>';
                });
        });
    }
});
