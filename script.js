// 初始資料
const defaultData = {
    basic: [
        { name: "手部單色", price: 800 },
        { name: "足部單色", price: 1000 },
        { name: "手部貓眼", price: 900 },
        { name: "足部貓眼", price: 1100 },
        { name: "法式指甲", price: 1200 }
    ],
    design: [
        { name: "暈染設計", price: 1500 },
        { name: "手繪花磚", price: 1800 },
        { name: "立體排鑽", price: 1600 },
        { name: "鏡面粉造型", price: 1400 },
        { name: "幾何線條", price: 1300 }
    ],
    addon: [
        { name: "精緻卸甲", price: 300 },
        { name: "他店卸甲", price: 500 },
        { name: "延甲/指", price: 150 },
        { name: "加厚健甲", price: 200 },
        { name: "甘皮深層保養", price: 400 }
    ]
};

// 從儲存空間載入或使用預設
let nailData = JSON.parse(localStorage.getItem('nailData_v3')) || defaultData;
let selectedItems = { basic: [], design: [], addon: [] };
let isEditMode = false;

function render() {
    renderSection('basic-list', 'basic');
    renderSection('design-list', 'design');
    renderSection('addon-list', 'addon');
    calcTotal();
}

function renderSection(elementId, sectionKey) {
    const listEl = document.getElementById(elementId);
    listEl.innerHTML = '';

    nailData[sectionKey].forEach((item, index) => {
        const div = document.createElement('div');
        const isSelected = selectedItems[sectionKey].includes(index);
        div.className = `item-card ${isSelected ? 'selected' : ''}`;

        if (isEditMode) {
            div.innerHTML = `
                <input type="text" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            div.innerHTML = `<span>🐾 ${item.name}</span><span>$${item.price}</span>`;
            div.onclick = () => toggleSelect(sectionKey, index);
        }
        listEl.appendChild(div);
    });
}

function toggleSelect(section, index) {
    const idx = selectedItems[section].indexOf(index);
    if (idx > -1) selectedItems[section].splice(idx, 1);
    else selectedItems[section].push(index);
    render();
}

function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_v3', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        selectedItems[sec].forEach(idx => {
            total += nailData[sec][idx].price;
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

// 切換編輯模式
document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    render();
};

// 清空選擇
document.getElementById('clear-btn').onclick = () => {
    selectedItems = { basic: [], design: [], addon: [] };
    render();
};

render();