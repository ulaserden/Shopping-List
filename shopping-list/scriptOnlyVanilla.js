const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");

// Uygulama Verisi (State)
let items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
let activeFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    render();
    shoppingForm.addEventListener("submit", handleFormSubmit);
    filterButtons.forEach(btn => btn.addEventListener("click", handleFilterSelection));
});

// Arayüzü ve Veriyi Güncelleyen Ana Fonksiyon
function render() {
    localStorage.setItem("shoppingItems", JSON.stringify(items));

    shoppingList.innerHTML = items
        .filter(item => activeFilter === "all" || (activeFilter === "completed" ? item.completed : !item.completed))
        .map(item => `
            <li class="border rounded p-2 mb-1 d-flex align-items-center justify-content-between" data-id="${item.id}" ${item.completed ? "item-completed" : ""}>
                <input type="checkbox" class="form-check-input" ${item.completed ? "checked" : ""} onchange="toggleCompleted('${item.id}', this)">
                
                <div class="item-name flex-grow-1 mx-3 ${item.completed ? 'text-decoration-line-through text-muted' : ''}" 
                     contenteditable="${!item.completed}" 
                     onblur="updateItemName('${item.id}', this.textContent)" 
                     onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}">
                     ${item.name}
                </div>
                
                <i class="fs-3 bi bi-x text-danger delete-icon" style="cursor:pointer" onclick="removeItem('${item.id}')"></i>
            </li>
        `).join("");
}

function handleFormSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("item_name");
    if (!input || !input.value.trim()) return alert("Yeni değer giriniz.");

    items.push({ id: Date.now().toString(), name: input.value.trim(), completed: false });
    input.value = "";
    render();
}

// Global Fonksiyonlar (HTML içinden çağrılanlar)
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
    filterButtons.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    });
    e.target.classList.remove("btn-secondary");
    e.target.classList.add("btn-primary");
    
    activeFilter = e.target.getAttribute("item-filter") || "all";
    render();
}