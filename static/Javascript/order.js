// ======== GET ELEMENTS ========
const openAmountModal = document.getElementById("openAmountModal");
const amountModal = document.getElementById("amountModal");
const closeAmountModal = document.getElementById("closeAmountModal");
const confirmAmount = document.getElementById("confirmAmount");


// ======== SHOW MODAL WHEN "Order Now" IS CLICKED ========
openAmountModal.addEventListener("click", () => {
    amountModal.style.display = "flex";   // flex because modal uses flexbox
});


// ======== HIDE MODAL WHEN "Cancel" IS CLICKED ========
closeAmountModal.addEventListener("click", () => {
    amountModal.style.display = "none";
});


// ======== ALSO HIDE WHEN CLICK OUTSIDE THE MODAL ========
window.addEventListener("click", (event) => {
    if (event.target === amountModal) {
        amountModal.style.display = "none";
    }
});


// ======== CONFIRM BUTTON (OPTIONAL: CLOSE MODAL AFTER CONFIRM) ========
confirmAmount.addEventListener("click", () => {
    // You can add payment logic here later

    // Gather cart items
    let cart = getCart();

    // Gather customer info
    const name = document.getElementById("nameInput").value;
    const phone = document.getElementById("phoneInput").value;
    const address = document.getElementById("addressInput").value;

    // Delivery type
    const deliveryType = document.querySelector("input[name='deliverytype']:checked")?.value || "takeout";

    // Total amount (already calculated in DOM)
    const totalText = document.getElementById("order-total-amount").textContent;
    // Remove the "MMK" part and trim spaces
    const totalNumber = parseInt(totalText.replace("MMK","").trim());
    
    // Amount entered by customer
    const amountPaid = parseInt(document.getElementById("amountInput").value);
    
    //Build payload
    const orderData = {
        cart: cart,
        delivery_type: deliveryType,
        customer: {
            name: name,
            phone: phone,
            address: deliveryType === "delivery" ? address : ""
        },
        total: totalNumber,
        amount_paid: amountPaid,
    };

    console.log("order data",orderData);
    localStorage.setItem("orderData",JSON.stringify(orderData));
    const savedOrderData = JSON.parse(localStorage.getItem("orderData"));
    console.log("Order data saved:",savedOrderData);

    // Send to Django backnd
    fetch("/menu/api/orders/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")  //if CSRF protection enabled
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if(!response.ok) {
            return response.text().then(text => {
                throw new Error("Server error: "+text);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Order saved:", data);
        alert("Order placed successfully!");
        amountModal.style.display = "none";
    })
    .catch(error => {
        console.error("Error:",error);
        alert("Something went wrong while placing your order.");
    });



});


// Loading cart

function loadOrderPageCart() {
    let cart = getCart();
    const list = document.getElementById("order-list");
    const emptyMsg = document.querySelector(".order-empty-message");
    const totalAmount = document.getElementById("order-total-amount");
    const deliveryFeeSpan = document.getElementById("deliveryornot");
    const addressbar = document.getElementById("addressbar");

    addressbar.style.display = "none";
    list.innerHTML = "";

    if(cart.length === 0) {
        emptyMsg.style.display = "block";
        totalAmount.textContent = "0 MMK";
        deliveryFeeSpan.textContent = "0 MMK";
        return;
    }

    emptyMsg.style.display = "none";
    let total = 0;

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "order-row";
        row.innerHTML = `
            <div class="order-name">${item.name}</div>
            <div class="order-qty">
                <input type="number" value="${item.qty}" min="1" onchange="changeQty('${index}',this.value)">
            </div>
          <div class="order-price">${item.price} MMK</div>
          <div class="order-price-total">${item.price * item.qty} MMK</div>
          <button class="remove-btn" onclick="removeItem('${index}')">x</button>
        `;
        list.appendChild(row);
        total += item.price * item.qty;
    });

    //Delivery Fee
    const deliveryType = document.querySelector("input[name='deliverytype']:checked");
    let fee = 0;
    if(deliveryType && deliveryType.value === "delivery"){
        fee = 1000;
        addressbar.style.display = "block";
    } else {
        fee = 0;
        addressbar.style.display = "none";
    }
    
    deliveryFeeSpan.textContent = fee +" MMK";
    totalAmount.textContent = total + fee + "MMK";
}

document.addEventListener("change", (e) => {
    if(e.target.name === "deliverytype") loadOrderPageCart();
});

function changeQty(index, newQty){
    let cart = getCart();
    newQty = parseInt(newQty);
    if(newQty <= 0) newQty = 1;

    cart[index].qty = newQty;
    saveCart(cart);
    loadOrderPageCart();
}

function removeItem(index){
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadOrderPageCart();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCart(cart) {
    
    localStorage.setItem("cartItems", JSON.stringify(cart));

}

function getCookie(name){
    let cookieValue = null;
    if(document.cookie && document.cookie !==""){
        const cookies = document.cookie.split(";");
        for(let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if(cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length+1));
                break;
            }
        }
    }
    return cookieValue;

}
const cartItems = JSON.parse(localStorage.getItem("cartItems"));
console.log(cartItems);

document.addEventListener("DOMContentLoaded",loadOrderPageCart);