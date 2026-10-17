
import { products } from "./products.js";
import {
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartItems
} from "./cart.js";

import "./router.js";

// HTML elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const resultMessage = document.getElementById("resultMessage");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");

// Display products
function displayProducts(items) {
    productGrid.replaceChildren();

    resultMessage.textContent =
        `${items.length} product${items.length === 1 ? "" : "s"} found`;

    if (items.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No products found. Try another search.";
        productGrid.appendChild(message);
        return;
    }

    items.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        image.width = 400;
        image.height = 300;

        image.addEventListener("error", () => {
            image.hidden = true;
        }, { once: true });

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent =
            `₹${product.price.toLocaleString("en-IN")}`;

        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.type = "button";
        button.dataset.productId = product.id;
        button.textContent = "Add to Cart";

        info.append(category, name, description, price, button);
        card.append(image, info);
        productGrid.appendChild(card);
    });
}

// Search, filter and sort products
function updateProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortFilter.value;

    let filtered = products.filter(product => {
        const searchableText =
            `${product.name} ${product.category} ${product.description}`
                .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayProducts(filtered);
}

searchInput.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
sortFilter.addEventListener("change", updateProducts);

// Update shopping cart count
function updateCartCount() {
    cartCount.textContent = getCartCount();
}

// Display shopping cart items
function renderCart() {
    cartItemsContainer.replaceChildren();

    const items = getCartItems(products);
    let total = 0;

    if (items.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";
        cartItemsContainer.appendChild(message);
    }

    items.forEach(product => {
        const subtotal = product.price * product.quantity;
        total += subtotal;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("span");
        details.textContent =
            `${product.name} × ${product.quantity} — ₹${subtotal.toLocaleString("en-IN")}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.dataset.removeId = product.id;
        removeButton.textContent = "Remove";

        row.append(details, removeButton);
        cartItemsContainer.appendChild(row);
    });

    cartTotal.textContent =
        `Total: ₹${total.toLocaleString("en-IN")}`;

    updateCartCount();
}

// Handle Add to Cart and Remove buttons
document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;

    const addButton = event.target.closest(".add-to-cart");

    if (addButton) {
        addToCart(Number(addButton.dataset.productId));
        updateCartCount();

        addButton.textContent = "Added ✓";
        addButton.disabled = true;

        setTimeout(() => {
            addButton.textContent = "Add to Cart";
            addButton.disabled = false;
        }, 800);

        return;
    }

    const removeButton = event.target.closest("[data-remove-id]");

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.removeId));
        renderCart();
    }
});

// Open shopping cart
cartButton.addEventListener("click", () => {
    renderCart();
    cartDialog.showModal();
});

// Close shopping cart
closeCart.addEventListener("click", () => {
    cartDialog.close();
});

// Clear all cart items
clearCartButton.addEventListener("click", () => {
    clearCart();
    renderCart();
});

// Initial setup
updateProducts();
updateCartCount();
