import { VT323 } from "next/font/google";

const vt323 = VT323({ weight: "400", subsets: ['latin'] });

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${vt323.className}`}>
        {children}
      </body>
    </html>
  )
}