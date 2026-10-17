
"use strict";

// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        description: "Enjoy clear sound and comfortable listening.",
        image: "https://placehold.co/400x300/ece7ff/5034bd?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2299,
        description: "Track your daily activity in style.",
        image: "https://placehold.co/400x300/e0f2fe/075985?text=Smart+Watch"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1899,
        description: "Lightweight shoes for everyday comfort.",
        image: "https://placehold.co/400x300/ffedd5/9a3412?text=Running+Shoes"
    },
    {
        id: 4,
        name: "Classic Backpack",
        category: "Fashion",
        price: 999,
        description: "A practical backpack for work and travel.",
        image: "https://placehold.co/400x300/dcfce7/166534?text=Backpack"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1299,
        description: "Compact speaker for music on the go.",
        image: "https://placehold.co/400x300/fce7f3/9d174d?text=Speaker"
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "Accessories",
        price: 699,
        description: "A stylish accessory for sunny days.",
        image: "https://placehold.co/400x300/fef3c7/92400e?text=Sunglasses"
    },
    {
        id: 7,
        name: "Travel Watch",
        category: "Accessories",
        price: 1599,
        description: "A simple watch for everyday outfits.",
        image: "https://placehold.co/400x300/e0e7ff/3730a3?text=Travel+Watch"
    },
    {
        id: 8,
        name: "Cotton T-Shirt",
        category: "Fashion",
        price: 499,
        description: "A soft, casual T-shirt for daily wear.",
        image: "https://placehold.co/400x300/f3e8ff/6b21a8?text=T-Shirt"
    }
];

// ===== Shopping Cart State =====
const cart = new Map();

// ===== HTML Elements =====
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const resultMessage = document.getElementById("resultMessage");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");

// ===== Display Products =====
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

    items.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.removeAttribute("src");
            image.alt = `${product.name} image unavailable`;
            image.style.display = "none";
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
        price.textContent = `₹${product.price.toLocaleString("en-IN")}`;

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

// ===== Search, Filter and Sort =====
function updateProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortFilter.value;

    let filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
sortFilter.addEventListener("change", updateProducts);

// ===== Shopping Cart =====
function updateCartCount() {
    let totalItems = 0;

    cart.forEach((quantity) => {
        totalItems += quantity;
    });

    cartCount.textContent = totalItems;
}

function renderCart() {
    cartItems.replaceChildren();
    let total = 0;

    if (cart.size === 0) {
        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";
        cartItems.appendChild(message);
    }

    cart.forEach((quantity, productId) => {
        const product = products.find((item) => item.id === productId);

        if (!product) return;

        total += product.price * quantity;

        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("span");
        details.textContent =
            `${product.name} × ${quantity} — ₹${(product.price * quantity).toLocaleString("en-IN")}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.dataset.removeId = product.id;
        removeButton.textContent = "Remove";

        item.append(details, removeButton);
        cartItems.appendChild(item);
    });

    cartTotal.textContent = `Total: ₹${total.toLocaleString("en-IN")}`;
    updateCartCount();
}

// Event delegation: handle product and cart buttons.
document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart");

    if (addButton) {
        const productId = Number(addButton.dataset.productId);
        const currentQuantity = cart.get(productId) || 0;

        cart.set(productId, currentQuantity + 1);
        updateCartCount();

        addButton.textContent = "Added ✓";
        setTimeout(() => {
            addButton.textContent = "Add to Cart";
        }, 800);
    }

    const removeButton = event.target.closest("[data-remove-id]");

    if (removeButton) {
        const productId = Number(removeButton.dataset.removeId);
        cart.delete(productId);
        renderCart();
    }
});

// ===== Cart Dialog Controls =====
cartButton.addEventListener("click", () => {
    renderCart();
    cartDialog.showModal();
});

closeCart.addEventListener("click", () => {
    cartDialog.close();
});

clearCartButton.addEventListener("click", () => {
    cart.clear();
    renderCart();
});

// ===== Initial Display =====
updateProducts();
updateCartCount();
