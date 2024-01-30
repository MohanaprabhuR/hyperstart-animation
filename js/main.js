$(document).ready(function () {
  // Page scroll add class name
  $(window).scroll(function () {
    var scroll = $(window).scrollTop()
    if (scroll >= 100) {
      $('.site-header').addClass('header-overlay')
    } else {
      $('.site-header').removeClass('header-overlay')
    }
  })

  function faqDropdown() {
    var accordionParentClass = '.faq-list-wrapper';
    var accordionQuestionClass = '.faq-list-wrapper';
    var accordionContentClass = '.accordion-content';
  
    $(accordionParentClass).each(function () {
      $(this).addClass('close');
      $(this).find(accordionContentClass).hide();
    });
  
    function openFirstAccordion() {
      var firstAccordion = $(accordionQuestionClass).first();
      var faqClass = firstAccordion.closest(accordionParentClass).attr('class');
  
      if (faqClass.indexOf('close') != -1) {
        $(accordionParentClass).find(accordionContentClass).slideUp('slow'); 
        $(accordionParentClass).addClass('close').removeClass('open'); 
  
        firstAccordion.closest(accordionParentClass).removeClass('close');
        firstAccordion.closest(accordionParentClass).addClass('open');
        firstAccordion.closest(accordionParentClass).find(accordionContentClass).slideDown('slow');
      }
    }
  
    setTimeout(openFirstAccordion, 1000); 
  
    $(accordionQuestionClass).click(function () {
      var faqClass = $(this).closest(accordionParentClass).attr('class');
  
      if (faqClass.indexOf('close') != -1) {
        $(accordionParentClass).find(accordionContentClass).slideUp('slow'); 
        $(accordionParentClass).addClass('close').removeClass('open'); 
  
        $(this).closest(accordionParentClass).removeClass('close');
        $(this).closest(accordionParentClass).addClass('open');
        $(this).closest(accordionParentClass).find(accordionContentClass).slideDown('slow');
      } else {
        $(this).closest(accordionParentClass).addClass('close');
        $(this).closest(accordionParentClass).removeClass('open');
        $(this).closest(accordionParentClass).find(accordionContentClass).slideUp('slow');
      }
    });
  }
  
  faqDropdown();
  

  // toggleFooter
  function toggleFooter () {
    $('.footer-list-item h5').on('click', function () {
      $('.footer-text').removeClass('open-list')
      $('.footer-list-item h5').removeClass('rotate')
      $(this).closest('.footer-list-item').find('.footer-text').toggleClass('open-list')
      $(this).closest('.footer-list-item').find('h5').toggleClass('rotate')
    })
  } toggleFooter();




  function logoAnimation(){

  
    // const logos = document.querySelectorAll('.logo-animation');

    //   function displayWithDelay(index) {
    //     setTimeout(function () {
    //       logos[index].style.opacity = '1';
    //       logos[index].style.transform = 'scale(1)';
    //     }, index * 1000);
    //   }

    //   for (let i = 0; i < logos.length; i++) {
    //     displayWithDelay(i);
    //   }

    const logos = document.querySelectorAll('.logo-animation');
    const triggerSection = document.getElementById('seamlessIntegration');

    function displayWithDelay(index) {
      setTimeout(function () {
        logos[index].style.opacity = '1';
        logos[index].style.transform = 'scale(1)';
      }, index * 500);
    }

    function checkScroll() {
      const triggerSectionTop = triggerSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (triggerSectionTop < windowHeight / 1.5) {
        // Section is in view, trigger the animation
        logos.forEach((logo, index) => {
          displayWithDelay(index);
        });
      }
    }

    document.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load

    }logoAnimation();
});

function thumbCarousal () {
  const mainCarouselWrap = document.getElementById('main-carousel')
  const mainCarouselView = mainCarouselWrap.querySelector('.embla__viewport')
  const dotContainer = document.querySelector('.dot-container') // Add dot container in your HTML
  let delay = 4000;

  const mainCarousel = EmblaCarousel(
    mainCarouselView,
    {
      selectedClass: '',
      loop: true,
      skipSnaps: false,
      startIndex: 0,
      align: 'start'
    },
    [
      EmblaCarouselAutoplay(
        {
          playOnInit: true,
          delay: delay,
          stopOnInteraction: false,
          stopOnMouseEnter:true
        },
        (emblaRoot) => emblaRoot.parentElement
      )
    ]
  )

  const thumbCarouselWrap = document.getElementById('thumb-carousel')
  const thumbCarouselView = thumbCarouselWrap.querySelector('.embla__viewport')
  const thumbCarousel = EmblaCarousel(
    thumbCarouselView,
    {
      selectedClass: '',
      containScroll: 'keepSnaps',
      dragFree: true,
      startIndex: 0,
      align: 'start',
      slidesInView: window.innerWidth < 768 ? 1 : 3
    },
    [
      EmblaCarouselAutoplay(
        {
          playOnInit: true,
          delay: delay,
          stopOnInteraction: false,
          stopOnMouseEnter:true
        },
        (emblaRoot) => emblaRoot.parentElement
      )
    ]
  )

  const onThumbClick = (mainCarousel, thumbCarousel, index) => () => {
    mainCarousel.scrollTo(index)
  }

  const followMainCarousel = (mainCarousel, thumbCarousel) => () => {
    const currentSlideIndex = mainCarousel.selectedScrollSnap()
    thumbCarousel.scrollTo(currentSlideIndex)
    selectThumbBtn(mainCarousel, thumbCarousel)
  }

  const selectThumbBtn = (mainCarousel, thumbCarousel) => {
    const selected = mainCarousel.selectedScrollSnap()

    for (let i = 0; i < thumbCarousel.slideNodes().length; i++) {
      const slideNode = thumbCarousel.slideNodes()[i]
      if (i === selected) {
        slideNode.classList.add('is-selected')
      } else {
        slideNode.classList.remove('is-selected')
      }
    }
  }

  thumbCarousel.slideNodes().forEach((thumbNode, index) => {
    const onClick = onThumbClick(mainCarousel, thumbCarousel, index)
    thumbNode.addEventListener('click', onClick, false)
  })

  const syncThumbCarousel = followMainCarousel(mainCarousel, thumbCarousel)
  mainCarousel.on('select', syncThumbCarousel)
  thumbCarousel.on('init', syncThumbCarousel)

  // Embla Carousel Dots
  const dots = Array.from(mainCarousel.scrollSnapList()).map(() => document.createElement('button'))
  dots.forEach((dot, index) => {
    dot.classList.add('dot')
    dot.addEventListener('click', () => mainCarousel.scrollTo(index), false)
    dotContainer.appendChild(dot)
  })

  const updateDots = () => {
    const selectedDot = dotContainer.querySelector('.is-selected')
    if (selectedDot) {
      selectedDot.classList.remove('is-selected')
    }
    dots[mainCarousel.selectedScrollSnap()].classList.add('is-selected')
  }

  mainCarousel.on('select', updateDots)
  updateDots()

  const prev = () => {
    mainCarousel.scrollPrev()
    syncThumbCarousel()
  }

  const next = () => {
    mainCarousel.scrollNext()
    syncThumbCarousel()
  }
}

window.addEventListener('load', () => {
  thumbCarousal()
})
