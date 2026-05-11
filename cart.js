document.addEventListener('DOMContentLoaded', () => {

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const cartCountElement = document.querySelector('.cart-count');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('wellCartItems')) || [];

    // --- 1. Function to save cart to localStorage ---
    function saveCart() {
        localStorage.setItem('wellCartItems', JSON.stringify(cart));
    }

    // --- 2. Function to display all cart items and summary ---
    function displayCart() {
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        cartSummaryContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Your cart is empty. <a href="shop.html">Start shopping!</a></p>';
            // Clear header count and summary
            cartCountElement.textContent = '0';
            cartCountElement.style.display = 'none';
            return;
        }

        let subtotal = 0;
        let totalItems = 0;

        cart.forEach((item, index) => {
            // Create the cart item element
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            // --- PRICE FIX ---
            // Remove "Rs." and convert to a number for calculation
            const itemPrice = parseFloat(item.price.replace('Rs.', ''));
            subtotal += itemPrice * item.quantity;
            totalItems += item.quantity;

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p class="cart-item-price">Price: Rs.${itemPrice.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-quantity" data-index="${index}" data-action="decrease">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="btn-quantity" data-index="${index}" data-action="increase">+</button>
                    <button class="btn-remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // --- Display Cart Summary ---
        const tax = subtotal * 0.05; // Example: 5% tax
        const total = subtotal + tax;

        cartSummaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-line">
                <span>Subtotal (${totalItems} items):</span>
                <span>Rs.${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Tax (5%):</span>
                <span>Rs.${tax.toFixed(2)}</span>
            </div>
            <div class="summary-line summary-total">
                <span>Total:</span>
                <span>Rs.${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary" id="place-order-btn">Place Order</button>
        `;

        // --- Update Header Cart Count ---
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'block';
    }

    // --- 3. Function to handle all clicks in the cart ---
    function setupCartEventListeners() {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;

            // Get the index of the item from the data-index attribute
            const index = target.dataset.index;

            // Check if a quantity button was clicked
            if (target.classList.contains('btn-quantity')) {
                const action = target.dataset.action;

                if (action === 'increase') {
                    cart[index].quantity++;
                } else if (action === 'decrease') {
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        // If quantity is 1, remove the item
                        cart.splice(index, 1);
                    }
                }
            }

            // Check if a remove button was clicked
            if (target.classList.contains('btn-remove')) {
                cart.splice(index, 1); // Remove item from array
            }

            // After any change, save the cart and re-display it
            saveCart();
            displayCart();
        });

        // Add functionality to "Place Order" button
        // We must add this listener to the *summary container* due to event delegation
        cartSummaryContainer.addEventListener('click', (event) => {
            if (event.target.id === 'place-order-btn') {
                alert('Thank you for your order!');

                // Clear the cart
                cart = [];
                saveCart();

                // Re-display the (now empty) cart
                displayCart();
            }
        });
    }

    // --- Initial setup ---
    displayCart();
    setupCartEventListeners();

});
