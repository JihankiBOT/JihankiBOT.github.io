// index.js

// --- ⚠️ Discord設定値に置き換えてください ⚠️ ---
// 以前のやり取りで確定した値です
const CLIENT_ID = '1426891656405450764'; 
const REDIRECT_URI = 'https://jihanki-bot-iwakazu0905.replit.app/callback'; 
const SCOPES = 'identify'; 
// ------------------------------------------

const DISCORD_OAUTH_URL = 'https://discord.com/oauth2/authorize';
const authUrl = `${DISCORD_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;

// DOM要素
const loginButton = document.getElementById('loginButton');
const mainLoginButton = document.getElementById('mainLoginButton');
const welcomeMessage = document.getElementById('welcomeMessage');

// ログインボタンのクリックイベント
function handleLoginClick() {
    window.location.href = authUrl;
}

if (loginButton) {
    loginButton.addEventListener('click', handleLoginClick);
}
if (mainLoginButton) {
    mainLoginButton.addEventListener('click', handleLoginClick);
}

// -----------------------------------------------------------------
// ログイン状態の確認と処理
// -----------------------------------------------------------------
function checkLoginStatus() {
    const params = new URLSearchParams(window.location.search);
    
    // 1. URLからユーザー情報を取得（/callbackからのリダイレクト時）
    const userIdFromUrl = params.get('user_id');
    const usernameFromUrl = params.get('username');

    if (userIdFromUrl && usernameFromUrl) {
        // URLパラメータに情報があれば、localStorageに保存
        localStorage.setItem('user_id', userIdFromUrl);
        localStorage.setItem('username', usernameFromUrl);
        
        // パラメータをクリアするためにURLを書き換える
        const cleanUrl = window.location.pathname;
        history.replaceState(null, '', cleanUrl); 
    }
    
    // 2. localStorageから現在のユーザー情報をロード
    const current_user_id = localStorage.getItem('user_id');
    const current_username = localStorage.getItem('username');

    // 3. UIの更新
    if (current_user_id) {
        // ログイン済み
        if (loginButton) loginButton.style.display = 'none';
        if (mainLoginButton) mainLoginButton.style.display = 'none';
        if (welcomeMessage) {
            welcomeMessage.textContent = `ようこそ、${current_username}さん！`;
            welcomeMessage.style.display = 'inline';
        }
    } else {
        // 未ログイン
        if (loginButton) {
            loginButton.style.display = 'block';
            loginButton.textContent = 'Discordでログイン';
        }
        if (mainLoginButton) {
            mainLoginButton.style.display = 'block';
            mainLoginButton.textContent = 'Discordでログイン';
        }
        if (welcomeMessage) welcomeMessage.style.display = 'none';
    }
}

// ページロード時に実行
checkLoginStatus();

// -----------------------------------------------------------------
// 【今後の拡張用】SupabaseのURLを定義（サーバー側のキーは不要）
// -----------------------------------------------------------------
// SupabaseのURLをここに設定しておくと、他のJSファイルでAPI呼び出しが可能になります
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // 実際のSupabase URLに置き換えてください
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // 実際のAnon Keyに置き換えてください

// -----------------------------------------------------------------
// 【今後の拡張用】商品表示のためのヘルパー関数
// -----------------------------------------------------------------
// Supabaseから取得したデータを使って商品カードのHTMLを生成する関数（ダミー）
function createItemCard(item) {
    const negotiableText = item.negotiable ? "可能" : "不可";
    const statusClass = item.status === 'negotiating' ? 'status-negotiating' : '';
    
    // 注意: 販売者名を取得するには、Discord APIか別のSupabaseテーブルが必要
    const sellerDisplay = item.seller_id; 

    return `
        <div class="item-card ${statusClass}">
            <h4 class="item-title">${item.title}</h4>
            <p><strong>種類:</strong> ${item.item_type}</p>
            <p><strong>金額:</strong> ¥${item.price.toLocaleString()}</p>
            <p><strong>値下げ交渉:</strong> ${negotiableText}</p>
            <p><strong>販売者ID:</strong> ${sellerDisplay}</p>
            <p class="item-id">ID: ${item.id.substring(0, 8)}...</p>
            <button onclick="alert('購入機能は現在構築中です。')">詳細を見る</button>
        </div>
    `;
}

// index.htmlのトップページの商品リストを更新する（ダミー）
if (document.getElementById('newItemsList')) {
    // 実際にはここでSupabaseから最新10件のデータを取得し、
    // newItemsList.innerHTML = data.map(createItemCard).join(''); で表示します。
}
