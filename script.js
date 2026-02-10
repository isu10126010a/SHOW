// 初始化資料
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
        { name: "甘皮深層保養", price: 400 },
        { name: "他店卸甲", price: 500 },
        { name: "補鑽服務", price: 50 }
    ]
};

// 從 LocalStorage 讀取數據，若無則用預設
let nailData = JSON.parse(localStorage.getItem('nailData_v5')) || defaultData;
let isEditMode = false;

// 初始化數量狀態 (全部設為 0)
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
            // 編輯模式：顯示輸入框
            div.innerHTML = `
                <input type="text" class="edit-input" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" class="edit-price" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            // 正常模式：顯示加減按鈕
            div.innerHTML = `
                <div class="item-info">
                    <div style="font-weight:bold;">🐾 ${item.name}</div>
                    <div style="font-size:0.85rem; color:#888;">$${item.price} / 單位</div>
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

// 增減數量邏輯
function changeCount(section, index, delta) {
    let currentCount = state[section][index] || 0;
    let newCount = currentCount + delta;
    if (newCount >= 0 && newCount <= 10) {
        state[section][index] = newCount;
        render();
    }
}

// 編輯資料邏輯
function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_v5', JSON.stringify(nailData));
}

// 計算總價
function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            if (nailData[sec][idx]) {
                total += (nailData[sec][idx].price * count);
            }
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

// 切換編輯模式
document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    document.getElementById('edit-mode-btn').innerText = isEditMode ? "✅ 完成並儲存" : "⚙️ 修改品項與價格";
    render();
};

// 清空選擇
document.getElementById('clear-btn').onclick = () => {
    state = {
        basic: new Array(nailData.basic.length).fill(0),
        design: new Array(nailData.design.length).fill(0),
        addon: new Array(nailData.addon.length).fill(0)
    };
    render();
};

// 初次執行
render();