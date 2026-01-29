import axios from "axios";

// פונקציית אתחול סרגל החיפוש
export function initSearchBar(searchContainerSelector, searchInputId, searchButtonId, resultsClassName) {
    const searchContainer = document.querySelector(searchContainerSelector);
    const searchInput = document.getElementById(searchInputId);
    const searchBtn = document.getElementById(searchButtonId);
    const difficultyFilter = document.getElementById("difficulty-filter");
    const navToAllRecipesBtn = document.getElementById("navToAllRecipes");
    const navToCategoriesBtn = document.getElementById("navToCategories");
    const resultsDiv = document.createElement("div");
    resultsDiv.className = resultsClassName;
    searchContainer.appendChild(resultsDiv);

    function clearResults() {
        resultsDiv.innerHTML = "";
        resultsDiv.style.display = "none";
    }

    function showResults() {
        resultsDiv.style.display = "block";
    }
    //  לוגיקת החיפוש המיידי 
    let debounceTimer = null;
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            clearResults();
            return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(query), 300);
    });
    // פונקציית החיפוש המיידי
    async function performSearch(query) {
        try {
            const res = await axios.get("http://localhost:3000/recipes/search", { params: { q: query } });
            const recipes = res.data;
            resultsDiv.innerHTML = "";
            if (!recipes || recipes.length === 0) {
                resultsDiv.innerHTML = `<div class="no-results">לא נמצאו מתכונים</div>`;
            } else {
                recipes.forEach(r => {
                    const item = document.createElement("div");
                    item.className = "result-item";
                    item.textContent = r.title;
                    item.addEventListener("click", () => {
                        window.location.href = `/src/recipes/recipe/recipe.html?Id=${r._id}`;
                    });
                    resultsDiv.appendChild(item);
                });
            }
            showResults();
        } catch (err) {
            console.error("שגיאה בחיפוש:", err);
        }
    }

    // לוגיקת כפתור "חיפוש" וניווט לעמוד התוצאות 
    function goToSearchResults() {
        const query = searchInput.value.trim();
        const difficulty = difficultyFilter.value;

        const params = new URLSearchParams();
        if (query) {
            params.set("search", query);
        }

        if (difficulty) {
            params.set("difficulty", difficulty);
        }

        window.location.href = `/src/recipes/allRecipes/allRecipes.html?${params.toString()}`;
    }

    searchBtn.addEventListener("click", goToSearchResults);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goToSearchResults();
        }
    });

    // הוספת מאזין לאירוע שינוי בתיבת הבחירה של רמת הקושי
    difficultyFilter.addEventListener("change", goToSearchResults);

    // --- לוגיקת כפתורי הניווט הראשיים ---
    if (navToAllRecipesBtn) {
        navToAllRecipesBtn.addEventListener("click", () => {
            window.location.href = "/src/recipes/allRecipes/allRecipes.html";
        });
    }

    if (navToCategoriesBtn) {
        navToCategoriesBtn.addEventListener("click", () => {
            window.location.href = "/src/recipes/categories/categories.html";
        });
    }

    document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target)) {
            clearResults();
        }
    });
}

// פונקציית האתחול הראשית - ללא שינוי
export async function setupSharedSearchBar(parentSelector = 'header', htmlPath, cssPath) {
    const parentElement = document.querySelector(parentSelector);
    if (!parentElement) return;

    if (!document.querySelector(`link[href="${cssPath}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
    }
    try {
        const response = await axios.get(htmlPath);
        const htmlContent = response.data;
        parentElement.insertAdjacentHTML('beforeend', htmlContent);
        setTimeout(() => {
            initSearchBar(".search-container", "search", "searchBtn", "search-results");
            loadCategoriesForFilter();
        }, 0);
    } catch (error) {
        console.error("Error setting up shared search bar:", error);
    }
}