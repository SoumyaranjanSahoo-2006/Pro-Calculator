// Elements
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

// Open sidebar
hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

// Close sidebar
function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
  allCalcParent.classList.remove("open");
}

overlay.addEventListener("click", closeSidebar);

// Active menu handling
sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Don't close sidebar if it's the dropdown toggle
    if (link.id === "allCalcToggle") return;

    sidebarLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    closeSidebar();
  });
});



// Dropdown toggle for All Calculator
const allCalcToggle = document.getElementById("allCalcToggle");
const allCalcParent = allCalcToggle.closest(".has-dropdown");

allCalcToggle.addEventListener("click", (e) => {
  e.preventDefault();
  allCalcParent.classList.toggle("open");
});

// Clicking a dropdown item scrolls to the card and closes sidebar
document.querySelectorAll(".dropdown-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.target;
    const card = document.getElementById(target);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.style.boxShadow = "0 0 0 3px var(--sky-dark)";
      setTimeout(() => card.style.boxShadow = "", 1200);
    }
    closeSidebar();
  });
});

// App card navigation
document.getElementById("normal-cal").addEventListener("click", () => {
  window.location.href = "normal.html";
});

document.getElementById("grocery-cal").addEventListener("click", () => {
  window.location.href = "grocery.html";
});

document.getElementById("cgpa-cal").addEventListener("click", () => {
  window.location.href = "./pages/cgpa-calculator.html";
});

document.getElementById("age-cal").addEventListener("click", () => {
  window.location.href = "age.html";
});

document.getElementById("currency-cal").addEventListener("click", () => {
  window.location.href = "./pages/currency-converter.html";
});

document.getElementById("unit-cal").addEventListener("click", () => {
  window.location.href = "./pages/unit-converter.html";
});