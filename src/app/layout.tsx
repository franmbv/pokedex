import "./globals.css";
import Image from 'next/image';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-lime-100">
        <div className="p-6 flex justify-center items-center ">
          <Image 
            src="/images/pokemonLogo.png" 
            alt="Logo"
            width={250} 
            height={250}
            priority={true}
            style={{ width: 'auto', height: 'auto' }} 
          />
        </div>
        {children}
      </body>
    </html>
  );
}
