const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

const toggleNavigation = () => {
  if (!mainNav) return;
  mainNav.classList.toggle('open');
};

const formatNumber = (value, target) => {
  if (target.includes('.')) {
    return parseFloat(value).toFixed(2);
  }
  return Math.round(value).toString();
};

const animateCounters = () => {
  const counters = document.querySelectorAll('.count-up');
  counters.forEach((counter) => {
    const target = parseFloat(counter.dataset.target);
    let current = 0;
    const duration = 1400;
    const stepTime = Math.max(Math.floor(duration / (target * 20)), 10);
    const increment = target / (duration / stepTime);

    const update = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = formatNumber(target, counter.dataset.target);
      } else {
        counter.textContent = formatNumber(current, counter.dataset.target);
        requestAnimationFrame(update);
      }
    };

    update();
  });
};

const revealOnScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((section) => {
    observer.observe(section);
  });
};

const initVideoCards = () => {
  document.querySelectorAll('.video-card').forEach((card) => {
    const shell = card.querySelector('.video-shell');
    const video = card.querySelector('.video-player');
    const toggle = card.querySelector('.video-toggle');

    if (!shell || !video || !toggle) return;

    const updateToggle = () => {
      const icon = toggle.querySelector('i');
      const isPlaying = !video.paused;

      shell.classList.toggle('is-playing', isPlaying);
      toggle.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');

      if (icon) {
        icon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
      }
    };

    toggle.addEventListener('click', async () => {
      if (video.paused) {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video playback failed:', error);
        }
      } else {
        video.pause();
      }

      updateToggle();
    });

    video.addEventListener('play', updateToggle);
    video.addEventListener('pause', updateToggle);
    video.addEventListener('ended', updateToggle);

    updateToggle();
  });
};

const init = () => {
  if (navToggle) {
    navToggle.addEventListener('click', toggleNavigation);
  }
  animateCounters();
  revealOnScroll();
  initVideoCards();
};

window.addEventListener('DOMContentLoaded', init);
