// ====== SET YOUR BUSINESS PHONE NUMBER HERE ======
// Use digits only for tel: and sms links
const BUSINESS_PHONE = "9036179086";
const BUSINESS_TEXT = BUSINESS_PHONE;

// Optional: pre-filled text message
const DEFAULT_SMS_MESSAGE =
  "Hi! I'm interested in Garbage Guys Co. service. Can you tell me the next steps?";

// ====== Helper: format estimate ======
function calcEstimate(base, cans) {
  const extraCans = Math.max(0, cans - 1);
  return base + extraCans * 5;
}

function money(n) {
  return `$${n}`;
}

function setContactLinks() {
  const smsHref = `sms:${BUSINESS_TEXT}?&body=${encodeURIComponent(DEFAULT_SMS_MESSAGE)}`;
  const telHref = `tel:${BUSINESS_PHONE}`;

  const textBtn = document.getElementById("textBtn");
  const callBtn = document.getElementById("callBtn");
  const textBtn2 = document.getElementById("textBtn2");
  const callBtn2 = document.getElementById("callBtn2");

  if (textBtn) textBtn.href = smsHref;
  if (textBtn2) textBtn2.href = smsHref;
  if (callBtn) callBtn.href = telHref;
  if (callBtn2) callBtn2.href = telHref;
}

function initEstimator() {
  const tierSelect = document.getElementById("tierSelect");
  const canCount = document.getElementById("canCount");
  const estimate = document.getElementById("estimate");

  if (!tierSelect || !canCount || !estimate) return;

  const update = () => {
    const base = Number(tierSelect.value || 0);
    const cans = Number(canCount.value || 1);
    const total = calcEstimate(base, cans);
    estimate.textContent = money(total);
  };

  tierSelect.addEventListener("change", update);
  canCount.addEventListener("input", update);
  update();
}

function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("backdrop");
  const closeBtn = document.getElementById("drawerClose");
  const links = document.querySelectorAll(".drawerLink");

  if (!btn || !drawer || !backdrop || !closeBtn) return;

  const open = () => {
    drawer.classList.add("isOpen");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    drawer.classList.remove("isOpen");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("isOpen");
    isOpen ? close() : open();
  });

  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  links.forEach((a) => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setContactLinks();
  initEstimator();
  initMobileMenu();
});
