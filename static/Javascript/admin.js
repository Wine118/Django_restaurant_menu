const folderInput = document.getElementById('folderUpload');
const previewImg = document.getElementById('previewImg');
const previewName = document.getElementById('previewName');
const dishInput = document.getElementById('dishName');
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
    const file = images[index];

    previewImg.src = URL.createObjectURL(file);
    // if dish name is empty, show file name
    if(!dishInput.value.trim()){
        previewName.textContent = file.name;
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
            li.textContent = dish.burmese_name || dish.name; // display Burmese if exists


            li.onclick = () => {
                dishInput.value = dish.name;
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
    const price = document.getElementById('dishPrice').value;

    const formData = new FormData();
    formData.append("dish_name", dishName);
    formData.append("dish_id", dishId);
    formData.append("price", price);

    images.forEach((img, i)=> {
        formData.append(`image_${i+1}`, img);
    });
    console.log("Submitting form data:", formData);
});


