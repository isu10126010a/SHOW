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

let nailData = JSON.parse(localStorage.getItem('nailData_Stable')) || defaultData;
let isEditMode = false;
let state = {
    basic: new Array(nailData.basic.length).fill(0),
    design: new Array(nailData.design.length).fill(0),
    addon: new Array(nailData.addon.length).fill(0)
};

function render() {
    renderList('basic-list', 'basic');
    renderList('design-list', 'design');
    renderList('addon-list', 'addon');
    calcTotal();
}

function renderList(elementId, sectionKey) {
    const listEl = document.getElementById(elementId);
    listEl.innerHTML = '';

    nailData[sectionKey].forEach((item, index) => {
        const div = document.createElement('div');
        const count = state[sectionKey][index] || 0;
        div.className = `item-card ${count > 0 ? 'active' : ''}`;

        if (isEditMode) {
            div.innerHTML = `
                <input type="text" class="edit-input" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" class="edit-price" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            div.innerHTML = `
                <div class="item-info">
                    <div style="font-weight:bold;">🐾 ${item.name}</div>
                    <div style="font-size:0.85rem; color:#888;">$${item.price}</div>
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
    state[section][index] = (state[section][index] || 0) + delta;
    render();
}

function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_Stable', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            if (nailData[sec][idx]) total += (nailData[sec][idx].price * count);
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    document.getElementById('edit-mode-btn').innerText = isEditMode ? "✅ 完成儲存" : "⚙️ 修改品項與價格";
    render();
};

document.getElementById('clear-btn').onclick = () => {
    state = { basic: new Array(nailData.basic.length).fill(0), design: new Array(nailData.design.length).fill(0), addon: new Array(nailData.addon.length).fill(0) };
    render();
};

render();