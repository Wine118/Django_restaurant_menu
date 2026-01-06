console.log("External JS block loaded ✅");
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

document.addEventListener("DOMContentLoaded", () => {
  const imgElement = document.getElementById("special-img");
  if(imgElement){
    const images = JSON.parse(imgElement.dataset.images || "[]");
    let index = 0;

    // Function to change the image
  if(images.length > 0){
      setInterval(() => {
          imgElement.style.opacity = 0;

          setTimeout(() => {
            index = (index + 1) % images.length;
            imgElement.src = images[index];
            imgElement.style.opacity = 1;
          }, 600);
        }, 3000);
    
      }
    }
  } 

  // Add to Cart

  
);
  







const btn = document.getElementById("special-btn");

btn.addEventListener("click", () => {

    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const specialItem = {
        name: name,
        price: price,
        qty: 1
    };
    console.log("Special Item:", specialItem);
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    if(multiSelectDishes.includes(specialItem.name)){
      // Go to menu page to select options
      console.log("Redirecting to menu for multi-select item.");
      const anchor = slugify(specialItem.name); // slugify name
      window.location.href = MENU_URL + "#" + anchor;
    }else{
        // Check if special item already add -> increase qty
        let item = cart.find(i => i.name === specialItem.name);

        if(item) {
            item.qty += 1;
        }else{
            cart.push(specialItem);
        }
        localStorage.setItem("cartItems", JSON.stringify(cart));

        
        alert(`${specialItem.name} has been added to your cart.`);


        // // Go to menu page to show cart
        window.location.href = MENU_URL + "#to-order";

    }

    

});

// Helper to slugify names same as Django
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}