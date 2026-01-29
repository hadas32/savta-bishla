import axios from 'axios';
import '../../../menu.js';
import '../../../menu.css';

const recipeForm = document.querySelector('#recipeForm');
const recipeImageInput = document.querySelector(".image");
const recipeImagePreview = document.querySelector("#imagePreview");
const errorMsg = document.getElementById("errorMsg");
const messageBox = document.getElementById("messageBox");


// --- תצוגת תמונה למתכון ---
recipeImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      recipeImagePreview.src = reader.result;
      recipeImagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});
// --- הצגת הודעות למשתמש ---
function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}
// --- שליחת טופס מתכון ---
recipeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMsg.textContent = "";
  const selectedCategories = Array.from(
      document.querySelectorAll('input[name="categories"]:checked')
  ).map(cb => cb.value);

  const formData = new FormData();
  formData.append("title", document.querySelector("#title").value);
  formData.append("description", document.querySelector("#description").value);
  formData.append("ingredients", document.querySelector("#ingredients").value);
  formData.append("instructions", document.querySelector("#instructions").value);
  formData.append("time", document.querySelector("#time").value);
  formData.append("difficulty", document.querySelector("#difficulty").value);
  selectedCategories.forEach(id => formData.append('categories', id));


  const imageFile = recipeImageInput.files[0];
  if (imageFile) {
      formData.append("image", imageFile);
  }

  const title = document.querySelector("#title").value;
  const ingredients = document.querySelector("#ingredients").value;
  const instructions = document.querySelector("#instructions").value;
  if (selectedCategories.length === 0) {
      errorMsg.textContent = "חובה לבחור לפחות קטגוריה אחת!";
      return;
  }

  if (!imageFile) {
      errorMsg.textContent = "חובה להעלות תמונה!";
      return;
  }
  
  if (!title || !ingredients || !instructions ) {
      errorMsg.textContent = "חובה למלא את כל השדות!";
      return;
  }


  try {
      const url = 'http://localhost:3000/recipes/';
      const token = localStorage.getItem("token");
      if (!token) {
          errorMsg.textContent = "עליך להתחבר כדי להוסיף מתכון";
          return;
      }
      const res= await axios.post(url, formData, {
          headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'multipart/form-data' 
          }
      });
      
      showMessage("🎉 המתכון נוסף בהצלחה!");
      recipeForm.reset();
  } catch (error) {
      console.log(error);
      errorMsg.textContent = error.response?.data?.message || "אירעה שגיאה בהוספת המתכון";
  }

})
