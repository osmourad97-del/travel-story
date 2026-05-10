export const metadata = {
  title: "Travel Story Planner",
  description: "Plan your perfect day as a story",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
