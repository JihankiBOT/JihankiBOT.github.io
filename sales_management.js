// sales_management.js (GitHub Pagesでホスト)

// 【🔥🔥🔥 API送信先はReplitサーバーのURLです 🔥🔥🔥】
const BOT_API_URL = 'https://jihanki-bot-iwakazu0905.replit.app/api/new_sale'; 

const saleForm = document.getElementById('saleForm');
const itemTypeSelect = document.getElementById('itemType');
const otherTypeInput = document.getElementById('otherType');
const otherTypeGroup = document.getElementById('otherTypeGroup');
const messageElement = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const loginPrompt = document.getElementById('loginPrompt');

const sellerId = localStorage.getItem('user_id'); 

// ログインチェック
if (!sellerId) {
    saleForm.style.display = 'none';
    loginPrompt.style.display = 'block';
} else {
    saleForm.style.display = 'block';
    loginPrompt.style.display = 'none';
}

// 「その他」選択時の処理
itemTypeSelect.addEventListener('change', () => {
    if (itemTypeSelect.value === 'その他') {
        otherTypeGroup.style.display = 'block';
        otherTypeInput.required = true;
    } else {
        otherTypeGroup.style.display = 'none';
        otherTypeInput.required = false;
    }
});

// フォーム送信処理
saleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageElement.textContent = 'データを送信中です...';
    messageElement.style.color = '#5865f2';
    submitBtn.disabled = true;

    if (!document.getElementById('agreement').checked) {
        messageElement.textContent = '❌ 同意チェックボックスにチェックを入れてください。';
        messageElement.style.color = 'red';
        submitBtn.disabled = false;
        return;
    }

    let itemType = itemTypeSelect.value;
    if (itemType === 'その他') {
        itemType = otherTypeInput.value.trim() || 'その他(未記入)';
    }

    const negotiableRadio = document.querySelector('input[name="negotiable"]:checked');
    const negotiableValue = negotiableRadio ? negotiableRadio.value === 'true' : false;

    const formData = {
        item_type: itemType, // ①種類
        title: document.getElementById('title').value.trim(), // ②タイトル
        price: parseInt(document.getElementById('price').value.trim(), 10), // ③金額
        negotiable: negotiableValue, // ④値下げ交渉の可否
        seller_id: sellerId // ログインユーザーID
    };
    
    // 金額のバリデーション
    if (isNaN(formData.price) || formData.price <= 0) {
        messageElement.textContent = '❌ 金額を正しく半角数字で入力してください。';
        messageElement.style.color = 'red';
        submitBtn.disabled = false;
        return;
    }

    // DiscordボットAPI（Replitサーバー）へのPOSTリクエスト
    try {
        const response = await fetch(BOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageElement.textContent = `✅ 販売を開始しました！商品ID: ${result.id}`;
            messageElement.style.color = '#43b581';
            saleForm.reset();
            otherTypeGroup.style.display = 'none'; // その他をリセット
        } else {
            messageElement.textContent = `❌ 販売開始に失敗しました: ${result.error || '不明なエラー'}`;
            messageElement.style.color = 'red';
        }

    } catch (error) {
        messageElement.textContent = `❌ ネットワークエラーが発生しました: ${error.message}`;
        messageElement.style.color = 'red';
    } finally {
        submitBtn.disabled = false;
    }
});
