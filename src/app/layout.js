import "./globals.css";
import AuthProvider from "@/providers/SessionProvider";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
