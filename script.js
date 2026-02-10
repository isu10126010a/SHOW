// 初始化資料
const defaultData = [
    { id: 'b', title: '🧡 基礎美甲區', items: [
        { name: "手部單色", price: 800 }, { name: "手部貓眼", price: 1000 }, { name: "卸甲重做", price: 200 }
    ]},
    { id: 'd', title: '🤍 造型設計區', items: [
        { name: "彩繪/指", price: 100 }, { name: "排鑽/指", price: 50 }, { name: "暈染/指", price: 120 }
    ]},
    { id: 'a', title: '🖤 加價專區', items: [
        { name: "延甲/指", price: 150 }, { name: "加厚健甲", price: 200 }, { name: "他店卸甲", price: 500 }
    ]}
];

// 讀取資料
let nailData = JSON.parse(localStorage.getItem('nailData_Final_Fixed')) || defaultData;
let isEditMode = false;
let counts = {}; // 用來存數量的物件 e.g., {"手部單色": 1}

function render() {
    const app = document.getElementById('main-app');
    app.innerHTML = '';

    nailData.forEach((section, sIdx) => {
        const secDiv = document.createElement('div');
        secDiv.className = 'section-card';
        secDiv.innerHTML = `<h2 class="section-title">${section.title}</h2>`;

        section.items.forEach((item, iIdx) => {
            const row = document.createElement('div');
            row.className = 'item';
            
            if (isEditMode) {
                // 修改模式
                row.innerHTML = `
                    <div class="edit-row">
                        <input type="text" style="flex:2" value="${item.name}" onchange="updateItem(${sIdx}, ${iIdx}, 'name', this.value)">
                        <input type="number" style="flex:1" value="${item.price}" onchange="updateItem(${sIdx}, ${iIdx}, 'price', this.value)">
                        <button class="btn-del" onclick="deleteItem(${sIdx}, ${iIdx})">✕</button>
                    </div>
                `;
            } else {
                // 計價模式
                const currentCount = counts[item.name] || 0;
                row.innerHTML = `
                    <div class="item-info">
                        <b>🐾 ${item.name}</b>
                        <span>$${item.price}</span>
                    </div>
                    <div class="stepper">
                        <button class="btn-s" onclick="updateCount('${item.name}', -1)" ${currentCount<=0?'disabled':''}>-</button>
                        <span class="num">${currentCount}</span>
                        <button class="btn-s" onclick="updateCount('${item.name}', 1)" ${currentCount>=10?'disabled':''}>+</button>
                    </div>
                `;
            }
            secDiv.appendChild(row);
        });

        if (isEditMode) {
            const addBtn = document.createElement('button');
            addBtn.innerText = "+ 新增品項";
            addBtn.className = "admin-btn";
            addBtn.style.marginTop = "10px";
            addBtn.onclick = () => addItem(sIdx);
            secDiv.appendChild(addBtn);
        }

        app.appendChild(secDiv);
    });
    calculateTotal();
}

function updateCount(name, delta) {
    counts[name] = (counts[name] || 0) + delta;
    if (counts[name] < 0) counts[name] = 0;
    render();
}

function updateItem(sIdx, iIdx, key, val) {
    nailData[sIdx].items[iIdx][key] = (key === 'price') ? Number(val) : val;
    save();
}

function addItem(sIdx) {
    nailData[sIdx].items.push({ name: "新項目", price: 0 });
    render();
    save();
}

function deleteItem(sIdx, iIdx) {
    nailData[sIdx].items.splice(iIdx, 1);
    render();
    save();
}

function save() {
    localStorage.setItem('nailData_Final_Fixed', JSON.stringify(nailData));
}

function calculateTotal() {
    let total = 0;
    nailData.forEach(sec => {
        sec.items.forEach(item => {
            total += (item.price * (counts[item.name] || 0));
        });
    });
    document.getElementById('total-price').innerText = `$${total}`;
}

document.getElementById('edit-mode-btn').onclick = function() {
    isEditMode = !isEditMode;
    this.innerText = isEditMode ? "✅ 完成並退出" : "⚙️ 進入修改價格模式";
    render();
};

document.getElementById('clear-btn').onclick = () => {
    counts = {};
    render();
};

// 第一次執行
render();