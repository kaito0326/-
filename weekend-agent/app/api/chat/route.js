export async function POST(req) {
  const { messages } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY が設定されていません" }, { status: 500 });
  }

  const SYSTEM = `あなたは立川市在住ユーザーの週末プランニングエージェントです。

【ユーザープロフィール】
- 趣味: 一眼レフ写真撮影、アウトドア・自然、文化・アート、コーヒー
- スタイル: 一人行動
- 予算: ほどほど（1日2,000〜5,000円程度）
- 交通: 中央線・南武線・多摩モノレール（立川市在住）

【行動範囲の目安】
- 近場（〜30分）: 昭島・国立・日野・高幡不動・多摩センター・立川市内
- 中距離（30〜60分）: 八王子・府中・調布・三鷹・青梅
- 遠出（1時間〜）: 奥多摩・高尾山・川崎・横浜・新宿

【提案のルール】
1. 具体的なスポット名を挙げる（公園・カフェ・ギャラリー・撮影ポイントなど）
2. 時間の流れ（朝→昼→夕など）を簡潔に示す
3. 写真撮影のポイントがあれば必ず添える（光の方向・おすすめの時間帯など）
4. 交通手段と所要時間を明記する
5. 予算目安を示す
6. 天気・季節に言及があればそれを反映する
7. 返答は簡潔に。読みやすさを優先する。`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return Response.json({ error: data.error?.message || "APIエラー" }, { status: 500 });
    }

    const reply = data.content?.map((b) => b.text || "").join("") || "応答を取得できませんでした。";
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
