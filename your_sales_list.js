// your_sales_list.js (GitHub Pagesでホスト)

const itemListContainer = document.getElementById('itemList');
const loadingMessage = document.getElementById('loadingMessage');
const loginPrompt = document.getElementById('loginPrompt');

const currentUserId = localStorage.getItem('user_id');
const currentUsername = localStorage.getItem('username');

// ログインチェック
if (!currentUserId) {
    loadingMessage.style.display = 'none';
    loginPrompt.style.display = 'block';
} else {
    loginPrompt.style.display = 'none';
    fetchUserItems(currentUserId);
}

/**
 * ログインユーザーが販売中の商品を取得します。
 * @param {string} userId ログインユーザーのID
 */
async function fetchUserItems(userId) {
    loadingMessage.textContent = `${currentUsername}さんの商品を取得中です...`;
    
    try {
        const { data: items, error } = await supabaseClient
            .from('sales_items')
            .select('*')
            .eq('seller_id', userId)
            .order('created_at', { ascending: false }); // 新着順ですべて表示

        if (error) throw error;
        
        loadingMessage.style.display = 'none';
        renderUserItems(items);

    } catch (error) {
        console.error('ユーザー商品の取得中にエラーが発生:', error);
        loadingMessage.textContent = '❌ あなたの商品の取得に失敗しました。';
        loadingMessage.style.color = 'red';
    }
}

/**
 * ユーザーの商品をDOMに描画します。
 */
function renderUserItems(items) {
    itemListContainer.innerHTML = ''; // クリア

    if (items.length === 0) {
        const message = document.createElement('p');
        message.textContent = '現在販売中の商品はありません。';
        itemListContainer.appendChild(message);
        return;
    }

    items.forEach(item => {
        // 自身の販売リストではステータスも表示
        const statusText = item.status === 'negotiating' ? '⚠️ 交渉中' : (item.status === 'completed' ? '✅ 完了' : '🟢 掲載中');
        
        const negotiableText = item.negotiable ? '可能' : '不可';
        const cardHtml = `
            <div class="item-card" data-item-type="${item.item_type}">
                <h3>${item.title}</h3>
                <p>ステータス: <strong>${statusText}</strong></p>
                <p>種類: ${item.item_type}</p>
                <p>値下げ交渉: ${negotiableText}</p>
                <p class="price">¥${item.price.toLocaleString()}</p>
            </div>
        `;
        itemListContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}
