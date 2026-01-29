import axios from "axios";
import { setupSharedSearchBar } from "../searchBar/searchBar.js"; 

const categoryList = document.getElementById("category-list");

function createCategoryFigure(cat) {
    const figure = document.createElement("figure");
    figure.className = "category";
    const img = document.createElement("img");
    const imgSrc = cat.image ? (cat.image.startsWith("http") ? cat.image : `http://localhost:3000${cat.image}`) : "placeholder.jpg";
    img.src = imgSrc;
    img.alt = cat.name;
    const caption = document.createElement("figcaption");
    caption.textContent = cat.name;
    figure.appendChild(img);
    figure.appendChild(caption);

    // ניווט לעמוד המתכונים של אותה קטגוריה
    figure.addEventListener("click", () => {
        window.location.href = `/src/recipes/allRecipes/allRecipes.html?category=${cat._id}`;
    });

    
    return figure;
}

// טוען קטגוריות ומציגן
async function loadCategories() {
    try {
        const res = await axios.get("http://localhost:3000/categories/");
        const categories = res.data;
        categoryList.innerHTML = "";
        categories.forEach(cat => {
            const fig = createCategoryFigure(cat);
            categoryList.appendChild(fig);
        });
    } catch (err) {
        console.error("שגיאה בטעינת קטגוריות:", err);
        categoryList.innerHTML = "<p>לא ניתן לטעון קטגוריות כרגע</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. הקמת סרגל החיפוש המשותף
    setupSharedSearchBar('header', '../searchBar/searchBar.html', '../searchBar/searchBar.css');
    // 2. טעינת הקטגוריות
    loadCategories();
});

