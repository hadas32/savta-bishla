import './style.css'
import axios from "axios";



async function loadFeaturedRecipes() {
  try {
    // קריאה לשרת להבאת רשימת מתכונים
    const res = await axios.get("http://localhost:3000/recipes/");
    const data = res.data; // האובייקט המוחזר
    const recipes = data.recipes; // המערך של המתכונים
    console.log(recipes);
    console.log(Array.isArray(recipes)); // צריך להחזיר true

    // בוחרים רק שלושה ראשונים לדוגמה
    const sampleRecipes = recipes.slice(0, 3);
console.log(sampleRecipes);
    const container = document.querySelector("#featured-recipes");
    console.log(container); // ודא שזה לא מחזיר null
    container.innerHTML = ""; // מנקים את הפלייסהולדרים

    // יוצרים כרטיסים
    sampleRecipes.forEach(r => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = ` <a href="/src/recipes/recipe/recipe.html?Id=${r._id}">
        <img src="${`http://localhost:3000${r.image}`}" alt="${r.title}" style="width:100%; border-radius:10px;">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
      </a>`;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("שגיאה בטעינת מתכונים לדף הבית:", err);
  }
}

// נטען אחרי שהעמוד נטען
document.addEventListener("DOMContentLoaded", loadFeaturedRecipes);