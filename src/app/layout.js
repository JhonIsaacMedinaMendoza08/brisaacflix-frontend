import "./globals.css";
import Header from "./components/header.js";

export const metadata = {
  title: "BrisaacFlix",
  description: "Plataforma de películas y series",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white">
        <Header />
        <main className="pt-20">{/* padding para que no tape el header fijo */}
          {children}
        </main>
      </body>
    </html>
  );
}
