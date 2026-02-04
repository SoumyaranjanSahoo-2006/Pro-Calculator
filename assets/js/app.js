// DOM Elements
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');


window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");

  if (!splash || !app) return;

  const alreadyShown = sessionStorage.getItem("splashShown");

  if (!alreadyShown) {
    setTimeout(() => {
      splash.style.display = "none";
      app.style.display = "block";
      sessionStorage.setItem("splashShown", "true");
    }, 2500); // 1.5 sec
  } else {
    splash.style.display = "none";
    app.style.display = "block";
  }
});




// Toggle Sidebar
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Sidebar Navigation
if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // For non-link items (like future features), show alert
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                const toolName = link.querySelector('span').textContent;
                alert(`${toolName} feature is coming soon!🚀`);
            }
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Close sidebar on mobile
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    });
}

// Close sidebar when clicking outside on mobile
window.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        sidebar && 
        !sidebar.contains(e.target) && 
        !hamburgerBtn.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close sidebar
    if (e.key === 'Escape') {
        if (sidebar) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    }
});

// Set active sidebar link based on current page
function setActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setActiveSidebarLink();
});





if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}





