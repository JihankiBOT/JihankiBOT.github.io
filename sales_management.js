// sales_management.js

// 【重要】Replitボットの公開URLに置き換えてください (main.pyがあるURL)
const BOT_API_URL = 'https://jihanki-bot-iwakazu0905.replit.app/api/new_sale'; 

const saleForm = document.getElementById('saleForm');
const itemTypeSelect = document.getElementById('itemType');
const otherTypeInput = document.getElementById('otherType');
const messageElement = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

// 「その他」選択時の処理
itemTypeSelect.addEventListener('change', () => {
    if (itemTypeSelect.value === 'その他') {
        otherTypeInput.style.display = 'block';
        otherTypeInput.required = true;
    } else {
        otherTypeInput.style.display = 'none';
        otherTypeInput.required = false;
    }
});

// フォーム送信処理
saleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageElement.textContent = 'データを送信中です...';
    messageElement.style.color = '#5865f2';
    submitBtn.disabled = true;

    // ログインユーザーIDを取得 (index.jsがlocalStorageに保存済み)
    const sellerId = localStorage.getItem('user_id'); 
    
    if (!sellerId) {
        messageElement.textContent = '❌ 販売を開始するには、Discordでログインしてください。';
        messageElement.style.color = 'red';
        submitBtn.disabled = false;
        return;
    }

    // データの収集
    const negotiableValue = document.querySelector('input[name="negotiable"]:checked').value === 'true';
    
    let itemType = itemTypeSelect.value;
    if (itemType === 'その他') {
        itemType = otherTypeInput.value.trim();
        if (!itemType) {
            messageElement.textContent = '「その他」を選択した場合、種類を記入してください。';
            submitBtn.disabled = false;
            return;
        }
    }

    const formData = {
        item_type: itemType,
        title: document.getElementById('title').value.trim(),
        price: parseInt(document.getElementById('price').value.trim(), 10), 
        negotiable: negotiableValue, 
        seller_id: sellerId 
    };

    // DiscordボットAPIへのPOSTリクエスト
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
            messageElement.textContent = `✅ 販売を開始しました！Discordチャンネルに投稿されました。商品ID: ${result.id}`;
            messageElement.style.color = 'green';
            saleForm.reset(); 
            otherTypeInput.style.display = 'none';

        } else {
            messageElement.textContent = `❌ 販売開始に失敗しました。エラー: ${result.error || response.statusText}`;
            messageElement.style.color = 'red';
        }

    } catch (error) {
        console.error('API連携エラー:', error);
        messageElement.textContent = '❌ ネットワーク接続エラー、またはAPIがダウンしています。';
        messageElement.style.color = 'red';
    } finally {
        submitBtn.disabled = false;
    }
});
