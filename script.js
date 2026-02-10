const defaultData = {
    basic: [
        { name: "手部單色", price: 800 },
        { name: "手部貓眼", price: 1000 },
        { name: "卸甲重做", price: 200 },
        { name: "足部單色", price: 1100 },
        { name: "足部貓眼", price: 1300 }
    ],
    design: [
        { name: "精緻彩繪/指", price: 100 },
        { name: "立體排鑽/指", price: 50 },
        { name: "鏡面造型/指", price: 80 },
        { name: "暈染設計/指", price: 120 },
        { name: "亮片夾層/指", price: 60 }
    ],
    addon: [
        { name: "延甲/指", price: 150 },
        { name: "加厚健甲", price: 200 },
        { name: "他店卸甲", price: 500 },
        { name: "甘皮保養", price: 400 },
        { name: "補鑽服務", price: 50 }
    ]
};

// 使用新版本號確保清除舊快取
let nailData = JSON.parse(localStorage.getItem('nailData_final')) || defaultData;
let isEditMode = false;

// 儲存各項目的數量
let quantities = {
    basic: new Array(nailData.basic.length).fill(0),
    design: new Array(nailData.design.length).fill(0),
    addon: new Array(nailData.addon.length).fill(0)
};

function render() {
    // 明確將三區都用同一套 renderSection 處理
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
        // 確保數量存在，否則給 0
        const count = (quantities[sectionKey][index] === undefined) ? 0 : quantities[sectionKey][index];
        
        div.className = `item-card ${count > 0 ? 'active' : ''}`;

        if (isEditMode) {
            // 編輯模式
            div.innerHTML = `
                <input type="text" class="edit-input" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" class="edit-price" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            // 正常模式 (三區統一加減號)
            div.innerHTML = `
                <div class="item-info">
                    <div style="font-weight:700;">🐾 ${item.name}</div>
                    <div style="font-size:0.8rem; color:#888;">$${item.price} / 單位</div>
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
    let currentCount = quantities[section][index] || 0;
    let newCount = currentCount + delta;
    if (newCount >= 0 && newCount <= 10) {
        quantities[section][index] = newCount;
        render(); // 重新渲染畫面
    }
}

function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_final', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        quantities[sec].forEach((count, idx) => {
            if (nailData[sec][idx]) {
                total += (nailData[sec][idx].price * count);
            }
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    document.getElementById('edit-mode-btn').innerText = isEditMode ? "✅ 完成並儲存" : "⚙️ 進入/退出修改價格模式";
    render();
};

document.getElementById('clear-btn').onclick = () => {
    // 重置所有數量為 0
    quantities = {
        basic: new Array(nailData.basic.length).fill(0),
        design: new Array(nailData.design.length).fill(0),
        addon: new Array(nailData.addon.length).fill(0)
    };
    render();
};

// 啟動！
render();