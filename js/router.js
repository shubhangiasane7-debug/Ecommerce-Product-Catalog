
const routes = {
    home: document.getElementById("home"),
    products: document.getElementById("products"),
    about: document.getElementById("about")
};

function navigateTo(page) {
    const target = routes[page] ? page : "home";
    const section = routes[target];

    if (!section) return;

    // Update the URL without reloading the page
    if (window.location.hash !== `#${target}`) {
        window.history.pushState({ page: target }, "", `#${target}`);
    }

    // Scroll to the selected section
    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Update active navigation link
    document.querySelectorAll(".navigation a").forEach(link => {
        const isActive = link.getAttribute("href") === `#${target}`;

        link.classList.toggle("active-link", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// Handle navigation links and the Vyntra logo
document.addEventListener("click", event => {
    const link = event.target.closest(
        ".navigation a, .logo, .hero .shop-button"
    );

    if (!link) return;

    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const page = href.slice(1);

    if (routes[page]) {
        event.preventDefault();
        navigateTo(page);
    }
});

// Support browser Back and Forward buttons
window.addEventListener("popstate", () => {
    const page = window.location.hash.slice(1);
    const target = routes[page] ? page : "home";

    routes[target].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
