console.log("External JS block loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const imgElement = document.getElementById("special-img");
  const images = window.images;

  if (!images || images.length === 0) {
    console.error("No images loaded");
    return;
  }

  let index = 0;

  setInterval(() => {
    imgElement.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % images.length;
      imgElement.src = images[index];
      imgElement.style.opacity = 1;
    }, 600);
  }, 3000);
});



// Special menu is adding to the cart system
const multiSelectDishes = [
  "Nanpyar",
  "Parata",
  "Youtiao",
  "Keema",
  "Mohinga",
  "Ohn Noh Kauk Swe",
  "Mont Tee Thoke",
  "Kat Kyay Kite",
  "Dumpling",
  "Shan",
  "Tofu Nway",
  "Mee Shay",
  "Myay Oh Mee Shay",
  "Tom Yum Soup"

];
const specialItem = {
    name : "ကြက်ကုန်းဘောင်",
    price: 6000,
    qty: 1
};

document.querySelector("#special-btn").addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    if(multiSelectDishes.includes(specialItem.name)){
        window.location.href = `menu.html#category-menu#?item=${specialItem.name}`;
    }else{
        // Check if special item already add -> increase qty
        let item = cart.find(i => i.name === specialItem.name);

        if(item) {
            item.qty += 1;
        }else{
            cart.push(specialItem);
        }
        localStorage.setItem("cartItems", JSON.stringify(cart));

        if (localStorage.getItem("cartItems")) {
        console.log("cartItems is in localStorage!");
        } else {
        console.log("No cartItems found.");
        }

        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        console.log(cartItems);


        // Go to menu page to show cart
        // window.location.href = "menu.html#to-order";
    }

    

});