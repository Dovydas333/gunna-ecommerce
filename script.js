document.addEventListener("DOMContentLoaded", () => {

    let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
    let totalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;

    updateCartUI(cartCount, totalPrice);

    const addButtons = document.querySelectorAll(".add-to-cart-btn");

    addButtons.forEach(button => {
        button.addEventListener("click", () => {

            const price = parseFloat(button.dataset.price);

            if (isNaN(price)) return;

            cartCount++;
            totalPrice += price;

            localStorage.setItem("cartCount", cartCount);
            localStorage.setItem("totalPrice", totalPrice);

            updateCartUI(cartCount, totalPrice);
        });
    });

    const clearBtn = document.getElementById("clear-cart-btn");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {

            cartCount = 0;
            totalPrice = 0;

            localStorage.removeItem("cartCount");
            localStorage.removeItem("totalPrice");

            updateCartUI(cartCount, totalPrice);
        });
    }


    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerBtn && navLinks) {

        hamburgerBtn.addEventListener("click", () => {

            hamburgerBtn.classList.toggle("active");
            navLinks.classList.toggle("active");

        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                hamburgerBtn.classList.remove("active");
                navLinks.classList.remove("active");

            });

        });
    }

});


function updateCartUI(count, price) {

    const countEl = document.getElementById("cart-count");
    const priceEl = document.getElementById("total-price");

    if (countEl) {
        countEl.textContent = count;
    }

    if (priceEl) {
        priceEl.textContent = price.toFixed(2);
    }
}
