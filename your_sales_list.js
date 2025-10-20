// your_sales_list.js

const yourSalesItemsGrid = document.getElementById('yourSalesItemsGrid');
const loadingMessage = document.getElementById('loadingMessage');

async function loadYourSalesItems() {
    const current_user_id = localStorage.getItem('user_id');

    if (!current_user_id) {
        yourSalesItemsGrid.innerHTML = '<p>あなたの販売商品を表示するには、<a href="index.html">Discordでログイン</a>してください。</p>';
        return;
    }

    loadingMessage.textContent = 'あなたの販売商品を読み込み中です...';

    try {
        // Supabaseクエリ: ログインユーザーのIDに一致する商品を新しい順で取得
        let query = `sales_items?select=*&seller_id=eq.${current_user_id}&order=created_at.desc`;
        
        // **代替のダミーデータ（動作確認用）**
        const data = [
            { id: 'my123...', title: '私の最新出品', item_type: 'ぷにぷに垢', price: 5000, negotiable: true, seller_id: current_user_id, status: 'posted'},
            { id: 'my456...', title: '値下げ可能アカウント', item_type: 'その他', price: 10000, negotiable: true, seller_id: current_user_id, status: 'negotiating'},
        ];

        if (data.length === 0) {
            yourSalesItemsGrid.innerHTML = '<p>現在販売中の商品はありません。</p>';
        } else {
            yourSalesItemsGrid.innerHTML = data.map(createItemCard).join('');
        }
        
    } catch (error) {
        console.error('販売データ取得エラー:', error);
        yourSalesItemsGrid.innerHTML = '<p>販売データの読み込みに失敗しました。</p>';
    } finally {
        loadingMessage.style.display = 'none';
    }
}

// ページロード時に実行
loadYourSalesItems();
