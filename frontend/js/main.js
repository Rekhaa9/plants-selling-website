// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const searchInput = document.getElementById('search');
const searchIcon = document.querySelector('.search-icon');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const contactForm = document.getElementById('contact-form');
const categoryCards = document.querySelectorAll('.category-card');

// Sample product data
const products = [
    {
        id: 'monstera',
        name: 'Monstera Deliciosa',
        price: 49.99,
        category: 'indoor',
        image: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'A popular tropical plant known for its distinctive split leaves.'
    },
    {
        id: 'snake',
        name: 'Snake Plant',
        price: 39.99,
        category: 'indoor',
        image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'A hardy plant that can survive in low light conditions.'
    },
    {
        id: 'peace-lily',
        name: 'Peace Lily',
        price: 34.99,
        category: 'indoor',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Known for its beautiful white flowers and air-purifying qualities.'
    },
    {
        id: 'fiddle-leaf',
        name: 'Fiddle Leaf Fig',
        price: 59.99,
        category: 'indoor',
        image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'A trendy plant with large, violin-shaped leaves.'
    },
    {
        id: 'aloe',
        name: 'Aloe Vera',
        price: 24.99,
        category: 'succulents',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8c10d6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'A medicinal succulent plant with healing properties.'
    },
    {
        id: 'cactus',
        name: 'Golden Barrel Cactus',
        price: 29.99,
        category: 'succulents',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'A spherical cactus with golden spines.'
    },
    {
        id: 'rose',
        name: 'Rose Plant',
        price: 44.99,
        category: 'outdoor',
        image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Beautiful flowering plant with fragrant blooms.'
    },
    {
        id: 'lavender',
        name: 'Lavender',
        price: 32.99,
        category: 'outdoor',
        image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Aromatic herb with purple flowers.'
    }
];

// Shopping cart
let cart = [];
let currentCategory = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    initializeNavigation();
    initializeCart();
    initializeContactForm();
    initializeCategories();
});

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu?.contains(e.target) && !navLinks?.contains(e.target)) {
            mobileMenu?.classList.remove('active');
            navLinks?.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Update active link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Cart functionality
function initializeCart() {
    // Open cart modal
    cartIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    // Close cart modal
    closeModal?.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification('Product added to cart!');
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart display
function updateCartDisplay() {
    if (cartItems && cartTotalAmount) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = formatPrice(total);
    }
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, newQuantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Contact form
function initializeContactForm() {
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        // Here you would typically send the form data to a server
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
}

// Display products
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatPrice(product.price)}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">Add to Cart</button>
            </div>
        `).join('');
    }
}

// Format price to Indian Rupees
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        displayFilteredProducts(filteredProducts);
    });

    searchIcon?.addEventListener('click', () => {
        searchInput.value = '';
        displayProducts();
    });
}

// Initialize categories
function initializeCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryCards.forEach(card => {
        // Handle card click
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button
            if (e.target.classList.contains('category-btn')) return;
            
            const category = card.dataset.category;
            filterProductsByCategory(category);
            
            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Scroll to shop section
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        });

        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Handle "View All" button clicks
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const category = button.closest('.category-card').dataset.category;
            filterProductsByCategory(category);
            
            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            button.closest('.category-card').classList.add('active');
            
            // Scroll to shop section
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Filter products by category
function filterProductsByCategory(category) {
    currentCategory = category;
    const filteredProducts = category === 'All' 
        ? products 
        : products.filter(product => product.category === category);
    
    displayFilteredProducts(filteredProducts);
    
    // Update URL hash
    window.location.hash = `category=${category.toLowerCase()}`;
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-leaf"></i>
                    <p>No products found in this category.</p>
                    <button onclick="filterProductsByCategory('All')" class="view-all-btn">View All Products</button>
                </div>
            `;
        } else {
            productGrid.innerHTML = `
                <div class="category-header">
                    <h3>${currentCategory}</h3>
                    <p>${filteredProducts.length} products found</p>
                </div>
                <div class="products-grid">
                    ${filteredProducts.map(product => `
                        <div class="product-card">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.name}">
                                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                            <div class="product-content">
                                <h4>${product.name}</h4>
                                <p class="price">${formatPrice(product.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// Cart Management
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Product removed from cart!');
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    if (!cartItems || !cartTotal || !cartCount) return;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Product Filtering
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.add-to-cart-btn').dataset.product;
            addToCart(productId);
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts(category);
        });
    });

    // Initialize cart UI
    updateCartUI();
}); 