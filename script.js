document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio scripts loaded.');

  // ====== Disable dragging on all images ======
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('draggable', 'false');
  });

  // ====== Animated Typing Effect ======
  const typedTextSpan = document.getElementById('typed-text');
  const cursorSpan = document.getElementById('cursor');

  const textArray = [
    "A Software Engineer.",
    "A Problem Solver.",
    "Aspiring Leader",
    "An AI Enthusiast."
  ];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
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

  if (textArray.length) {
    setTimeout(type, newTextDelay + 250);
  }

  // ====== Accordion for Recommendations ======
  const recommendationsAccordionHeaders = document.querySelectorAll(
    '.recommendations-section .accordion-header'
  );

  recommendationsAccordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const contentId = header.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other items
      recommendationsAccordionHeaders.forEach(item => {
        const itemContentId = item.getAttribute('aria-controls');
        const itemContent = document.getElementById(itemContentId);
        item.setAttribute('aria-expanded', 'false');
        if (itemContent) {
          itemContent.style.maxHeight = null;
        }
      });

      // Expand the clicked item if not expanded
      if (!isExpanded && content) {
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;

        // Optional: scroll into view
        setTimeout(() => {
          content.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }, 300);
      }
    });

    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // ====== Projects Carousel ======
  const carousel = document.querySelector('.carousel');
  const carouselCards = document.querySelectorAll('.carousel-card');
  const instruction = document.getElementById('carousel-instruction');

  if (carousel && carouselCards.length > 0) {
    const totalCards = carouselCards.length;
    const angleBetweenCards = 360 / totalCards;
    let rotationAngle = 0;
    let selectedIndex = 0;

    function positionCards() {
      carouselCards.forEach((card, i) => {
        let cardAngle = i * angleBetweenCards + rotationAngle;
        if (window.innerWidth <= 576) {
          card.style.transform = `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(150px)`;
        } else {
          card.style.transform = `rotateY(${cardAngle}deg) translateZ(300px)`;
        }
      });
    }

    function updateSelectedIndex() {
      let minDiff = Infinity;
      let best = 0;
      for (let i = 0; i < totalCards; i++) {
        let cardAngle = (i * angleBetweenCards + rotationAngle) % 360;
        if (cardAngle < 0) cardAngle += 360;
        let diff = Math.min(Math.abs(cardAngle), 360 - Math.abs(cardAngle));
        if (diff < minDiff) {
          minDiff = diff;
          best = i;
        }
      }
      selectedIndex = best;
    }

    function highlightSelectedCard() {
      carouselCards.forEach((card, i) => {
        card.classList.toggle('selected', i === selectedIndex);
      });
    }

    function hideInstruction() {
      if (instruction && !instruction.classList.contains('fade-out')) {
        instruction.style.transition = 'opacity 1s ease';
        instruction.style.opacity = '0';
        setTimeout(() => {
          instruction.style.visibility = 'hidden';
        }, 1000);
      }
    }

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

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        spinForward();
      } else if (e.key === 'ArrowLeft') {
        spinBackward();
      } else if (e.key === 'Enter') {
        const card = carouselCards[selectedIndex];
        if (card) {
          if (card.id === 'project1') {
            openModal();
          } else {
            openComingSoonModal();
          }
        }
      }
    });

    // Drag logic (Desktop)
    let isDraggingCarousel = false;
    let startXCarousel = 0;
    let startYCarousel = 0;
    let dragXCarousel = 0;
    let dragYCarousel = 0;
    const DRAG_THRESHOLD = 50;

    carousel.addEventListener('mousedown', e => {
      e.preventDefault();
      isDraggingCarousel = true;
      startXCarousel = e.clientX;
      startYCarousel = e.clientY;
      dragXCarousel = 0;
      dragYCarousel = 0;
      hideInstruction();
    });

    carousel.addEventListener('mousemove', e => {
      if (!isDraggingCarousel) return;
      dragXCarousel = e.clientX - startXCarousel;
      dragYCarousel = e.clientY - startYCarousel;
    });

    carousel.addEventListener('mouseup', e => {
      if (!isDraggingCarousel) return;
      isDraggingCarousel = false;

      if (
        Math.abs(dragXCarousel) > DRAG_THRESHOLD &&
        Math.abs(dragXCarousel) > Math.abs(dragYCarousel)
      ) {
        if (dragXCarousel < 0) spinForward();
        else spinBackward();
      } else {
        const target = e.target;
        if (target.classList.contains('carousel-card') || target.closest('.carousel-card')) {
          const card = carouselCards[selectedIndex];
          if (card) {
            if (card.id === 'project1') {
              openModal();
            } else {
              openComingSoonModal();
            }
          }
        }
      }
      dragXCarousel = 0;
      dragYCarousel = 0;
    });

    carousel.addEventListener('mouseleave', () => {
      isDraggingCarousel = false;
      dragXCarousel = 0;
      dragYCarousel = 0;
    });

    // Touch logic (Mobile)
    let touchDragging = false;
    let startTouchX = 0;
    let startTouchY = 0;
    let distX = 0;
    let distY = 0;

    carousel.addEventListener(
      'touchstart',
      e => {
        if (e.touches.length > 1) return;
        touchDragging = true;
        startTouchX = e.touches[0].clientX;
        startTouchY = e.touches[0].clientY;
        distX = 0;
        distY = 0;
        hideInstruction();
      },
      { passive: true }
    );

    carousel.addEventListener(
      'touchmove',
      e => {
        if (!touchDragging) return;
        distX = e.touches[0].clientX - startTouchX;
        distY = e.touches[0].clientY - startTouchY;

        // If vertical movement is larger, allow page scrolling
        if (Math.abs(distY) > Math.abs(distX)) {
          return;
        } else {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    carousel.addEventListener(
      'touchend',
      e => {
        if (!touchDragging) return;
        touchDragging = false;

        if (
          Math.abs(distX) > DRAG_THRESHOLD &&
          Math.abs(distX) > Math.abs(distY)
        ) {
          if (distX < 0) spinForward();
          else spinBackward();
        } else {
          const touch = e.changedTouches[0];
          const elem = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elem && (elem.classList.contains('carousel-card') || elem.closest('.carousel-card'))) {
            const card = carouselCards[selectedIndex];
            if (card) {
              if (card.id === 'project1') {
                openModal();
              } else {
                openComingSoonModal();
              }
            }
          }
        }
        distX = 0;
        distY = 0;
      },
      { passive: true }
    );

    carouselCards.forEach(card => {
      card.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          if (card.id === 'project1') {
            openModal();
          } else {
            openComingSoonModal();
          }
        }
      });
    });

    // Initialize
    positionCards();
    updateSelectedIndex();
    highlightSelectedCard();

    window.addEventListener('resize', () => {
      positionCards();
      updateSelectedIndex();
      highlightSelectedCard();
    });
  }

  // ====== Modal Functionality ======
  const modal = document.getElementById('projectModal');
  const openModalButton = document.getElementById('project1');
  const closeButtons = document.querySelectorAll('.close-button');

  function openModal() {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
      modal.querySelector('.modal-content').classList.add('show');
    }, 10);
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 400);
  }

  if (openModalButton) {
    openModalButton.addEventListener('click', openModal);
  }

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  window.addEventListener('click', event => {
    if (event.target == modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });




  // ====== Coming Soon Modal Functionality ======
// ====== Coming Soon Modal Functionality ======
// ====== Coming Soon Modal Functionality ======
const comingSoonModal = document.getElementById('comingSoonModal');

// Open the Coming Soon modal
function openComingSoonModal() {
  comingSoonModal.style.display = 'flex';
  setTimeout(() => {
    comingSoonModal.classList.add('show');
    comingSoonModal.querySelector('.modal-content').classList.add('show');
  }, 10);
}

// Close the Coming Soon modal
function closeComingSoonModal() {
  comingSoonModal.classList.remove('show');
  comingSoonModal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
    comingSoonModal.style.display = 'none';
  }, 400);
}

// Add event listener for clicks anywhere on the modal to close it
comingSoonModal.addEventListener('click', () => {
  closeComingSoonModal();
});

// Prevent immediate closing when clicking inside the modal content
const modalContent = comingSoonModal.querySelector('.modal-content');
modalContent.addEventListener('click', event => {
  event.stopPropagation();
});

// Add event listener for the Escape key to close the modal
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeComingSoonModal();
  }
});



  // ====== Content Loading Animation ======
  const contentSections = document.querySelectorAll('.content-section');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  contentSections.forEach(section => {
    sectionObserver.observe(section);
  });
});
