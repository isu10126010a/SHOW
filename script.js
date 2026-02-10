let defaultItems = [
    { name: "單色光療", price: 800 },
    { name: "法式設計", price: 1200 },
    { name: "精緻卸甲", price: 300 },
    { name: "保養護理", price: 500 }
];

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
                <input type="text" style="width:50%" value="${item.name}" onchange="updateItem(${index}, 'name', this.value)">
                <input type="number" style="width:25%" value="${item.price}" onchange="updateItem(${index}, 'price', this.value)">
                <button onclick="removeItem(${index})">❌</button>
            `;
        } else {
            div.innerHTML = `<span>🐾 ${item.name}</span><span>$${item.price}</span>`;
            div.onclick = () => {
                if(selectedItems.has(index)) selectedItems.delete(index);
                else selectedItems.add(index);
                render();
            };
        }
        priceList.appendChild(div);
        if (selectedItems.has(index)) total += Number(item.price);
    });

    if (isEditMode) {
        const addBtn = document.createElement('button');
        addBtn.innerText = "+ 新增服務品項";
        addBtn.style = "width:100%; padding:10px; margin-top:10px; background:#ddd; border:none; border-radius:10px;";
        addBtn.onclick = () => { items.push({name:"新服務", price:0}); render(); };
        priceList.appendChild(addBtn);
    }
    totalDisplay.innerText = `$${total}`;
}

function updateItem(index, key, value) {
    items[index][key] = value;
    save();
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
    editBtn.innerText = isEditMode ? "✅ 儲存修改" : "⚙️ 編輯價格";
    if (!isEditMode) render();
    else render();
};

document.getElementById('reset-btn').onclick = () => {
    selectedItems.clear();
    render();
};

render();