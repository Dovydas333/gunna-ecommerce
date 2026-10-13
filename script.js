
document.addEventListener('DOMContentLoaded', () => {

    const hamburgerBtn = document.querySelector('#hamburger-btn');
    const navLinks = document.querySelector('#nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    let cart = JSON.parse(localStorage.getItem('gunna_cart')) || [];

    const cartCountElement = document.querySelector('#cart-count');
    const cartTotalPriceElement = document.querySelector('#total-price');

    updateCartUI();

    document.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        
        if (addToCartBtn) {
            const id = addToCartBtn.dataset.id || 'default-id';
            const name = addToCartBtn.dataset.name || 'Gunna Item';
            const price = parseFloat(addToCartBtn.dataset.price) || 0;

            addToCart(id, name, price);

            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = 'ADDED ✓';
            addToCartBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.background = '';
            }, 1000);
        }
    });

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('gunna_cart', JSON.stringify(cart));
        updateCartUI();
        if (document.querySelector('#cart-container')) {
            renderCartPage();
        }
    }

    function updateCartUI() {
        let totalCount = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        if (cartCountElement) {
            cartCountElement.textContent = totalCount;
        }

        if (cartTotalPriceElement) {
            cartTotalPriceElement.textContent = totalPrice.toFixed(2);
        }
    }

    const cartContainer = document.querySelector('#cart-container');
    if (cartContainer) {
        renderCartPage();

        cartContainer.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains('increase-btn')) {
                const item = cart.find(i => i.id === id);
                if (item) item.quantity += 1;
            } else if (e.target.classList.contains('decrease-btn')) {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                }
            } else if (e.target.classList.contains('remove-item-btn')) {
                cart = cart.filter(i => i.id !== id);
            }

            saveAndRender();
        });
    }

    function renderCartPage() {
        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <p>Your cart is currently empty.</p>
                    <a href="index.html#shop" style="margin-top: 1rem; display: inline-block;">Return to Shop</a>
                </div>
            `;
            return;
        }

        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let grandTotal = 0;

        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            grandTotal += subtotal;

            html += `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="cart-item-controls">
                            <button class="qty-btn decrease-btn" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td><button class="remove-item-btn" data-id="${item.id}">Remove</button></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="cart-summary">
                <h3>Total: $${grandTotal.toFixed(2)}</h3>
                <button class="checkout-btn" onclick="alert('Checkout feature coming soon!')">Proceed to Checkout</button>
            </div>
        `;

        cartContainer.innerHTML = html;
    }

});

const contactForm = document.getElementById('emailjs-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_sziyyso', 'template_br5z4rr', this)
            .then(function() {
                submitBtn.textContent = 'SENT SUCCESSFULLY! ✓';
                submitBtn.style.background = '#27ae60';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.textContent = 'SUBMIT NOW';
                    submitBtn.style.background = '#111';
                    submitBtn.disabled = false;
                }, 3000);
            }, function(error) {
                alert('Failed to send message: ' + JSON.stringify(error));
                submitBtn.textContent = 'TRY AGAIN';
                submitBtn.disabled = false;
            });
    });
}
