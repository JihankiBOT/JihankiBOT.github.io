// index.js (最終修正版)

// --- ⚠️ Discord設定値に置き換えてください ⚠️ ---
const CLIENT_ID = '1426891656405450764'; 
const REDIRECT_URI = 'https://jihanki-bot-iwakazu0905.replit.app/callback'; 
const SCOPES = 'identify'; // identifyのみで十分

const DISCORD_OAUTH_URL = 'https://discord.com/oauth2/authorize';
const authUrl = `${DISCORD_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
// ------------------------------------------

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
// 【重要: 修正・追加部分】ログイン状態の確認と処理
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
        // (これにより、リロード時にURLパラメータが残りません)
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

// ----------------------------------------------------
// 【補足】商品リスト表示（ダミー）
// ----------------------------------------------------
// 本来、ここにSupabaseからデータを取得し、新着商品10個をリスト表示するJSコードが入ります。
// 例: fetch('YOUR_SUPABASE_URL/rest/v1/sales_items?order=created_at.desc&limit=10', ...)
// ----------------------------------------------------
