document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or as an empty array
    let cart = JSON.parse(localStorage.getItem('wellCartItems')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    // Function to update the cart count display
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'block'; // Show if items exist
        } else {
            cartCountElement.style.display = 'none'; // Hide if no items
        }
    };

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('wellCartItems', JSON.stringify(cart));
    };

    // Add event listeners to all 'Add to Cart' buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                const productTitle = productCard.querySelector('.product-title').textContent;

                // --- THIS IS THE CRITICAL FIX ---
                // It now correctly saves the price string, e.g., "Rs.999.99"
                const productPrice = productCard.querySelector('.product-price').textContent;

                const productImage = productCard.querySelector('.product-image').src; // Get image source

                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        id: productId,
                        title: productTitle,
                        price: productPrice, // Saves the price as "Rs.999.99"
                        image: productImage,
                        quantity: 1
                    });
                }

                saveCart();
                updateCartCount();
                alert(`${productTitle} added to cart!`);
            }
        });
    });

    // Initial update of cart count when the page loads
    updateCartCount();

    // --- Newsletter Subscription ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (email && email.includes('@') && email.includes('.')) {
                console.log(`Newsletter subscription requested for: ${email}`);
                alert(`Thank you for subscribing, ${email}!`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // --- Navigation Active State ---
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});
