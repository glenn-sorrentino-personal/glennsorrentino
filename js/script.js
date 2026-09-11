document.querySelector('.print-button').addEventListener('click', () => window.print());

const timelineSections = [...document.querySelectorAll('.date-group')];
let scrollUpdatePending = false;

function updateActiveSection() {
  scrollUpdatePending = false;
  const readingPosition = Math.max(100, window.innerHeight * 0.3);
  let activeSection = timelineSections[0];

  for (const section of timelineSections) {
    if (section.getBoundingClientRect().top <= readingPosition) activeSection = section;
    else break;
  }

  // Short final sections should still become active at the end of the page.
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    activeSection = timelineSections.at(-1);
  }

  for (const section of timelineSections) {
    const active = section === activeSection;
    section.classList.toggle('is-active', active);
    if (active) section.setAttribute('aria-current', 'true');
    else section.removeAttribute('aria-current');
  }
}

function scheduleActiveSectionUpdate() {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
window.addEventListener('resize', scheduleActiveSectionUpdate);
window.addEventListener('load', scheduleActiveSectionUpdate);
document.addEventListener('toggle', scheduleActiveSectionUpdate, true);
document.fonts?.ready.then(scheduleActiveSectionUpdate);
updateActiveSection();
