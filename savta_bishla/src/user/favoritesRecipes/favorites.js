import axios from "axios";

async function loadFavorites() {
  const container = document.querySelector("#favorites-container");

  const token = localStorage.getItem("token");
  if (!token) {
    container.innerHTML = "<p>יש להתחבר כדי לראות את המועדפים שלך</p>";
    return;
  }

  try {
    const url = `http://localhost:3000/users/Favorites`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favorites = res.data;
    container.innerHTML = ""; 

    if (!favorites.length) {
      container.innerHTML = "<p>אין לך עדיין מתכונים אהובים 💚</p>";
      return;
    }
// יצירת כרטיסים למתכונים
    favorites.forEach((recipe) => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      const img = document.createElement("img");
      img.src = `http://localhost:3000${recipe.image}`;
      img.alt = recipe.title;
      const title = document.createElement("h3");
      title.textContent = recipe.title;

      const desc = document.createElement("p");
      desc.textContent = recipe.description || "";

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons");

      const openBtn = document.createElement("button");
      openBtn.textContent = "למתכון";
      openBtn.classList.add("recipe-btn");

      openBtn.addEventListener("click", () => openRecipe(recipe._id));

      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "🗑 הסר מהמועדפים";
      removeBtn.addEventListener("click", () => removeFavorite(recipe._id));

      buttonsDiv.appendChild(openBtn);
      buttonsDiv.appendChild(removeBtn);

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(buttonsDiv);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("שגיאה בטעינת המועדפים:", error);
  }
}

async function removeFavorite(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("יש להתחבר כדי להסיר מתכון מהמועדפים");
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/users/favorites/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadFavorites(); 
  } catch (error) {
    console.error("שגיאה במחיקת מתכון מהמועדפים:", error);
  }
}

function openRecipe(id) {
  window.location.href = `/src/recipes/recipe/recipe.html?Id=${id}`;
}

loadFavorites();
