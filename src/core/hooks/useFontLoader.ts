import {useEffect, useState} from 'react';

export default function useFontLoader(
  fontName: string,
  fontUrl: string,
): boolean {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace(fontName, `url(${fontUrl})`);
        await font.load();
        document.fonts.add(font);
        setIsFontLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    };

    loadFont();
  }, [fontName, fontUrl]);

  return isFontLoaded;
}
