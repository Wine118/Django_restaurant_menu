const toppingData = {
    "Nanpyar":[
        {name: "Bean Paste", price: 0},
        {name: "Sugar", price: 0}
    ], 
    "Parata":[
        {name: "Bean Paste", price: 0},
        {name: "Sugar", price: 0}
    ],
    "Youtiao":[
        {name: "Bean Paste", price: 0},
        {name: "Sugar", price: 0}
    ],
    "Keema":[
        {name: "Chicken", price: 0},
        {name: "Mutton", price: 0},
        {name: "Beef", price: 0}
    ],
    "Mohinga":[
        {name: "Fritter", price: 300},
        {name: "Fish Cake", price: 500},
        {name: "Sliced Eggs", price: 700},
        {name: "Oh Bae Ou(Soup boiled egg)", price: 1000}
    ],
    "Ohn Noh Kauk Swe":[
        {name: "Fritter", price: 300},
        {name: "Fish Cake", price: 500},
        {name: "Sliced Eggs", price: 700},
        {name: "Oh Bae Ou(Soup boiled egg)", price: 1000}
    ],
    "Mont Tee Thoke":[
        {name: "Fritter", price: 300},
        {name: "Fish Cake", price: 500},
        {name: "Sliced Eggs", price: 700}
    ],
    "Kat Kyay Kite":[
        {name: "Chicken", price: 0},
        {name: "Seafood", price: 2000}
    ],
    "Dumpling":[
        { name: "Chicken", price: 0 },
        { name: "Pork", price: 0 }
    ],
    "Shan":[
        { name: "Chicken", price: 0 },
        { name: "Pork", price: 0 }
    ],
    "Tofu Nway":[
        { name: "Chicken", price: 0 },
        { name: "Pork", price: 0 }
    ],
    "Mee Shay":[
        { name: "Chicken", price: 0 },
        { name: "Pork", price: 0 }
    ],
    "Myay Oh Mee Shay":[
        { name: "Chicken", price: 0 },
        { name: "Seafood", price: 2000 }
    ],
    "Tom Yum Soup":[
        { name: "Chicken", price: 0 },
        { name: "Seafood", price: 2000 }
    ],
}

const multiSelectDishes = ["Mohinga", "Mont Tee Thoke", "Ohn Noh Kauk Swe"];
let basePrice = 0;
let itemName = "";


function openMohingaOptions(dishName,originalPrice) {
        
    itemName = dishName;
    basePrice = originalPrice;
    const modal = document.getElementById("mohingaModal");
    const box = modal.querySelector(".toppingbox");

    box.innerHTML = "";
    const toppings = toppingData[dishName];

    // Determine input type (checkbox or radio)
    const inputType = multiSelectDishes.includes(dishName) ? "checkbox" : "radio";
    
    toppings.forEach((topping, index) => {
        const row = document.createElement("div");
        
        row.className = "topping-option";

        row.innerHTML = `
            <div>${topping.name}</div>
            <div class="chk-wrapper">
                <input type="${inputType}"
                name="toppingChoice"
                value="${topping.price}"
                data-topping-name="${topping.name}"
                data-price="${topping.price}"
                class="mohinga-topping"
                >
            </div>
        `;
        box.appendChild(row);
    });
    
    modal.style.display = "block";

}

function closeMohingaOptions() {
    document.getElementById("mohingaModal").style.display = "none";
    // Optionally uncheck all checkboxes when closing
    document.querySelectorAll('.mohinga-topping').forEach(cb => cb.checked = false);
    
}

function addMohinga() {
    let totalPrice = basePrice;
    let toppingNames = [];   
    

    // Collect selected toppings
    document.querySelectorAll('.mohinga-topping:checked').forEach(topping => {
        totalPrice += parseInt(topping.dataset.price);

        let toppingName = topping.dataset.toppingName;

        toppingNames.push(toppingName);
    });

    
    if (toppingNames.length > 0) {
        itemName += " + " + toppingNames.join(", ");
    }
    console.log(`itemName = ${itemName} and totalprice = ${totalPrice}`);
    
    // Add to order list using your existing addItem function
    addItem(itemName, totalPrice);
    itemName = "";
    basePrice= 0;
    closeMohingaOptions();
}


// ORDER SYSTEM



function addItem(dishName, price){
    let cart =getCart();
    let item = cart.find(i => i.name === dishName);
    if(item){
        item.qty += 1;
    } else {
        cart.push({
            name: dishName,
            price: price,
            qty: 1
        });
    }
    saveCart(cart);
    updateOrderList();        
}

function updateOrderList() {
    const orderList = document.getElementById("order-list");
    const emptymsg = document.getElementById("empty-message");
    const totalAmount = document.getElementById("total-amount");

    const cart = getCart();
    orderList.innerHTML = "";
    
    let total = 0;
    
    if(cart.length === 0){
        emptymsg.style.display = "block";
        totalAmount.textContent = "0 MMK";
        orderList.style.display = "none";
        total = 0;
        return;
    }else{
        emptymsg.style.display = "none";
        orderList.style.display = "flex";
    }
        
    
    
    
    
    cart.forEach((item, index) => {
        const rowTotal = item.price * item.qty;
        total += rowTotal;

        orderList.innerHTML += `
            <div class="order-row">

                <div class="order-name">
                    ${item.name}
                </div>

                <div class="order-qty">
                    <input type="number"
                     value="${item.qty}"
                      min="1"
                      onchange = "changeQty('${index}',this.value)"
                      >
                </div>

                <div class="order-price">
                    ${item.price} MMK
                </div>

                <div class="order-price-total">
                    ${rowTotal} MMK
                </div>

                <button class="remove-btn" onclick="removeItem('${index}')">x</button>

        </div>
        `;
    });

    totalAmount.textContent = `${total} MMK`;
    
}

function changeQty(index, newQty){
    let cart = getCart();
    newQty = parseInt(newQty);
    if(newQty <= 0) newQty = 1;

    cart[index].qty = newQty;
    saveCart(cart);
    updateOrderList();
}

function removeItem(index){
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateOrderList();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCart(cart) {
    
    localStorage.setItem("cartItems", JSON.stringify(cart));

}

if (localStorage.getItem("cartItems")) {
    console.log("cartItems is in localStorage!");
} else {
    console.log("No cartItems found.");
}

const cartItems = JSON.parse(localStorage.getItem("cartItems"));
console.log(cartItems);

window.addEventListener("DOMContentLoaded", () => {
    const hash= window.location.hash;
    if(!hash) return;

    // #MohinaAndNoodle?itemMohinga
    const [sectionId, query] = hash.substring(1).split("?");

    // Scroll to section(browser already does this)
    if(query){
        const params = new URLSearchParams(query);
        const itemId = params.get("item");

        if(itemId) {
            setTimeout(()=>{
                const itemElement = document.getElementById(itemId);
                if(itemElement){
                    itemElement.scrollIntoView({
                        behavior: "smooth",
                        block:"center"
                    });

                }
            },300);
        }
    }
});

document.addEventListener("DOMContentLoaded", updateOrderList);
