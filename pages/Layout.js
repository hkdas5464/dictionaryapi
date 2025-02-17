// app/layout.js
import ThemeProvider from '../components/ThemeProvider';
import '../styles/globals.css';

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
