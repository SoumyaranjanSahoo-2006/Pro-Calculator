// ==========================
// Elements
// ==========================
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

const allCalcToggle = document.getElementById("allCalcToggle");
const allCalcParent = allCalcToggle
  ? allCalcToggle.closest(".has-dropdown")
  : null;

// ==========================
// Open Sidebar
// ==========================
if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

// ==========================
// Close Sidebar
// ==========================
function closeSidebar() {
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  document.body.style.overflow = "auto";

  if (allCalcParent) {
    allCalcParent.classList.remove("open");
  }
}

if (overlay) {
  overlay.addEventListener("click", closeSidebar);
}

// ==========================
// Sidebar Active Links
// ==========================
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.id === "allCalcToggle") return;

    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    closeSidebar();
  });
});

// ==========================
// Dropdown Toggle
// ==========================
if (allCalcToggle) {
  allCalcToggle.addEventListener("click", (e) => {
    e.preventDefault();

    if (allCalcParent) {
      allCalcParent.classList.toggle("open");
    }
  });
}

// ==========================
// Dropdown Links
// ==========================
// No preventDefault() here!
// The browser will automatically open the page.
document.querySelectorAll(".dropdown-link").forEach((link) => {
  link.addEventListener("click", () => {
    closeSidebar();
  });
});

// ==========================
// App Card Navigation
// ==========================
const pages = {
  "normal-cal": "normal.html",
  "grocery-cal": "grocery.html",
  "cgpa-cal": "cgpa.html",
  "age-cal": "age.html",
  "currency-cal": "currency.html",
  "unit-cal": "unit.html",
};

Object.keys(pages).forEach((id) => {
  const element = document.getElementById(id);

  if (element) {
    element.addEventListener("click", () => {
      window.location.href = pages[id];
    });
  }
});