// sales_list.js (GitHub Pagesでホスト)

const itemListContainer = document.getElementById('itemList');
const loadingMessage = document.getElementById('loadingMessage');
const tagFilter = document.getElementById('tagFilter');
const sellerFilter = document.getElementById('sellerFilter');
const sortOrder = document.getElementById('sortOrder');

let allItems = [];
let allSellers = {}; // {user_id: username}

/**
 * 商品と販売者の全リストを取得します。
 */
async function fetchAllItems() {
    loadingMessage.textContent = '商品データを取得中です...';
    try {
        // 1. 全商品を取得
        const { data: items, error: itemsError } = await supabaseClient
            .from('sales_items')
            .select('*')
            .in('status', ['posted', 'negotiating']); // 掲載中または交渉中の商品のみ

        if (itemsError) throw itemsError;
        allItems = items;

        // 2. 販売者IDのリストを作成
        const sellerIds = [...new Set(items.map(item => item.seller_id))];
        
        // 3. (本来はDiscord APIで名前を取得するが、ここではSupabaseの別のテーブルを使うか仮定)
        // 簡易実装のため、ここではIDと仮の名称を使用します。
        // ★★★ 実際の運用ではDiscord APIで名前を取得する必要があります ★★★
        allSellers = {};
        sellerIds.forEach(id => {
            // ここでは簡易的にIDの一部を名前と見なします
            allSellers[id] = `User_${id.substring(0, 6)}`;
            // ログインユーザーの名前がlocalStorageにあればそれを使う
            if (id === localStorage.getItem('user_id')) {
                allSellers[id] = localStorage.getItem('username');
            }
        });

        // 4. フィルタリングと表示を初期化
        applyFiltersAndDisplay();

    } catch (error) {
        console.error('商品の取得中にエラーが発生:', error);
        loadingMessage.textContent = '❌ 商品の取得に失敗しました。';
    }
}

/**
 * フィルターとソートを適用して商品を表示します。
 */
function applyFiltersAndDisplay(limit = null) {
    let filteredItems = [...allItems];

    const tagValue = tagFilter ? tagFilter.value : '';
    const sellerValue = sellerFilter ? sellerFilter.value.toLowerCase() : '';
    const sortValue = sortOrder ? sortOrder.value : 'newest';

    // フィルタリング
    if (tagValue) {
        filteredItems = filteredItems.filter(item => item.item_type === tagValue);
    }
    
    if (sellerValue) {
        filteredItems = filteredItems.filter(item => {
            const sellerName = allSellers[item.seller_id] || '';
            return sellerName.toLowerCase().includes(sellerValue);
        });
    }

    // ソート
    filteredItems.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        
        if (sortValue === 'newest') {
            return dateB - dateA; // 新着順
        } else {
            return dateA - dateB; // 古い順
        }
    });
    
    // 上位N件に制限 (トップページ用)
    if (limit) {
        filteredItems = filteredItems.slice(0, limit);
    }

    // 表示
    renderItems(filteredItems);
}

/**
 * フィルタリングされた商品をDOMに描画します。
 */
function renderItems(items) {
    if (itemListContainer) {
        itemListContainer.innerHTML = ''; // クリア
    }

    if (items.length === 0) {
        const message = document.createElement('p');
        message.textContent = '該当する商品はありません。';
        itemListContainer.appendChild(message);
        return;
    }

    items.forEach(item => {
        const sellerName = allSellers[item.seller_id] || '不明な販売者';
        const cardHtml = createItemCard(item, sellerName);
        itemListContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// ページによって実行する関数を分ける
if (document.title.includes('商品一覧')) {
    tagFilter.addEventListener('change', () => applyFiltersAndDisplay());
    sellerFilter.addEventListener('input', () => applyFiltersAndDisplay());
    sortOrder.addEventListener('change', () => applyFiltersAndDisplay());
    fetchAllItems();

} else if (document.title.includes('ホーム')) {
    fetchAllItems();
}
