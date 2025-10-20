// sales_list.js

const salesItemsGrid = document.getElementById('salesItemsGrid');
const applyFiltersBtn = document.getElementById('applyFilters');

// Supabaseクライアントの初期化 (index.jsから定数を取得)
// const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // 正しい初期化方法

applyFiltersBtn.addEventListener('click', () => {
    loadSalesItems();
});

async function loadSalesItems() {
    salesItemsGrid.innerHTML = '<p>データを読み込み中です...</p>';
    
    const filterType = document.getElementById('filterType').value;
    const filterSeller = document.getElementById('filterSeller').value.trim();
    const sortOrder = document.getElementById('sortOrder').value;

    let query = `sales_items?select=*`;
    
    // フィルターの構築（Supabaseのクエリパラメータとして）
    if (filterType) {
        query += `&item_type=eq.${filterType}`;
    }
    if (filterSeller) {
        query += `&seller_id=eq.${filterSeller}`;
    }
    
    // ステータスは'posted'のみを表示
    query += `&status=eq.posted`;
    
    // 並び替え
    query += `&order=created_at.${sortOrder}`;
    
    try {
        // 【注意】fetch()でのSupabase API呼び出しの雛形
        // 実際には、適切なヘッダーとURLでfetchを実行する必要があります
        // const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
        //     headers: { 'apikey': SUPABASE_ANON_KEY }
        // });
        // const data = await response.json();
        
        // **代替のダミーデータ（動作確認用）**
        const data = [
            { id: 'a1b2c3d4...', title: '最強アカウント', item_type: 'ぷにぷに石垢', price: 15000, negotiable: true, seller_id: '12345...' , status: 'posted'},
            { id: 'e5f6g7h8...', title: '初期アカウント', item_type: 'バウンティ石垢', price: 3000, negotiable: false, seller_id: '98765...' , status: 'posted'},
        ];

        if (data.length === 0) {
            salesItemsGrid.innerHTML = '<p>該当する商品はありません。</p>';
        } else {
            salesItemsGrid.innerHTML = data.map(createItemCard).join('');
        }

    } catch (error) {
        console.error('商品データ取得エラー:', error);
        salesItemsGrid.innerHTML = '<p>商品データの読み込みに失敗しました。</p>';
    }
}

// ページロード時に実行
loadSalesItems();
