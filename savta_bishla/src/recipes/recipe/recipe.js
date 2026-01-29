import axios from "axios";

async function loadRecipe() {
    const recipeIdUrl = new URLSearchParams(window.location.search).get('Id');
    if (!recipeIdUrl) {
        alert("לא נמצא מתכון");
        window.location.href = "../index.html";
    }

    try {
        const url = `http://localhost:3000/recipes/${recipeIdUrl}`;
        const res = await axios.get(url);
        const myRecipe = res.data;

        document.querySelector("#recipe-title").textContent = myRecipe.title;
        document.querySelector("#recipe-description").textContent = myRecipe.description;
        document.querySelector(".sub-text").innerHTML =
          `  ${myRecipe.time} <span class="sub-text">דקות</span>`;
        document.querySelector("#difficulty-value").textContent = myRecipe.difficulty;

        if (myRecipe.image) {
            document.querySelector("#recipe-image").src = `http://localhost:3000${myRecipe.image}`;
        }

        const ingredientsList = document.querySelector("#recipe-ingredients");
        myRecipe.ingredients.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            ingredientsList.appendChild(li);
        });

        const instructionsList = document.querySelector("#recipe-instructions");
        myRecipe.instructions.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            instructionsList.appendChild(li);
        });

        addFavoriteHeart(recipeIdUrl);

    } catch (error) {
        console.error("שגיאה בשליפת מתכון:", error);
    }
}

// פונקציה להוספת אייקון לב ושמירת מועדפים
function addFavoriteHeart(recipeId) {
    const container = document.querySelector(".bottom-icons");
    const heartSpan = document.createElement("span");
    heartSpan.classList.add("action-icon", "favorite-icon");
    heartSpan.title = "הוסף למועדפים";
    
    const heartIcon = document.createElement("i");
    heartIcon.classList.add("far", "fa-heart"); 
    heartSpan.appendChild(heartIcon);
    container.appendChild(heartSpan);

    // בדיקה אם המתכון כבר שמור
    const token = localStorage.getItem("token");
    if (!token) {
        heartSpan.style.opacity = "0.5"; 
        heartSpan.title = "התחבר כדי לשמור מתכונים";
    } else {
        checkIfFavorite(recipeId, token, heartIcon);
    }

    // אירוע לחיצה
    heartSpan.addEventListener("click", async () => {
        if (!token) {
            alert("עליך להתחבר כדי להוסיף למועדפים");
            return;
        }

        try {
            const isCurrentlyFavorite = heartIcon.classList.contains("fas");
            const url = `http://localhost:3000/users/favorites/${recipeId}`;
            const config = { headers: { Authorization: `Bearer ${token} `} };
// הוספה או הסרה מהמועדפים
            if (isCurrentlyFavorite) {
                await axios.delete(url, config);
                heartIcon.classList.replace("fas", "far");
                heartIcon.style.color = ""; 
            } else {
                await axios.post(url, {}, config);
                heartIcon.classList.replace("far", "fas");
                heartIcon.style.color = "#9e268a";
            }
        } catch (error) {
            console.error("שגיאה בעדכון מועדפים:", error);
            heartIcon.classList.toggle("fas");
            heartIcon.classList.toggle("far");
        }
    });

    async function checkIfFavorite(recipeId, token, heartIcon) {
        try {
            const res = await axios.get("http://localhost:3000/users/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const favorites = res.data;

            if (favorites.some(r => r._id === recipeId)) {
                heartIcon.classList.replace("far", "fas");
                heartIcon.style.color = "#9e268a"; 
            }
        } catch (error) {
            console.error("שגיאה בבדיקת מועדפים:", error);
        }
    }
}
// פונקציה להדפסת המתכון
function setupPrintButton() {
    const printButton = document.getElementById('print-recipe');
    printButton.addEventListener('click', () => {
        window.print();
    });
}

// פונקציה לשיתוף המתכון
function setupShareButton() {
    const shareButton = document.getElementById('share-recipe');
    shareButton.addEventListener('click', async () => {
        const recipeTitle = document.getElementById('recipe-title').textContent;
        const currentUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipeTitle,
                    url: currentUrl
                });
            } catch (error) {
                console.error('שגיאה בשיתוף:', error);
            }
        } else {
            navigator.clipboard.writeText(currentUrl)
                .then(() => {
                    alert('הקישור הועתק ללוח! אפשר לשתף את המתכון.');
                })
                .catch(err => {
                    console.error('שגיאה בהעתקת הקישור:', err);
                    alert('לא הצלחנו להעתיק את הקישור. נסה להעתיק ידנית מהדפדפן.');
                });
        }
    });
}

loadRecipe();
setupPrintButton();
setupShareButton();