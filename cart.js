const CART_KEY = 'bitesbyraf_cart';

// ----- GLOBAL PRODUCT DATA (UPDATED: Biscoff & Pandan) -----
const PRODUCT_DATA = [
    { id: 'BR01', name: 'Classic Fudgy Brownie', price: 35.00, category: 'Brownies' },
    { id: 'BR02', name: 'Nutella Swirl Brownie', price: 40.00, category: 'Brownies' },
    { id: 'BR03', name: 'Pecan Crunch Brownie', price: 42.00, category: 'Brownies' },
    { id: 'CC01', name: 'Classic Burnt Cheesecake', price: 80.00, category: 'Burnt Cheese Cake' },
    { id: 'CC02', name: 'Biscoff Burnt Cheesecake', price: 95.00, category: 'Burnt Cheese Cake' },
    { id: 'CP01', name: 'Pandan Cupcakes (Box of 6)', price: 45.00, category: 'Cupcakes' },
    { id: 'CP02', name: 'Triple Chocolate Cupcakes (Box of 6)', price: 42.00, category: 'Cupcakes' },
    { id: 'CP03', name: 'Classic Vanilla Bean (Box of 6)', price: 38.00, category: 'Cupcakes' },
];

// ----- 1. LOAD CART FROM STORAGE -----
function loadCart() {
    const cartString = localStorage.getItem(CART_KEY);
    return cartString ? JSON.parse(cartString) : [];
}

// ----- 2. SAVE CART TO STORAGE -----
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ----- 3. CLEAR CART -----
function clearCart() {
    localStorage.removeItem(CART_KEY);
    // Use toast instead of alert if possible
    alert("Cart has been cleared!"); 
    if (document.getElementById('cart-table-body')) {
        location.reload(); 
    }
    updateCartCount();
}

// ----- 4. ADD ITEM TO CART (UPDATED) -----
function addToCart(productId, name, price) {
    let cart = loadCart();
    const parsedPrice = parseFloat(price);
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: productId, 
            name: name, 
            price: parsedPrice, 
            quantity: 1 
        });
    }
    
    saveCart(cart);
    
    // ----- USE TOAST NOTIFICATION -----
    showToast(`Added ${name} to cart! 🛒`);
    
    updateCartCount();
}

// ----- 5. UPDATE CART COUNT IN HEADER -----
function updateCartCount() {
    const cart = loadCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'inline'; 
        } else {
            cartCountElement.style.display = 'none'; 
        }
    }
}

// ----- 6. RENDER CART PAGE -----
function renderCart() {
    const cart = loadCart();
    const tableBody = document.getElementById('cart-table-body');
    const totalsDiv = document.getElementById('cart-totals');

    if (!tableBody || !totalsDiv) return; 

    tableBody.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">Your cart is empty!</td></tr>';
        totalsDiv.innerHTML = '<p>Subtotal: <span style="float:right;">RM 0.00</span></p><h3>Total: <span style="float:right; color: var(--primary-pink);">RM 0.00</span></h3><a href="product_list.html" class="btn btn-block">Continue Shopping</a>';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>
                <strong>${item.name}</strong>
                <br><a href="#" onclick="removeItemFromCart(${index}); return false;" style="color: var(--danger-red); font-weight:bold; font-size: 0.8rem;">Remove</a>
            </td>
            <td>RM ${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>RM ${itemTotal.toFixed(2)}</td>
        `;
    });
    
    const deliveryFee = 5.00; 
    const total = subtotal + deliveryFee;

    totalsDiv.innerHTML = `
        <p>Subtotal: <span style="float:right;">RM ${subtotal.toFixed(2)}</span></p>
        <p style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">Delivery Fee: <span style="float:right;">RM ${deliveryFee.toFixed(2)}</span></p>
        <h3>Total: <span style="float:right; color: var(--primary-pink);">RM ${total.toFixed(2)}</span></h3>
        <a href="checkout.html" class="btn btn-block">Proceed to Checkout</a>
    `;
}

// ----- 7. REMOVE SINGLE ITEM -----
function removeItemFromCart(index) {
    let cart = loadCart();
    cart.splice(index, 1); 
    saveCart(cart);
    renderCart(); 
    updateCartCount(); 
}


// ----- 8. CHECKOUT SUMMARY -----
function renderCheckoutSummary() {
    const cart = loadCart();
    const summaryListDiv = document.getElementById('summary-list');
    const summaryTotalsDiv = document.getElementById('summary-totals');

    if (!summaryListDiv || !summaryTotalsDiv) return; 

    summaryListDiv.innerHTML = '';
    summaryTotalsDiv.innerHTML = '';
    let subtotal = 0;
    const deliveryFee = 5.00; 

    if (cart.length === 0) {
        summaryListDiv.innerHTML = '<p style="text-align: center;">Your cart is empty. Please add items before checking out.</p>';
        summaryTotalsDiv.innerHTML = '<h3>Total: <span style="float:right; color: var(--primary-pink);">RM 0.00</span></h3><a href="product_list.html" class="btn btn-block" style="background: #ccc; pointer-events: none;">Place Order (Cart Empty)</a>';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        summaryListDiv.innerHTML += `
            <p>${item.name} x${item.quantity} <span style="float:right;">RM ${itemTotal.toFixed(2)}</span></p>
        `;
    });
    
    summaryListDiv.innerHTML += `
        <p>Delivery Fee <span style="float:right;">RM ${deliveryFee.toFixed(2)}</span></p>
    `;

    const total = subtotal + deliveryFee;

    summaryTotalsDiv.innerHTML = `
        <h3>Total: <span style="float:right; color: var(--primary-pink);">RM ${total.toFixed(2)}</span></h3>
    `;
}


// ----- 9. ADMIN INVENTORY RENDER -----
function renderAdminInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    PRODUCT_DATA.forEach(item => {
        const row = tableBody.insertRow();
        const deleteLink = `<a href="#" onclick="alert('Simulated deletion of ${item.name} (${item.id})'); return false;" style="color: var(--danger-red); font-weight:bold;">Delete</a>`;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>RM ${item.price.toFixed(2)}</td>
            <td>${deleteLink}</td>
        `;
    });
}

// ----- 10. TOAST HELPER FUNCTION -----
function showToast(message) {
    const toast = document.getElementById("toast-box");
    if (toast) {
        toast.textContent = message;
        toast.className = "show";
        setTimeout(function(){ 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
    } else {
        alert(message); 
    }
}

// ----- 11. CHECKOUT & DUMMY PAYMENT LOGIC (MODIFIED) -----
function handleCheckout(event) {
    event.preventDefault(); 

    const name = document.getElementById('cust-name').value;
    const cardNumber = document.getElementById('card-number').value;

    const cart = loadCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    showToast("Processing Payment...");

    setTimeout(() => {
        // Logic: If card number ends with "0000", simulate FAILURE
        if (cardNumber.endsWith("0000")) {
            window.location.href = "payment_failure.html";
        } else {
            // SUCCESS
            localStorage.removeItem(CART_KEY);
            
            // REMOVED REDIRECT TO order_confirmation.html
            // ADDED ALERT AND REDIRECT TO INDEX
            alert("Order Placed Successfully! (Confirmation page hidden)");
            window.location.href = "index.html"; 
        }
    }, 1500); 
}


// ----- INITIALIZATION -----
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (document.getElementById('cart-table-body')) {
        renderCart();
    }

    if (document.getElementById('summary-list')) {
        renderCheckoutSummary();
    }
    
    if (document.getElementById('inventory-table-body')) {
        renderAdminInventory();
    }
});