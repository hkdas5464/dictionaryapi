// app/layout.js
import ThemeProvider from '../components/ThemeProvider';
import { Spotlight } from '@/components/ui /Spotlight';
export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body>
<Spotlight fill="blue"/>
 
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
