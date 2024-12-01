document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];  // Recupera el carrito desde localStorage (si existe)
    const cartEl = document.getElementById("cart");
    const cartItemsEl = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartCountEl = document.getElementById("cartCount");
    const openCartButton = document.getElementById("openCart");
    const closeCartButton = document.getElementById("closeCart");
    const emptyCartMessage = document.getElementById("emptyCartMessage");

    
    function updateLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));  // Guarda el carrito en localStorage
    }

    
    function coreCarrito() {
        cartItemsEl.innerHTML = "";
        let total = 0;
        let totalQuantity = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
        } else {
            emptyCartMessage.style.display = "none";
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                totalQuantity += item.quantity;

                const li = document.createElement("li");
                li.innerHTML = `
                    ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                    <button onclick="removeFromCart(${index})">❌</button>
                `;
                cartItemsEl.appendChild(li);
            });
        }

        cartTotalEl.textContent = total.toFixed(2);
        cartCountEl.textContent = totalQuantity;
        updateLocalStorage();  
    }

    function addToCart(id, name, price, quantity = 1) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }

        coreCarrito();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        coreCarrito();
    }

    function updateQuantity(inputId, increment = true) {
        const input = document.getElementById(inputId);
        let value = parseInt(input.value);

        if (increment) {
            value += 1;
        } else if (value > 1) {
            value -= 1;
        }

        input.value = value;
    }

   
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const quantityInputId = button.nextElementSibling.querySelector("input").id;
            const quantity = parseInt(document.getElementById(quantityInputId).value);

            addToCart(id, name, price, quantity);
        });
    });

    document.querySelectorAll(".increment").forEach(button => {
        button.addEventListener("click", () => {
            const inputId = button.getAttribute("data-quantity");
            updateQuantity(inputId, true);
        });
    });

    document.querySelectorAll(".decrement").forEach(button => {
        button.addEventListener("click", () => {
            const inputId = button.getAttribute("data-quantity");
            updateQuantity(inputId, false);
        });
    });

    openCartButton.addEventListener("click", () => {
        cartEl.classList.toggle("hidden");
    });

    closeCartButton.addEventListener("click", () => {
        cartEl.classList.add("hidden");
    });

   
    coreCarrito();

    window.removeFromCart = removeFromCart;
});
