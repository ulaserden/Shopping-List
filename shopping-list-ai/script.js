const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const themeToggleBtn = document.getElementById("theme-toggle");

let items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
let activeFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    render();
    initTheme(); // Sayfa açıldığında temayı yükle
    shoppingForm.addEventListener("submit", handleFormSubmit);
    filterButtons.forEach(btn => btn.addEventListener("click", handleFilterSelection));
    themeToggleBtn.addEventListener("click", toggleTheme); // Temayı değiştirme tetikleyicisi
});

// --- TEMA FONKSİYONLARI ---
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
    const icon = themeToggleBtn.querySelector("i");
    if (isLight) {
        icon.className = "bi bi-sun-fill";
    } else {
        icon.className = "bi bi-moon-stars";
    }
}

// --- LİSTE FONKSİYONLARI ---
function render() {
    localStorage.setItem("shoppingItems", JSON.stringify(items));

    shoppingList.innerHTML = items
        .filter(item => activeFilter === "all" || (activeFilter === "completed" ? item.completed : !item.completed))
        .map(item => `
            <li class="luxury-item" data-id="${item.id}" ${item.completed ? "item-completed" : ""}>
                <input type="checkbox" class="custom-checkbox" ${item.completed ? "checked" : ""} onchange="toggleCompleted('${item.id}', this)">
                
                <div class="item-name" contenteditable="${!item.completed}" 
                     onblur="updateItemName('${item.id}', this.textContent)" 
                     onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}">
                     ${item.name}
                </div>
                
                <i class="bi bi-trash3 delete-icon" onclick="removeItem('${item.id}')"></i>
            </li>
        `).join("");
}

function handleFormSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("item_name");
    if (!input || !input.value.trim()) return;

    items.push({ id: Date.now().toString(), name: input.value.trim(), completed: false });
    input.value = "";
    render();
}

window.toggleCompleted = (id, checkbox) => {
    items = items.map(item => item.id === id ? { ...item, completed: checkbox.checked } : item);
    render();
};

window.removeItem = (id) => {
    items = items.filter(item => item.id !== id);
    render();
};

window.updateItemName = (id, newName) => {
    items = items.map(item => item.id === id ? { ...item, name: newName.trim() } : item);
    render();
};

function handleFilterSelection(e) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    
    activeFilter = e.target.getAttribute("item-filter") || "all";
    render();
}