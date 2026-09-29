window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

function startSeasonalFall() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const main = document.querySelector('main');
    if (!main) return;
    const layer = document.createElement('div');
    layer.className = 'seasonal-fall';
    layer.setAttribute('aria-hidden', 'true');
    main.prepend(layer);

    const motifs = ['static/images/sakura.svg', 'static/images/momiji.svg'];
    const dropMotif = () => {
        if (document.visibilityState !== 'visible' || layer.childElementCount >= 24) return;

        const content = document.querySelector('main .container.is-max-desktop');
        if (!content) return;
        const contentBounds = content.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const leftGutter = Math.max(0, contentBounds.left);
        const rightGutter = Math.max(0, viewportWidth - contentBounds.right);
        const maxGutter = Math.max(leftGutter, rightGutter);
        const maxSize = Math.min(44, maxGutter - 52);
        if (maxSize < 28) return;

        const isMomiji = Math.random() < 0.35;
        const size = 28 + Math.random() * (Math.min(34, maxSize) - 28);
        const availableSides = [];
        if (leftGutter >= size + 52) availableSides.push('left');
        if (rightGutter >= size + 52) availableSides.push('right');
        if (!availableSides.length) return;

        const side = availableSides[Math.floor(Math.random() * availableSides.length)];
        const x = side === 'left'
            ? 6 + Math.random() * (leftGutter - size - 52)
            : contentBounds.right + 46 + Math.random() * (rightGutter - size - 52);

        const petal = document.createElement('span');
        const motif = document.createElement('img');
        const duration = 8 + Math.random() * 5;
        petal.className = 'seasonal-petal';
        motif.src = motifs[isMomiji ? 1 : 0];
        motif.alt = '';
        motif.draggable = false;
        const mainTop = main.getBoundingClientRect().top + window.scrollY;
        petal.style.setProperty('--fall-top', `${window.scrollY - mainTop - window.innerHeight * 0.1}px`);
        petal.style.setProperty('--fall-x', `${x}px`);
        petal.style.setProperty('--fall-size', `${size}px`);
        petal.style.setProperty('--fall-duration', `${duration}s`);
        petal.style.setProperty('--fall-drift', `${Math.random() * 16 - 8}px`);
        petal.style.setProperty('--fall-spin', `${Math.random() * 540 - 270}deg`);
        petal.style.setProperty('--flutter-duration', `${0.9 + Math.random() * 1.1}s`);
        petal.addEventListener('animationend', () => petal.remove(), { once: true });
        petal.appendChild(motif);
        layer.appendChild(petal);
    };

    window.setTimeout(dropMotif, 900);
    window.setInterval(dropMotif, 700);
}

startSeasonalFall();
