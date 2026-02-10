// 預設品項
let defaultItems = [
    { name: "單色光療", price: 800 },
    { name: "貓眼光療", price: 1000 },
    { name: "法式指甲", price: 1200 },
    { name: "卸甲重做", price: 200 },
    { name: "造型加購", price: 500 }
];

// 從存儲中載入數據
let items = JSON.parse(localStorage.getItem('nailPrices')) || defaultItems;
let selectedItems = new Set();
let isEditMode = false;

const priceList = document.getElementById('price-list');
const totalDisplay = document.getElementById('total-price');
const editBtn = document.getElementById('edit-btn');

function render() {
    priceList.innerHTML = '';
    let total = 0;

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `price-item ${selectedItems.has(index) ? 'selected' : ''}`;

        if (isEditMode) {
            div.innerHTML = `
                <input type="text" class="edit-input" value="${item.name}" onchange="updateItem(${index}, 'name', this.value)">
                <input type="number" class="edit-price" value="${item.price}" onchange="updateItem(${index}, 'price', this.value)">
                <button onclick="removeItem(${index})">❌</button>
            `;
        } else {
            div.innerHTML = `
                <span>🐾 ${item.name}</span>
                <span>$${item.price}</span>
            `;
            div.onclick = () => toggleSelect(index);
        }

        priceList.appendChild(div);
        if (selectedItems.has(index)) total += Number(item.price);
    });

    if (isEditMode) {
        const addBtn = document.createElement('button');
        addBtn.innerText = "+ 新增品項";
        addBtn.onclick = addItem;
        addBtn.style.width = "100%";
        priceList.appendChild(addBtn);
    }

    totalDisplay.innerText = `$${total}`;
}

function toggleSelect(index) {
    if (selectedItems.has(index)) selectedItems.delete(index);
    else selectedItems.add(index);
    render();
}

function updateItem(index, key, value) {
    items[index][key] = value;
    save();
}

function addItem() {
    items.push({ name: "新服務", price: 0 });
    render();
}

function removeItem(index) {
    items.splice(index, 1);
    save();
    render();
}

function save() {
    localStorage.setItem('nailPrices', JSON.stringify(items));
}

editBtn.onclick = () => {
    isEditMode = !isEditMode;
    editBtn.innerText = isEditMode ? "✅ 完成編輯" : "⚙️ 進入編輯模式";
    if (!isEditMode) save();
    render();
};

document.getElementById('reset-btn').onclick = () => {
    selectedItems.clear();
    render();
};

render();