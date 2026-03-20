# 週末エージェント

iPhoneを含むどのデバイスからもアクセスできる週末プランニングアプリです。

## Vercelへのデプロイ手順

### 1. GitHubにアップロード

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/weekend-agent.git
git push -u origin main
```

### 2. Vercelでデプロイ

1. [vercel.com](https://vercel.com) でアカウント作成（無料）
2. 「New Project」→ GitHubのリポジトリを選択
3. **Environment Variables** に以下を追加：
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...`（あなたのAPIキー）
4. 「Deploy」をクリック

デプロイ完了後、発行されたURL（例: `https://weekend-agent-xxx.vercel.app`）をiPhoneのSafariで開くだけで使えます。

## ローカルで動かす場合

```bash
# 依存関係をインストール
npm install

# .env.local を作成
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く。
