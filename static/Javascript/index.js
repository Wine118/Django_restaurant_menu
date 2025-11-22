console.log("External JS block loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
console.log("DOM ready ✅");

const imgElement = document.getElementById("special-img");
const nameElement = document.getElementById("special-name");

if (!imgElement || !nameElement) {
    console.error("Missing elements:", { imgElement, nameElement });
    return;
}


const names = ["ကြက်ကုန်းဘောင်", "ငါးဟင်းချို", "ထမင်းကြော်"];
const images = window.image;
// Prove images are actually accessible
images.forEach((src) => {
    const testImg = new Image();
    testImg.onload = () => console.log("Preloaded OK:", src);
    testImg.onerror = () => console.error("Failed to load:", src);
    testImg.src = src;
});

let index = 0;

function changeImage() {
    console.log("Changing to:", images[index], names[index]);
    imgElement.style.opacity = 0;

    setTimeout(() => {
    index = (index + 1) % images.length;
    imgElement.src = images[index] + "?v=" + Date.now(); // cache-bust
    imgElement.style.opacity = 1;
    }, 600);
}

// Kick off
setInterval(changeImage, 3000);
});






