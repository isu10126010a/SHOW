const defaultData = {
    basic: [
        { name: "手部單色", price: 800 },
        { name: "手部貓眼", price: 1000 },
        { name: "卸甲重做", price: 200 }
    ],
    design: [
        { name: "彩繪/指", price: 100 },
        { name: "排鑽/指", price: 50 },
        { name: "暈染/指", price: 120 }
    ],
    addon: [
        { name: "延甲/指", price: 150 },
        { name: "加厚健甲", price: 200 },
        { name: "他店卸甲", price: 500 }
    ]
};

let nailData = JSON.parse(localStorage.getItem('nailData_v7')) || defaultData;
let isEditMode = false;

let quantities = {
    basic: new Array(nailData.basic.length).fill(0),
    design: new Array(nailData.design.length).fill(0),
    addon: new Array(nailData.addon.length).fill(0)
};

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
        const count = quantities[sectionKey][index] || 0;
        div.className = `item-card ${count > 0 ? 'active' : ''}`;
        if (isEditMode) {
            div.innerHTML = `
                <input type="text" style="width:55%; padding:8px; border-radius:10px; border:1px solid #ddd;" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" style="width:30%; padding:8px; border-radius:10px; border:1px solid #ddd;" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            div.innerHTML = `
                <div class="item-info">
                    <div style="font-weight:700;">🐾 ${item.name}</div>
                    <div style="font-size:0.8rem; color:#888;">$${item.price}</div>
                </div>
                <div class="stepper">
                    <button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, -1)" ${count <= 0 ? 'disabled' : ''}>-</button>
                    <span class="step-num">${count}</span>
                    <button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, 1)" ${count >= 10 ? 'disabled' : ''}>+</button>
                </div>
            `;
        }
        listEl.appendChild(div);
    });
}

function changeCount(section, index, delta) {
    quantities[section][index] = (quantities[section][index] || 0) + delta;
    render();
}

function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_v7', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        quantities[sec].forEach((count, idx) => {
            if (nailData[sec][idx]) total += (nailData[sec][idx].price * count);
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    document.getElementById('edit-mode-btn').innerText = isEditMode ? "✅ 完成儲存" : "⚙️ 進入/退出修改價格模式";
    render();
};

document.getElementById('clear-btn').onclick = () => {
    quantities = { basic: new Array(nailData.basic.length).fill(0), design: new Array(nailData.design.length).fill(0), addon: new Array(nailData.addon.length).fill(0) };
    render();
};

render();