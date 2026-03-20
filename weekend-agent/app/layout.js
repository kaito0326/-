export const metadata = { title: "週末エージェント" };
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: "#0f0f0d" }}>{children}</body>
    </html>
  );
}
