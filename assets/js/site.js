document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const hamburgerButtons = document.querySelectorAll("[data-hamburger]");
  const themeToggle = document.querySelector(".theme-toggle");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  /* -----------------------------
     Theme toggle
  ----------------------------- */
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  function getEffectiveTheme() {
    const selectedTheme = root.getAttribute("data-theme");
    return selectedTheme || (systemTheme.matches ? "dark" : "light");
  }

  function updateThemeToggleLabel() {
    if (!themeToggle) return;

    const isDark = getEffectiveTheme() === "dark";
    const label = isDark
      ? "Switch to light theme"
      : "Switch to dark theme";

    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }

  if (themeToggle) {
    updateThemeToggleLabel();

    themeToggle.addEventListener("click", function () {
      const nextTheme =
        getEffectiveTheme() === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      updateThemeToggleLabel();
    });

    if (typeof systemTheme.addEventListener === "function") {
      systemTheme.addEventListener("change", function () {
        if (!root.hasAttribute("data-theme")) {
          updateThemeToggleLabel();
        }
      });
    }
  }

  /* -----------------------------
     Hamburger navigation
  ----------------------------- */
  function closeHamburgers() {
    document.querySelectorAll(".hamburger.open").forEach(function (menu) {
      menu.classList.remove("open");
    });

    hamburgerButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  hamburgerButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const selector = button.getAttribute("data-hamburger");
      const menu = selector ? document.querySelector(selector) : null;

      if (!menu) return;

      const shouldOpen = !menu.classList.contains("open");

      closeHamburgers();

      if (shouldOpen) {
        menu.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".hamburger") &&
      !event.target.closest("[data-hamburger]")
    ) {
      closeHamburgers();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeHamburgers();
    }
  });

  /* -----------------------------
      Close hamburger on scroll
  ----------------------------- */
  window.addEventListener("scroll", closeHamburgers, {
    passive: true
  });

  /* -----------------------------
      Close hamburger on resize
  ----------------------------- */
  window.addEventListener("resize", closeHamburgers);

  document.querySelectorAll(".hamburger-link").forEach(function (link) {
    link.addEventListener("click", closeHamburgers);
  });

});