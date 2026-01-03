const folderInput = document.getElementById('folderUpload');
const previewImg = document.getElementById('previewImg');
const previewName = document.getElementById('previewName');
const dishInput = document.getElementById('dishName');
const dishEnglishInput = document.getElementById('dishEnglishName');
const dishIdInput = document.getElementById('dishId');
const suggestionBox = document.getElementById('suggestions');
const form = document.querySelector('.special-form');

let images = [];
let currentIndex = 0;

// When folder selected
folderInput.addEventListener('change', function() {
    const files = Array.from(folderInput.files);

    // Filter image files only
    const imageFiles = files.filter(file => file.type.startsWith("image/"));

    //Limit to 3 images
    images = imageFiles.slice(0,3);
    if(images.length > 0) {
        loadImage(0); //show first image
    } 
});



// Load selected image
function loadImage(index){
    currentIndex = index;
    const img = images[index];

    //CASE 1: Image from file input (File object)
    if(img instanceof File){
        previewImg.src = URL.createObjectURL(img);
    }
    //CASE 2: Image from server (URL string)
    else if(typeof img === "string"){
        previewImg.src = img;
    }

    
    // if dish name is empty, show file name
    if(!dishInput.value.trim()){
        previewName.textContent = 
        img instanceof File ? img.name : previewName.textContent;
    }
    
}


// Navigation buttons
document.getElementById('prevBtn').onclick = () => {
    if(currentIndex > 0) loadImage(currentIndex - 1);
};

document.getElementById('nextBtn').onclick = () => {
    if(currentIndex < images.length - 1) loadImage(currentIndex + 1);
};

// Auto-suggestion for dish name
dishInput.addEventListener("input", async () => {
    const query = dishInput.value.trim();
    dishIdInput.value = ""; // reset dish id
    dishEnglishInput.value = ""; // reset English name
    suggestionBox.innerHTML = ""; // clear previous suggestions

    if(!query){
        return;
    }
    try{
        suggestionBox.style.display = "block";
        const res = await fetch(`/cafedashboard/dish-suggestions/?q=${encodeURIComponent(query)}`);
        const dishes = await res.json();
        console.log("Fetched dish suggestions:", dishes);

        dishes.forEach(dish => {
            const li = document.createElement("li");
            li.textContent = `${dish.name}(${dish.burmese_name}) `; // display Burmese if exists


            li.onclick = () => {
                dishInput.value = dish.burmese_name || dish.name;
                dishEnglishInput.value = dish.name;
                dishIdInput.value = dish.id;
                suggestionBox.innerHTML = ""; // clear suggestions
                suggestionBox.style.display = "none";
            };
            suggestionBox.appendChild(li);
        });
    } catch(err){
        console.error("Error fetching dish suggestions:", err);
    }

});



// handle form submit (Upload button)
form.addEventListener('submit', function(event) {
    event.preventDefault(); //stop page reload

    // Update previewName with dish input value
    const dishName = dishInput.value.trim();
    if(dishName){
        previewName.textContent = dishName;
    }

    // if images already selected, show first one
    if(images.length > 0) {
        loadImage(0)
    }

    // Prepare data for server
    const dishId = dishIdInput.value; // may be empty if new
    const dishEnglishName = dishEnglishInput.value.trim();
    const price = document.getElementById('dishPrice').value.trim();
    if(!dishId && !price){
        alert("Please enter a dish price for the new special dish.");
        return;
    }

    console.log("Dish Name:", dishName);
    console.log("Dish English Name:", dishEnglishName);
    console.log("Dish ID:", dishId);
    console.log("Price:", price);
    console.log("Number of images to upload:", images.length);

    const formData = new FormData();
    formData.append("dishName", dishName);
    formData.append("dishEnglishName", dishEnglishName);
    formData.append("dishId", dishId);
    formData.append("price", price);

    images.forEach((img, i)=> {
        formData.append("images", img);
    });
    
    //Send to server or send POST request to Django
    fetch('/cafedashboard/upload-special/',{
        method: 'POST',
        body: formData,
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server response:", data);
        alert(data.message || "Special dish uploaded successfully!");
        // DO NOT reset preview
        suggestionBox.innerHTML = "";
         // reload persisted data from DB
        loadLatestSpecial();
    })
    .catch(err => console.error(err));
});

// Utility function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies){
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')){
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function loadLatestSpecial(){
    console.log("Loading latest special dish from server...");
    try{
        const res = await fetch('/cafedashboard/latest-special/');
        const data = await res.json();

        if(!data.exists) return;
        console.log("Latest special dish data:", data);

        // Set name
        previewName.textContent = data.name;

        // Filter valid images
        const imgs = data.images.filter(Boolean);

        if(imgs.length > 0){
            images = imgs; //overwrite local images array
            currentIndex = 0;
            previewImg.src = imgs[0]; //load first image
        }

    }catch(err){
        console.error("Error loading latest special dish:", err);
    }
}


// run on page load
document.addEventListener("DOMContentLoaded", loadLatestSpecial);