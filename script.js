const defaultData = {
    basic: [{name:"手部單色", price:800}, {name:"手部貓眼", price:1000}, {name:"卸甲重做", price:200}],
    design: [{name:"彩繪/指", price:100}, {name:"排鑽/指", price:50}, {name:"暈染/指", price:120}],
    care: [{name:"甘皮剪除", price:300}, {name:"深層去角質", price:500}, {name:"蜜蠟護理", price:600}],
    addon: [{name:"延甲/指", price:150}, {name:"加厚健甲", price:200}, {name:"他店卸甲", price:500}]
};

// 增加版本號確保強制更新數據結構
let nailData = JSON.parse(localStorage.getItem('nailData_V11')) || defaultData;
let isEditMode = false;

// 初始數量狀態
let state = {
    basic: new Array(nailData.basic.length).fill(0),
    design: new Array(nailData.design.length).fill(0),
    care: new Array(nailData.care.length).fill(0),
    addon: new Array(nailData.addon.length).fill(0)
};

function render() {
    renderList('basic-list', 'basic');
    renderList('design-list', 'design');
    renderList('care-list', 'care');
    renderList('addon-list', 'addon');
    calcTotal();
}

function renderList(elementId, sectionKey) {
    const listEl = document.getElementById(elementId);
    listEl.innerHTML = '';
    
    if (!nailData[sectionKey]) nailData[sectionKey] = []; // 防呆

    nailData[sectionKey].forEach((item, index) => {
        const div = document.createElement('div');
        const count = state[sectionKey][index] || 0;
        div.className = `item-card ${count > 0 ? 'active' : ''}`;
        
        if (isEditMode) {
            div.innerHTML = `<input type="text" style="width:60%; padding:5px; border-radius:8px; border:1px solid #ddd;" value="${item.name}" onchange="updateData('${sectionKey}', ${index}, 'name', this.value)">
                             <input type="number" style="width:30%; padding:5px; border-radius:8px; border:1px solid #ddd;" value="${item.price}" onchange="updateData('${sectionKey}', ${index}, 'price', this.value)">`;
        } else {
            div.innerHTML = `<div class="item-info"><b>🐾 ${item.name}</b><br><small>$${item.price}</small></div>
                             <div class="stepper"><button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, -1)" ${count<=0?'disabled':''}>-</button>
                             <span class="step-num">${count}</span><button class="step-btn" onclick="changeCount('${sectionKey}', ${index}, 1)" ${count>=10?'disabled':''}>+</button></div>`;
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
    localStorage.setItem('nailData_V11', JSON.stringify(nailData));
}

function calcTotal() {
    let total = 0;
    ['basic', 'design', 'care', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            if (nailData[sec][idx]) total += (nailData[sec][idx].price * count);
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

// 報價單生成
document.getElementById('gen-img-btn').onclick = function() {
    const quoteItemsEl = document.getElementById('quote-items');
    quoteItemsEl.innerHTML = '';
    let total = 0;
    let hasItem = false;

    ['basic', 'design', 'care', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            if (count > 0) {
                hasItem = true;
                const item = nailData[sec][idx];
                total += (item.price * count);
                quoteItemsEl.innerHTML += `<div class="q-row"><span>🐾 ${item.name} x ${count}</span><span>$${item.price * count}</span></div>`;
            }
        });
    });

    if (!hasItem) { alert("請先選擇服務項目喔！🐾"); return; }

    document.getElementById('quote-total-val').innerText = `$${total}`;
    document.getElementById('curr-date').innerText = new Date().toLocaleDateString();

    setTimeout(() => {
        html2canvas(document.getElementById('quote-template'), { 
            scale: 2, 
            backgroundColor: "#FFFDF9",
            useCORS: true // 允許跨域圖片(如果有外鏈圖的話)
        }).then(canvas => {
            document.getElementById('image-result').innerHTML = '';
            const img = new Image();
            img.src = canvas.toDataURL("image/png");
            document.getElementById('image-result').appendChild(img);
            document.getElementById('image-modal').style.display = "block";
        });
    }, 100);
};

// 彈窗與基礎按鈕邏輯
document.querySelector('.close-modal').onclick = () => document.getElementById('image-modal').style.display = "none";
document.getElementById('edit-mode-btn').onclick = () => { isEditMode = !isEditMode; render(); };
document.getElementById('clear-btn').onclick = () => {
    state = { 
        basic: new Array(nailData.basic.length).fill(0), 
        design: new Array(nailData.design.length).fill(0), 
        care: new Array(nailData.care.length).fill(0), 
        addon: new Array(nailData.addon.length).fill(0) 
    };
    render();
};

render();