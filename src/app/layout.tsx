
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
        <footer>
          <p>Copyright 2025</p>
        </footer>
      </body>
    </html>
  );
}
