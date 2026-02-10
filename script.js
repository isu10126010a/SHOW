const defaultData = {
    basic: [
        { name: "手部單色", price: 800 },
        { name: "手部貓眼", price: 1000 },
        { name: "卸甲重做", price: 200 }
    ],
    design: [
        { name: "精緻彩繪", price: 100 },
        { name: "立體排鑽", price: 50 },
        { name: "鏡面造型", price: 80 }
    ],
    addon: [
        { name: "延甲/指", price: 150 },
        { name: "加厚健甲", price: 200 },
        { name: "補鑽服務", price: 50 }
    ]
};

let nailData = JSON.parse(localStorage.getItem('nailData_v4')) || defaultData;
let isEditMode = false;

// 儲存選擇數量 { basic: [0,1,0], design: [2,0,5], ... }
let state = {
    basic: new Array(nailData.basic.length).fill(0),
    design: new Array(nailData.design.length).fill(0),
    addon: new Array(nailData.addon.length).fill(0)
};

function render() {
    renderList('basic-list', 'basic', false); // 第一區不使用 Stepper (點擊選取)
    renderList('design-list', 'design', true); // 第二區使用 Stepper
    renderList('addon-list', 'addon', true);   // 第三區使用 Stepper
    calcTotal();
}

function renderList(elementId, sectionKey, useStepper) {
    const listEl = document.getElementById(elementId);
    listEl.innerHTML = '';

    nailData[sectionKey].forEach((item, index) => {
        const div = document.createElement('div');
        const count = state[sectionKey][index] || 0;
        div.className = `item-card ${count > 0 ? 'selected' : ''}`;

        if (isEditMode) {
            div.innerHTML = `
                <input type="text" class="edit-input" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                <input type="number" class="edit-price" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">
            `;
        } else {
            if (useStepper) {
                // 數字選擇器 HTML
                div.innerHTML = `
                    <span>🐾 ${item.name} ($${item.price})</span>
                    <div class="stepper">
                        <button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, -1)" ${count <= 0 ? 'disabled' : ''}>-</button>
                        <span class="step-num">${count}</span>
                        <button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, 1)" ${count >= 10 ? 'disabled' : ''}>+</button>
                    </div>
                `;
            } else {
                // 第一區的簡單點擊切換
                div.innerHTML = `<span>🐾 ${item.name}</span><span>$${item.price}</span>`;
                div.onclick = () => {
                    state[sectionKey][index] = (state[sectionKey][index] === 0) ? 1 : 0;
                    render();
                };
            }
        }
        listEl.appendChild(div);
    });
}

function changeCount(section, index, delta) {
    let newCount = (state[section][index] || 0) + delta;
    if (newCount >= 0 && newCount <= 10) {
        state[section][index] = newCount;
        render();
    }
}

function updateData(section, index, key, value) {
    nailData[section][index][key] = (key === 'price') ? Number(value) : value;
    localStorage.setItem('nailData_v4', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            total += (nailData[sec][idx].price * count);
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

document.getElementById('edit-mode-btn').onclick = () => {
    isEditMode = !isEditMode;
    document.getElementById('edit-mode-btn').innerText = isEditMode ? "✅ 完成並儲存" : "⚙️ 修改品項與價格";
    render();
};

document.getElementById('clear-btn').onclick = () => {
    state = {
        basic: new Array(nailData.basic.length).fill(0),
        design: new Array(nailData.design.length).fill(0),
        addon: new Array(nailData.addon.length).fill(0)
    };
    render();
};

render();