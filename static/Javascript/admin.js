const folderInput = document.getElementById('folderUpload');
const previewImg = document.getElementById('previewImg');
const previewName = document.getElementById('previewName');
const dishInput = document.getElementById('dishName');
const form = document.querySelector('.special-form');

let images = [];
let currentIndex = 0;

window.addEventListener("beforeunload", () => {
        localStorage.setItem("scrollY", window.scrollY);
});

window.addEventListener("load", () => {

    const y = localStorage.getItem("scrollY");
    if (y) window.scrollTo(0, y);
});

document.addEventListener("click", function (e) {
    if (e.target.matches(".pagination button")) {
        const page = e.target.dataset.page;

        fetch(`/cafedashboard/partial/?page=${page}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById("complaints-container").innerHTML = html;

                // Keep complaints perfectly in view
                document.getElementById("complaints")
                    .scrollIntoView({ behavior: "auto" });
            });
    }
});


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

document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".read-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const complaintId = this.dataset.id;
            const isRead = this.checked;

            fetch(`/complaints/toggle-read/`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "X-CSRFToken" : getCSRFToken()
                },
                body: JSON.stringify({
                    id: complaintId,
                    read: isRead
                })
            });
        });
    });
});

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

