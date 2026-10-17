
export const cart = new Map();

export function addToCart(productId) {
    const quantity = cart.get(productId) || 0;
    cart.set(productId, quantity + 1);
}

export function removeFromCart(productId) {
    cart.delete(productId);
}

export function clearCart() {
    cart.clear();
}

export function getCartCount() {
    let count = 0;

    cart.forEach(quantity => {
        count += quantity;
    });

    return count;
}

export function getCartItems(products) {
    return Array.from(cart.entries())
        .map(([id, quantity]) => {
            const product = products.find(item => item.id === id);

            return product ? { ...product, quantity } : null;
        })
        .filter(Boolean);
}
