import "./globals.css";
import { Inter } from "next/font/google";
import logo from "./logo.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Waste Bin",
  description: "Dashboard to moniter trash level and temperature real-time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Smart Waste Bin</title>
        <link rel="icon" href={logo} sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
