export const metadata = {
  title: 'SnipTube - Home',
  description: 'SnipTube - Home',
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
