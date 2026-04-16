import { useRef, useState, useCallback, useEffect } from 'react';

export function useSpringTilt({ damping = 0.12, maxTilt = 14 } = {}) {
  const wrapperRef = useRef(null);
  const target = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const current = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const animFrame = useRef(null);
  const leaveTimer = useRef(null);
  const isAnimating = useRef(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const [isInteracting, setIsInteracting] = useState(false);

  const animate = useCallback(() => {
    const c = current.current;
    const t = target.current;

    c.x += (t.x - c.x) * damping;
    c.y += (t.y - c.y) * damping;
    c.sheenX += (t.sheenX - c.sheenX) * damping;
    c.sheenY += (t.sheenY - c.sheenY) * damping;

    const delta = Math.abs(t.x - c.x) + Math.abs(t.y - c.y);
    if (delta < 0.05 && !isInteracting) {
      isAnimating.current = false;
      setTilt({ x: t.x, y: t.y, sheenX: t.sheenX, sheenY: t.sheenY });
      return;
    }

    setTilt({ x: c.x, y: c.y, sheenX: c.sheenX, sheenY: c.sheenY });
    animFrame.current = requestAnimationFrame(animate);
  }, [damping, isInteracting]);

  const startAnimating = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      animFrame.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    current.current = { x: -6, y: 4, sheenX: 38, sheenY: 42 };
    setTilt({ x: -6, y: 4, sheenX: 38, sheenY: 42 });
    const timer = setTimeout(() => {
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      startAnimating();
    }, 500);
    return () => { clearTimeout(timer); cancelAnimationFrame(animFrame.current); };
  }, []);

  const onPointerMove = useCallback((e) => {
    e.stopPropagation();
    setIsInteracting(true);
    clearTimeout(leaveTimer.current);
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const cx = px - 0.5;
    const cy = py - 0.5;

    target.current = {
      x: -(cy * maxTilt * 2),
      y: cx * maxTilt * 2,
      sheenX: 30 + px * 40,
      sheenY: 30 + py * 40,
    };
    startAnimating();
  }, [maxTilt, startAnimating]);

  const onPointerLeave = useCallback(() => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      setIsInteracting(false);
      startAnimating();
    }, 300);
  }, [startAnimating]);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    onPointerMove({ clientX: touch.clientX, clientY: touch.clientY, stopPropagation: () => {} });
  }, [onPointerMove]);

  const tiltStyle = {
    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return {
    wrapperRef,
    tiltStyle,
    sheenPosition: { x: tilt.sheenX, y: tilt.sheenY },
    handlers: { onPointerMove, onPointerLeave, onTouchMove },
    isInteracting,
  };
}
