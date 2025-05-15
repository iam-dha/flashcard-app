import { useEffect, useRef } from "react";

export function useAudio(audioUrl: string | undefined) {
  if (!audioUrl) {
    console.error("Audio URL is undefined");
  }
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
  }, []);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error("Error playing sound:", err));
    }
  };

  return { playAudio };
}