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
}

overlay.addEventListener("click", closeSidebar);

// Active menu handling
sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {
    sidebarLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    closeSidebar();
  });
});


