import { useMemo } from "react";
import "./BubbleBackground.css";

export default function BubbleBackground() {
  const bubbles = useMemo(() => {
    const total = 14;
    return Array.from({ length: total }).map((_, i) => {
      const size = 250 + Math.random() * 150;
      const top = `${Math.random() * 90}%`;
      const left = `${Math.random() * 90}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${14 + Math.random() * 10}s, 12s`;

      return (
        <div
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top,
            left,
            animationDelay,
            animationDuration,
          }}
        ></div>
      );
    });
  }, []); // ← Esto asegura que se calcula solo una vez

  return <div className="absolute inset-0 z-0 pointer-events-none">{bubbles}</div>;
}
