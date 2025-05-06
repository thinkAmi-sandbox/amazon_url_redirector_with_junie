// このスクリプトは declarativeNetRequest API を使用して Amazon の URL をリダイレクトします
// リダイレクトルールは rules.json で定義されています

// 拡張機能がインストールまたは更新されたときにログを記録します
chrome.runtime.onInstalled.addListener(() => {
  console.log('Format Amazon URL 拡張機能がインストールされました。URL リダイレクトは declarativeNetRequest ルールによって処理されます。');
});

// declarativeNetRequest API は rules.json ファイルで定義されたルールに基づいて自動的にリダイレクトを処理します
// この rules.json ファイルは manifest.json で参照されています。
// これにより、以前の実装で発生していたページのちらつきが解消されます
// なぜなら、リダイレクトはページの読み込みが開始される前にネットワークリクエストレベルで行われるからです。
