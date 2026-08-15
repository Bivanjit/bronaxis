const WEBHOOK_URL = ""; // Add the Activepieces webhook URL when the backend workflow is ready.

const menu = document.querySelector(".menu");
const links = document.querySelector(".links");
menu?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".links a").forEach(a => a.addEventListener("click", () => {
  links?.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
}));

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      reveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".section-reveal").forEach(el => reveal.observe(el));

const progress = document.querySelector(".progress");
let ticking = false;

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const amount = max ? scrollY / max : 0;
    progress.style.width = `${amount * 100}%`;

    // Brand colour travels gradually: blue → cyan → light cyan → lime → green.
    document.documentElement.style.setProperty("--scroll-hue", 215 - amount * 75);
    ticking = false;
  });
}, { passive: true });

const form = document.querySelector("#contactForm");
const note = document.querySelector("#formNote");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (!WEBHOOK_URL) {
    const text = ["New BRONAXIS project enquiry", `Name: ${data.name}`, `Email: ${data.email}`, `WhatsApp: ${data.phone}`, `Business: ${data.business || "Not provided"}`, `Service: ${data.service}`, `Problem: ${data.message}`].join("\n");
    window.open(`https://wa.me/917002303764?text=${encodeURIComponent(text)}`, "_blank");
    note.textContent = "Your WhatsApp draft is ready. The Activepieces submission will be connected in the backend stage.";
    form.reset();
    return;
  }
  note.textContent = "Sending enquiry…";
  try {
    const res = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Request failed");
    form.reset();
    note.textContent = "Enquiry received. We'll review the details and get back to you.";
  } catch {
    note.textContent = "Couldn't send automatically. Please use WhatsApp or email below.";
  }
});
