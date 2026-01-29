import axios from "axios";

const recipeForm = document.querySelector("#recipeForm");
const input = document.querySelector("#image");
const preview = document.querySelector("#imagePreview");
const recipeId = new URLSearchParams(window.location.search).get("id");
const errorMsg = document.querySelector("#errorMsg");
const messageBox = document.getElementById("messageBox");

// טעינת פרטי המתכון לעריכה
async function loadRecipe() {
    try {
        const url = `http://localhost:3000/recipes/${recipeId}`;
        const res = await axios.get(url);
        const recipe = res.data;

        document.querySelector("#title").value = recipe.title;
        document.querySelector("#description").value = recipe.description;
        document.querySelector("#ingredients").value = recipe.ingredients;
        document.querySelector("#instructions").value = recipe.instructions;
        document.querySelector("#time").value = recipe.time;
        document.querySelector("#difficulty").value = recipe.difficulty;

        if (recipe.image) {
            preview.src = `http://localhost:3000${recipe.image}`;
            preview.style.display = "block";
            // הוסף את השורה הזו - הסתר את ה-upload-box
            document.querySelector(".upload-box").style.display = "none";
        }

        // המתן שהקטגוריות ייטענו מ-formRecipe.js ואז סמן את הנבחרות
        setTimeout(() => {
            markSelectedCategories(recipe.categories.map(c => c._id));
        }, 500);
        
    } catch (error) {
        console.error("שגיאה בטעינת מתכון", error);
    }
}

// פונקציה לסימון הקטגוריות שנבחרו במתכון
function markSelectedCategories(selectedIds = []) {
    const checkboxes = document.querySelectorAll('input[name="categories"]');
    checkboxes.forEach(checkbox => {
        if (selectedIds.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
}

// טיפול בשליחת הטופס
recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = "";

    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="categories"]:checked')
    ).map(cb => cb.value);

    if (selectedCategories.length === 0) {
        showError("❌ יש לבחור לפחות קטגוריה אחת");
        return;
    }

    const formData = new FormData();
    formData.append("title", document.querySelector("#title").value);
    formData.append("description", document.querySelector("#description").value);
    formData.append("ingredients", document.querySelector("#ingredients").value);
    formData.append("instructions", document.querySelector("#instructions").value);
    formData.append("time", document.querySelector("#time").value);
    formData.append("difficulty", document.querySelector("#difficulty").value);
    selectedCategories.forEach(id => formData.append("categories", id));

    const imageFile = input.files[0];
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const token = localStorage.getItem("token");
        const url = `http://localhost:3000/recipes/${recipeId}`;
        await axios.put(url, formData, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data' 
            }
        });
        showMessage("🎉 המתכון עודכן בהצלחה!");
    } catch (error) {
        console.log(error);
        showError(error.response?.data?.message || "אירעה שגיאה בעדכון המתכון");
    }
});

// תצוגת התמונה שנבחרה
input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.style.display = "block";
            document.querySelector(".upload-box").style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

// הוסף את הקוד הזה - אפשרות ללחוץ על התמונה כדי להחליף
preview.addEventListener("click", () => {
    input.click();
});

// אפשרות ללחוץ על ה-upload-box
document.querySelector(".upload-box").addEventListener("click", () => {
    input.click();
});

// הצגת הודעת הצלחה
function showMessage(msg) {
    if (messageBox) {
        messageBox.textContent = msg;
        messageBox.style.display = "block";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }
}

// הצגת הודעת שגיאה
function showError(msg) {
    if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
        setTimeout(() => {
            errorMsg.textContent = "";
            errorMsg.style.display = "none";
        }, 5000);
    }
}

loadRecipe();