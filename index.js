// index.js (GitHub Pagesでホスト)

// --- ⚠️ Discord/Supabase設定値に置き換えてください ⚠️ ---
const CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID'; // あなたのDiscord Client ID
// 【重要】認証コードを受け取る場所はReplitサーバーの/callbackエンドポイント
const REDIRECT_URI = 'https://jihanki-bot-iwakazu0905.replit.app/callback'; 
const SCOPES = 'identify'; 
// Supabase設定 (商品一覧表示用)
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; 
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
// ------------------------------------------

// Supabaseクライアントの初期化
const { createClient } = supabase; // Supabaseライブラリが読み込まれている前提
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DISCORD_OAUTH_URL = 'https://discord.com/oauth2/authorize';
const authUrl = `${DISCORD_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;

// DOM要素
const loginButton = document.getElementById('loginButton');
const mainLoginButton = document.getElementById('mainLoginButton');
const welcomeMessage = document.getElementById('welcomeMessage');

function handleLoginClick() {
    window.location.href = authUrl;
}
if (loginButton) loginButton.addEventListener('click', handleLoginClick);
if (mainLoginButton) mainLoginButton.addEventListener('click', handleLoginClick);

// -----------------------------------------------------------------
// ログイン状態の確認と処理（/callbackからのリダイレクトを処理）
// -----------------------------------------------------------------
function checkLoginStatus() {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get('user_id');
    const usernameFromUrl = params.get('username');

    if (userIdFromUrl && usernameFromUrl) {
        // URLパラメータに情報があれば、localStorageに保存
        localStorage.setItem('user_id', userIdFromUrl);
        localStorage.setItem('username', usernameFromUrl);
        
        // パラメータをクリアするためにURLを書き換える (クリーンなURLにする)
        const cleanUrl = window.location.pathname;
        history.replaceState(null, '', cleanUrl); 
    }
    
    const current_user_id = localStorage.getItem('user_id');
    const current_username = localStorage.getItem('username');

    // UIの更新 (ログイン状態に応じてボタン/メッセージを切り替え)
    if (current_user_id) {
        if (loginButton) loginButton.style.display = 'none';
        if (mainLoginButton) mainLoginButton.style.display = 'none';
        if (welcomeMessage) {
            welcomeMessage.textContent = `ようこそ、${current_username}さん！`;
            welcomeMessage.style.display = 'inline';
        }
    } else {
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

/**
 * 商品データを表示するためのHTMLカードを生成します。
 * @param {object} item 商品データ
 * @param {string} sellerName 販売者名
 * @returns {string} HTML文字列
 */
function createItemCard(item, sellerName) {
    const negotiableText = item.negotiable ? '可能' : '不可';
    return `
        <div class="item-card" data-item-type="${item.item_type}">
            <h3>${item.title}</h3>
            <p>種類: ${item.item_type}</p>
            <p>値下げ交渉: ${negotiableText}</p>
            <p class="price">¥${item.price.toLocaleString()}</p>
            <p class="seller">販売者: ${sellerName}</p>
        </div>
    `;
}

// ページロード時に実行
checkLoginStatus();
