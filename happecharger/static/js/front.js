document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector('[data-scroll-container]');

  // Fetch 요청이 완료된 후 Locomotive Scroll 초기화
  Promise.all([
    fetch("include/header.html").then(response => response.text()),
    fetch("include/footer.html").then(response => response.text())
  ])
    .then(([headerData, footerData]) => {
      document.getElementById("header").innerHTML = headerData;
      document.getElementById("footer").innerHTML = footerData;

      // Locomotive Scroll 초기화
      const locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        lerp: 0.05,
        multiplier: 1.2,
        tablet: {
          // breakpoint: 1930, // tablet 모드 기준 화면 크기
          // smooth: false
        },
        smartphone: {
          smooth: false,
          direction: 'vertical',
          gestureDirection: 'vertical'
        }
      });

      // ScrollTrigger와 Locomotive Scroll 연동
      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
      });

      setTimeout(() => {
        ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
        ScrollTrigger.refresh();
      }, 1000);

      // GSAP과 ScrollTrigger 플러그인을 로드합니다.
      gsap.registerPlugin(ScrollTrigger);

      // box-header scroll
      let lastScrollY = 0;

      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        scroller: scrollContainer, // Locomotive Scroll과 연동
        onToggle: self => {
          const boxHeader = document.querySelector('.box-header');
          if (self.isActive) {
            boxHeader.classList.add('is-scroll');
          } else {
            boxHeader.classList.remove('is-scroll');
          }
        },
        onUpdate: self => {
          const boxHeader = document.querySelector('.box-header');
          const currentScrollY = self.scroll();

          if (currentScrollY > lastScrollY) {
            boxHeader.classList.add('is-down');
            boxHeader.classList.remove('is-up');
          } else {
            boxHeader.classList.add('is-up');
            boxHeader.classList.remove('is-down');
          }

          lastScrollY = currentScrollY;
        }
      });

      // kv img
      const inners = document.querySelectorAll('.box-kv .cover-bg .inner');
      let currentIndex = 0;

      function addIsActiveClass() {
        inners.forEach((inner, index) => {
          if (index === currentIndex) {
            inner.classList.add('is-active');
          } else {
            inner.classList.remove('is-active');
          }
        });
        currentIndex = (currentIndex + 1) % inners.length;
      }

      setInterval(addIsActiveClass, 4000); // 3000ms = 3초
      addIsActiveClass(); // 초기 상태에서 첫 번째 요소에 클래스 추가

      // scroll top
      ScrollTrigger.create({
        trigger: '.box-section-con',
        start: 'top top', // .box-section-con이 브라우저 상단에 도달할 때
        scroller: scrollContainer, // Locomotive Scroll과 연동
        onEnter: () => {
          setTimeout(() => {
            document.querySelector('.box-section-con').style.background = '#fff';
          }, 1000);
        },
        onLeaveBack: () => {
          setTimeout(() => {
            document.querySelector('.box-section-con').style.background = '#fff';
          }, 1000);
        }
      });


      // box-kv
      gsap.to(".box-kv .inner", {
        yPercent: 50, // y축으로 50% 이동
        opacity: 0.2, // 투명도
        scrollTrigger: {
          trigger: ".box-kv",
          scroller: scrollContainer, // Locomotive Scroll과 연동
          start: "top top", // 스크롤 시작 지점
          end: "bottom top", // 스크롤 종료 지점
          scrub: true, // 스크롤에 따라 애니메이션 동기화
        }
      });

      // box-banner-bottom
      gsap.fromTo(".box-banner-bottom .banner_right",
        {
          y: 20
        },
        {
          y: -20,
          scrollTrigger: {
            trigger: ".box-banner-bottom",
            scroller: scrollContainer, // Locomotive Scroll과 연동
            start: "top center",
            end: "bottom center",
            scrub: true,
            markers: false
          }
        });

      // box-banner-roller
      const inner = document.querySelector('.box-banner-roller .inner');
      const images = inner.querySelectorAll('.box-banner-roller .inner img');
      const totalWidth = Array.from(images).reduce((acc, img) => acc + img.offsetWidth + 96, 0);

      gsap.set(inner, { x: 0 });

      function animateBanner() {
        gsap.to(inner, {
          x: -totalWidth / 2,
          duration: 25,
          ease: 'linear',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (totalWidth / 2))
          }
        });
      }

      animateBanner();

      // box-motion
      const sections = document.querySelectorAll('.section-motion');
      let index = 0;

      function animateCount(element, finalValue) {
        gsap.to(element, {
          innerText: finalValue,
          duration: 2,
          ease: "power1.inOut",
          snap: { innerText: 1 },
          onUpdate: function () {
            element.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + ' +';
          }
        });
      }

      function activateSection() {
        sections.forEach((section, i) => {
          if (i === index) {
            section.classList.add('is-active');
            const tt1 = section.querySelector('.tt-1');
            const finalValue = parseInt(tt1.textContent.replace(/[^0-9]/g, ''));

            animateCount(tt1, finalValue);
          } else {
            section.classList.remove('is-active');
          }
        });

        index = (index + 1) % sections.length;
      }

      activateSection();
      setInterval(activateSection, 4000);

      // count
      const counters = document.querySelectorAll('.count');

      counters.forEach(counter => {
        ScrollTrigger.create({
          trigger: counter,
          scroller: scrollContainer, // Locomotive Scroll과 연동
          start: 'top center',
          onEnter: function () {
            const finalValue = +counter.getAttribute('data-count');

            gsap.to(counter, {
              innerText: finalValue,
              duration: 2,
              ease: "power1.inOut",
              snap: { innerText: 1 },
              onUpdate: function () {
                counter.innerText = Math.ceil(counter.innerText).toLocaleString() + ' +';
              }
            });
          },
          once: true // Trigger only once
        });
      });

      // box-page is-active
      const sectionsItem = document.querySelectorAll('.box-section-con .section');
      const navLinks = document.querySelectorAll('.box-page a');
      const boxSectionCon = document.querySelector('.box-section-con');

      sectionsItem.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          scroller: scrollContainer, // Locomotive Scroll과 연동
          onEnter: () => setActiveLink(index),
          onEnterBack: () => setActiveLink(index)
        });
      });

      function setActiveLink(index) {
        navLinks.forEach(link => link.classList.remove('is-active'));
        if (navLinks[index]) {
          navLinks[index].classList.add('is-active');
        }
      }

      ScrollTrigger.create({
        trigger: ".sec-2",
        start: "top center",
        end: "bottom bottom",
        markers: false,
        scroller: scrollContainer, // Locomotive Scroll과 연동
        onLeaveBack: () => {
          boxSectionCon.style.background = '#fff';
        },
      });

      ScrollTrigger.create({
        trigger: ".sec-3",
        start: "top center",
        end: "bottom bottom",
        markers: false,
        scroller: scrollContainer, // Locomotive Scroll과 연동
        onLeaveBack: () => {
          gsap.to(boxSectionCon, {
            background: '#fff',
            duration: 0 // 애니메이션 없이 즉시 변경됩니다.
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".sec-4",
        start: "top center",
        end: "bottom bottom",
        markers: false,
        scroller: scrollContainer, // Locomotive Scroll과 연동
        onEnter: () => {
          gsap.to(boxSectionCon, {
            background: 'linear-gradient(180deg, #000 0%, #1A242E 100%)',
            duration: 1 // 1초 동안 애니메이션이 진행됩니다. 필요에 따라 조절하세요.
          });
        },
        onLeave: () => {
          gsap.to(boxSectionCon, {
            //background: '#fff',
            //duration: 1 // 애니메이션 없이 즉시 변경됩니다.
          });
        },
        onLeaveBack: () => {
          gsap.to(boxSectionCon, {
            background: '#fff',
            duration: 0.5 // 애니메이션 없이 즉시 변경됩니다.
          });
        },
        onEnterBack: () => {
          gsap.to(boxSectionCon, {
            background: 'linear-gradient(180deg, #000 0%, #1A242E 100%)',
            duration: 1 // 1초 동안 애니메이션이 진행됩니다. 필요에 따라 조절하세요.
          });
        }
      });

      ScrollTrigger.create({
        trigger: ".box-page",
        start: "top 190px",
        endTrigger: ".sec-5",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
        scroller: scrollContainer, // Locomotive Scroll과 연동
      });

      // box-list img
      const imagesImg = document.querySelectorAll('.box-list img');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.box-list',
          start: 'top 80%',
          scroller: scrollContainer,
          markers: false,
          //toggleActions: 'restart restart restart restart',
        }
      });

      imagesImg.forEach((img, index) => {
        tl.fromTo(img,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.2 // 각 이미지에 1초 간격으로 딜레이
          },
          '-=0.5' // 약간의 오버랩을 위해 추가
        );
      });

      // sc img scroll
      gsap.fromTo('.animate-image',
        { y: 0 },
        {
          y: -1000,
          scrollTrigger: {
            trigger: '.animate-image',
            start: 'top center',
            scroller: scrollContainer,
            markers: true,
            toggleActions: 'play none none none',
            scrub: true,
          }
        }
      );










    })
    .catch(error => {
      console.error('Error fetching the header or footer:', error);
    });
});
