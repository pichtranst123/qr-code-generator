'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const size = 200; // Set a size for the QR code

const emojis = ["😆", "😎", "😅", "😍", "😭", "🤑", "🤮", "💩", "💀", "🫨", "🤌", "💧"];

function getRandomEmoji() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function getRandomSize() {
  const sizes = [25,30,45];
  const randomIndex = Math.floor(Math.random() * sizes.length);
  return sizes[randomIndex];
}

function generateUniquePositions(count) {
  const positions = [];
  while (positions.length < count) {
    const left = Math.floor(Math.random() * 90) + 5; // Between 5% and 95%
    if (!positions.includes(left)) {
      positions.push(left);
    }
  }
  return positions;
}

export default function QRDisplay() {
  const pathname = usePathname();
  const [qrCodes, setQrCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = pathname.split('/').pop();
    if (hash) {
      const storedQRCodes = localStorage.getItem(hash);
      if (storedQRCodes) {
        setQrCodes(JSON.parse(storedQRCodes));
      } else {
        console.error('No QR codes found for this hash in localStorage');
      }
    } else {
      console.error('No hash found in the URL');
    }
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const gifs = [
    "https://stashdrop.org/assets/images/stashdrop_money.gif",
    "https://stashdrop.org/assets/images/pile-of-poo.gif",
    "https://stashdrop.org/assets/images/stashdrop_diamond.gif"
  ];

  const gifCount = gifs.length * 6;
  const positions = generateUniquePositions(gifCount);

  const gifElements = gifs.flatMap((gif, gifIndex) => {
    return Array.from({ length: 6 }).map((_, index) => {
      const left = positions[gifIndex * 6 + index];
      const delay = Math.random() * 10; 
      const size = getRandomSize();
      return (
        <img
          key={`${gif}-${index}`}
          className="drop-gif"
          src={gif}
          alt="Dropping GIF"
          style={{ left: `${left}%`, animationDelay: `${delay}s, ${delay}s`, width: `${size}px`, height: `${size}px` }}
        />
      );
    });
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <img className="logo" src="https://stashdrop.org/assets/images/stashdrop_logo_text.svg" alt="Logo" />
      <div ref={qrRef} className="mt-8 flex flex-wrap gap-4 justify-center">
        {qrCodes.length === 0 ? (
          <p>No QR codes found for this hash.</p>
        ) : (
          qrCodes.map((qrCode, index) => (
            <div key={index} className="flex flex-col items-center m-2">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img className="qr-code" src={qrCode} width={size} height={size} alt={`Generated QR Code ${index + 1}`} />
                <img src="https://stashdrop.org/assets/images/stashdrop_money.gif" className="icon-overlay"/>
              </div>
              <p>{getRandomEmoji()}</p>
            </div>
          ))
        )}
      </div>
      <div className="message text-center mt-8 text-white opacity-35">
        Scan to get stashs 🤓☝️
      </div>
      <div className="gif-container mt-8 flex flex-wrap gap-4 justify-center">
        {gifElements}
      </div>
    </main>
  );
}