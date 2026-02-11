/* 延續原本的 script.js ... */

// 獲取新增的 DOM 元素
const genImgBtn = document.getElementById('gen-img-btn');
const modal = document.getElementById('image-modal');
const closeModal = document.querySelector('.close');

genImgBtn.onclick = function() {
    // 1. 檢查是否有選擇項目
    let hasSelection = false;
    for (let sec in state) {
        if (state[sec].some(count => count > 0)) hasSelection = true;
    }
    
    if (!hasSelection) {
        alert("請先選擇服務項目喔！🐾");
        return;
    }

    // 2. 準備報價單樣板內容
    const quoteItemsEl = document.getElementById('quote-items');
    quoteItemsEl.innerHTML = '';
    let total = 0;

    ['basic', 'design', 'addon'].forEach(sec => {
        state[sec].forEach((count, idx) => {
            if (count > 0) {
                const item = nailData[sec][idx];
                const row = document.createElement('div');
                row.className = 'q-row';
                row.innerHTML = `<span>🐾 ${item.name} x ${count}</span><span>$${item.price * count}</span>`;
                quoteItemsEl.appendChild(row);
                total += (item.price * count);
            }
        });
    });

    document.getElementById('quote-total-val').innerText = `$${total}`;
    document.getElementById('curr-date').innerText = new Date().toLocaleDateString();

    // 3. 使用 html2canvas 截圖
    // 這裡的小延遲是為了確保 DOM 已更新
    setTimeout(() => {
        const template = document.getElementById('quote-template');
        html2canvas(template, {
            backgroundColor: "#FFF9F2",
            scale: 2 // 讓圖片更清晰
        }).then(canvas => {
            const resultArea = document.getElementById('image-result');
            resultArea.innerHTML = '';
            const img = new Image();
            img.src = canvas.toDataURL("image/png");
            resultArea.appendChild(img);
            
            // 顯示彈窗
            modal.style.display = "block";
        });
    }, 100);
};

// 關閉彈窗
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}