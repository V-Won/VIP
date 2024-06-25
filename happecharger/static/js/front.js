// 페이지 로드가 완료되면 실행
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector('[data-scroll-container]');

  // Fetch 요청이 완료된 후 Locomotive Scroll 초기화
  Promise.all([
    fetch("/include/header.html").then(response => response.text()),
    fetch("/include/footer.html").then(response => response.text())
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
          breakpoint: 0,
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

      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      ScrollTrigger.refresh();

      // GSAP과 ScrollTrigger 플러그인을 로드합니다.
      gsap.registerPlugin(ScrollTrigger);

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
    })
    .catch(error => {
      console.error('Error fetching the header or footer:', error);
    });
});