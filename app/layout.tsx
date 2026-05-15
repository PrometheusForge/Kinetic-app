import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'KINETIC | The Precision Espresso Maker', // <--- Change this to change the browser tab!
  description: 'Zero electronics. Total control. The analog revolution of home espresso.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}