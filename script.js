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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const progress = document.querySelector(".progress");
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
    ticking = false;
  });
}, { passive: true });

const form = document.querySelector("#contactForm");
const note = document.querySelector("#formNote");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!WEBHOOK_URL) {
    const text = [
      "New project enquiry",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `WhatsApp: ${data.phone}`,
      `Business: ${data.business || "Not provided"}`,
      `Service: ${data.service}`,
      `Problem: ${data.message}`
    ].join("\n");

    window.open(`https://wa.me/917002303764?text=${encodeURIComponent(text)}`, "_blank");
    note.textContent = "Your WhatsApp draft is ready. The Activepieces submission will be connected in the backend stage.";
    form.reset();
    return;
  }

  note.textContent = "Sending enquiry…";
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Request failed");
    form.reset();
    note.textContent = "Enquiry received. I'll get back to you after reviewing the details.";
  } catch {
    note.textContent = "Couldn't send automatically. Please use WhatsApp or email below.";
  }
});
