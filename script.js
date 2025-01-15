document.addEventListener('DOMContentLoaded', () => {
    // Portfolio Enhancements (Existing Scripts)
    console.log('Portfolio scripts loaded.');

    // Bubble Effect Scripts
    const bubbleSection = document.querySelector('.bubble-section');
    if (bubbleSection) {
        const lensBubble = bubbleSection.querySelector('.lens-bubble');
        const staticBubble = bubbleSection.querySelector('.static-bubble');
        const lensText = bubbleSection.querySelector('.lens-text');
        const originalText = bubbleSection.querySelector('.original-text');

        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        let xOffset = 0;
        let yOffset = 0;

        // Add wobble animation to the lens bubble when not dragging
        function addWobble() {
            setInterval(() => {
                if (!isDragging) {
                    const wobbleX = Math.sin(Date.now() / 1000) * 2;
                    const wobbleY = Math.cos(Date.now() / 1000) * 2;

                    lensBubble.style.transform = `translate(calc(-50% + ${xOffset}px + ${wobbleX}px), calc(-50% + ${yOffset}px + ${wobbleY}px))`;
                }
            }, 50);
        }

        function dragStart(e) {
            e.preventDefault();
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === lensBubble || e.target.parentElement === lensBubble) {
                isDragging = true;
                lensBubble.style.cursor = 'grabbing';
            }
        }

        function dragEnd() {
            isDragging = false;
            lensBubble.style.cursor = 'grab';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                lensBubble.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
                checkOverlap();
            }
        }

        function getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        function checkOverlap() {
            const lensRect = lensBubble.getBoundingClientRect();
            const staticRect = staticBubble.getBoundingClientRect();

            const lensCenter = {
                x: lensRect.left + lensRect.width / 2,
                y: lensRect.top + lensRect.height / 2
            };

            const staticCenter = {
                x: staticRect.left + staticRect.width / 2,
                y: staticRect.top + staticRect.height / 2
            };

            const distance = getDistance(lensCenter.x, lensCenter.y, staticCenter.x, staticCenter.y);
            const maxDistance = (lensRect.width + staticRect.width) / 2;

            if (distance <= maxDistance) { // Include edge touching
                // Calculate the overlapping area relative to the static bubble
                const overlapX = lensCenter.x - staticRect.left;
                const overlapY = lensCenter.y - staticRect.top;

                const radius = lensRect.width / 2;

                // Set clip-path for lens-text to show "Magic!" only in the overlapped area
                lensText.style.clipPath = `circle(${radius}px at ${overlapX}px ${overlapY}px)`;
                lensText.style.opacity = '1';

                // Create a path for original-text to exclude the overlapped area
                const path = `M0,0 H${staticRect.width} V${staticRect.height} H0 Z M${overlapX},${overlapY} m-${radius},0 a${radius},${radius} 0 1,0 ${2 * radius},0 a${radius},${radius} 0 1,0 -${2 * radius},0`;

                originalText.style.clipPath = `path("${path}")`;
                originalText.style.clipRule = 'evenodd';
            } else {
                // Reset when not overlapping
                lensText.style.opacity = '0';
                lensText.style.clipPath = 'none';
                originalText.style.clipRule = 'initial';
                originalText.style.clipPath = 'none';
            }
        }

        // Event listeners for mouse and touch interactions
        lensBubble.addEventListener('mousedown', dragStart);
        lensBubble.addEventListener('touchstart', dragStart, { passive: false });

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });

        // Initialize wobble animation
        addWobble();

        // Trigger overlap check on page load
        checkOverlap();
    }

    // ====== Animated Typing Effect Scripts ======
    const typedTextSpan = document.getElementById('typed-text');
    const cursorSpan = document.getElementById('cursor');

    const textArray = [
        "A Software Engineer.",
        "A Full-Stack Developer.",
        "An Open Source Contributor.",
        "A Tech Enthusiast."
    ];
    const typingDelay = 100; // Delay between each character (in ms)
    const erasingDelay = 50; // Delay between each character when erasing (in ms)
    const newTextDelay = 2000; // Delay between current and next text (in ms)
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is on a mobile device
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile) {
        // Reset the viewport to default scale
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }

        // Reset the scroll position to the top-left corner
        window.scrollTo(0, 0);

        // Force a slight delay to ensure zoom level stabilizes
        setTimeout(() => {
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
            window.scrollTo(0, 0); // Ensure scroll position is corrected again
        }, 50); // 50ms delay to account for browser quirks
    }
});

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start the typing effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // ====== Accordion Functionality for Recommendations Section ======
    const recommendationsAccordionHeaders = document.querySelectorAll('.recommendations-section .accordion-header');

    recommendationsAccordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const contentId = header.getAttribute('aria-controls'); // Get associated content ID
            const content = document.getElementById(contentId); // Select the associated content
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close all accordion items
            recommendationsAccordionHeaders.forEach(item => {
                const itemContentId = item.getAttribute('aria-controls');
                const itemContent = document.getElementById(itemContentId);
                item.setAttribute('aria-expanded', 'false');
                if (itemContent) {
                    itemContent.style.maxHeight = null; // Collapse the content
                }
            });

            // Expand the clicked item if it was not already expanded
            if (!isExpanded && content) {
                header.setAttribute('aria-expanded', 'true');

                // Dynamically set max height for smooth expansion
                content.style.maxHeight = `${content.scrollHeight}px`;

                // Scroll to ensure the expanded section is fully visible
                // Added a slight delay to ensure maxHeight is applied before scrolling
                setTimeout(() => {
                    content.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start', // Align the top of the content to the top of the viewport
                        inline: 'nearest'
                    });
                }, 300);
            }
        });

        // Keyboard accessibility: Enter and Space keys to toggle accordion
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    /* ====== Projects Carousel Scripts ====== */

    // 1. Carousel Functionality
    const carousel = document.querySelector('.carousel');
    const carouselCards = document.querySelectorAll('.carousel-card');
    const instruction = document.getElementById('carousel-instruction');

    // If no carousel or no cards, do nothing
    if (carousel && carouselCards.length > 0) {
        const totalCards = carouselCards.length;
        const angleBetweenCards = 360 / totalCards;

        // Start with no offset rotation
        let rotationAngle = 0;
        let selectedIndex = 0;

        // Position the cards based on rotationAngle
        function positionCards() {
            carouselCards.forEach((card, i) => {
                let cardAngle = i * angleBetweenCards + rotationAngle;

                // On small devices => smaller circle
                if (window.innerWidth <= 576) {
                    card.style.transform = `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(150px)`;
                } else {
                    card.style.transform = `rotateY(${cardAngle}deg) translateZ(300px)`;
                }
            });
        }

        // Determine which card is front (best angle) => highlight
        function updateSelectedIndex() {
            let minDiff = Infinity;
            let best = 0;

            for (let i = 0; i < totalCards; i++) {
                let cardAngle = (i * angleBetweenCards + rotationAngle) % 360;
                if (cardAngle < 0) cardAngle += 360;
                // diff from 0 => front facing
                let diff = Math.min(Math.abs(cardAngle), 360 - Math.abs(cardAngle));
                if (diff < minDiff) {
                    minDiff = diff;
                    best = i;
                }
            }
            selectedIndex = best;
        }

        // Mark the selected card visually
        function highlightSelectedCard() {
            carouselCards.forEach((card, i) => {
                card.classList.toggle('selected', i === selectedIndex);
            });
        }

        // Hide instructions once user interacts
        function hideInstruction() {
            if (instruction && !instruction.classList.contains('fade-out')) {
                instruction.style.transition = 'opacity 1s ease'; // Add fading transition
                instruction.style.opacity = '0'; // Set opacity to 0 for fading effect
                setTimeout(() => {
                    instruction.style.visibility = 'hidden'; // Hide element after fading
                }, 1000); // Matches the transition duration
            }
        }

        // Initial setup
        positionCards();
        updateSelectedIndex();
        highlightSelectedCard();

        // Utility to spin forward/back
        function spinForward() {
            rotationAngle -= angleBetweenCards;
            positionCards();
            updateSelectedIndex();
            highlightSelectedCard();
            hideInstruction();
        }
        function spinBackward() {
            rotationAngle += angleBetweenCards;
            positionCards();
            updateSelectedIndex();
            highlightSelectedCard();
            hideInstruction();
        }

        // KEYBOARD
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                spinForward();
            } else if (e.key === 'ArrowLeft') {
                spinBackward();
            } else if (e.key === 'Enter') {
                const card = carouselCards[selectedIndex];
                if (card) {
                    alert(`Opening details for: ${card.querySelector('h3')?.textContent || 'Project'}`);
                }
            }
        });

        // Drag logic for PC from anywhere on the carousel
        let isDraggingCarousel = false;
        let startXCarousel = 0;
        let startYCarousel = 0;
        let dragXCarousel = 0;
        let dragYCarousel = 0;
        const DRAG_THRESHOLD = 25; // small => easier to spin vs. click

        // Attach MOUSE events to entire .carousel so user can drag from anywhere
        carousel.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingCarousel = true;
            startXCarousel = e.clientX;
            startYCarousel = e.clientY;
            dragXCarousel = 0;
            dragYCarousel = 0;
            hideInstruction();
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDraggingCarousel) return;
            dragXCarousel = e.clientX - startXCarousel;
            dragYCarousel = e.clientY - startYCarousel;
        });

        carousel.addEventListener('mouseup', (e) => {
            if (!isDraggingCarousel) return;
            isDraggingCarousel = false;

            // Distinguish spin vs. click
            if (
                Math.abs(dragXCarousel) > DRAG_THRESHOLD &&
                Math.abs(dragXCarousel) > Math.abs(dragYCarousel)
            ) {
                if (dragXCarousel < 0) spinForward();
                else spinBackward();
            } else {
                // It's a click => see if user clicked on a card
                const target = e.target;
                if (target.classList.contains('carousel-card') ||
                    target.closest('.carousel-card')) {
                    const card = carouselCards[selectedIndex];
                    if (card) {
                        alert(`Opening details for: ${card.querySelector('h3')?.textContent || 'Project'}`);
                    }
                }
            }
        });

        // If mouse leaves => no drag
        carousel.addEventListener('mouseleave', () => {
            isDraggingCarousel = false;
        });

        // Touch logic (mobile)
        let touchDragging = false;
        let startTouchX = 0;
        let startTouchY = 0;
        let distX = 0;
        let distY = 0;

        carousel.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return; // ignore multi-touch
            touchDragging = true;
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            distX = 0;
            distY = 0;
            hideInstruction();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!touchDragging) return;
            distX = e.touches[0].clientX - startTouchX;
            distY = e.touches[0].clientY - startTouchY;

            if (Math.abs(distY) > Math.abs(distX)) {
                // vertical => let page scroll
                return;
            } else {
                e.preventDefault(); // horizontal => spin
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (!touchDragging) return;
            touchDragging = false;

            if (
                Math.abs(distX) > DRAG_THRESHOLD &&
                Math.abs(distX) > Math.abs(distY)
            ) {
                if (distX < 0) spinForward();
                else spinBackward();
            } else {
                // treat as click
                const touch = e.changedTouches[0];
                const elem = document.elementFromPoint(touch.clientX, touch.clientY);
                if (elem && (
                    elem.classList.contains('carousel-card') ||
                    elem.closest('.carousel-card')
                )) {
                    const card = carouselCards[selectedIndex];
                    if (card) {
                        alert(`Opening details for: ${card.querySelector('h3')?.textContent || 'Project'}`);
                    }
                }
            }
        }, { passive: true });

        // ACCESSIBILITY: press Enter on a card
        carouselCards.forEach((card) => {
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    alert(`Opening details for: ${card.querySelector('h3')?.textContent || 'Project'}`);
                }
            });
        });

        // Reposition on orientation/resize => immediate effect
        window.addEventListener('resize', () => {
            positionCards();
            updateSelectedIndex();
            highlightSelectedCard();
        });
    }
});
