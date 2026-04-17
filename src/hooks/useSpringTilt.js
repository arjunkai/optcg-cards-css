import { useRef, useState, useCallback, useEffect } from 'react';

// Spring settings matching pokemon-cards-css
const SPRING_INTERACT = { stiffness: 0.066, damping: 0.25 };
const SPRING_SNAPBACK = { stiffness: 0.01, damping: 0.06 };

export function useSpringTilt({ maxTilt = 14 } = {}) {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const target = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const current = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const velocity = useRef({ x: 0, y: 0, sheenX: 0, sheenY: 0 });
  const spring = useRef(SPRING_INTERACT);
  const animFrame = useRef(null);
  const leaveTimer = useRef(null);
  const lastTouch = useRef(null);
  const isAnimating = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Write transform + sheen directly to DOM — no React re-render per frame
  const applyTilt = useCallback((c) => {
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(${c.x}deg) rotateY(${c.y}deg)`;
      cardRef.current.style.setProperty('--pointer-x', `${c.sheenX}%`);
      cardRef.current.style.setProperty('--pointer-y', `${c.sheenY}%`);
    }
  }, []);

  const animate = useCallback(() => {
    const c = current.current;
    const g = target.current;
    const v = velocity.current;
    const { stiffness, damping } = spring.current;

    for (const k of ['x', 'y', 'sheenX', 'sheenY']) {
      v[k] += (g[k] - c[k]) * stiffness;
      v[k] *= (1 - damping);
      c[k] += v[k];
    }

    applyTilt(c);

    const posDelta = Math.abs(g.x - c.x) + Math.abs(g.y - c.y);
    const velDelta = Math.abs(v.x) + Math.abs(v.y);
    if (posDelta < 0.01 && velDelta < 0.01) {
      isAnimating.current = false;
      Object.assign(c, g);
      Object.assign(v, { x: 0, y: 0, sheenX: 0, sheenY: 0 });
      applyTilt(g);
      return;
    }

    animFrame.current = requestAnimationFrame(animate);
  }, [applyTilt]);

  const startAnimating = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      animFrame.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Entrance tilt — starts tilted, springs back to flat
  useEffect(() => {
    current.current = { x: -6, y: 4, sheenX: 38, sheenY: 42 };
    velocity.current = { x: 0, y: 0, sheenX: 0, sheenY: 0 };
    applyTilt(current.current);
    const timer = setTimeout(() => {
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      spring.current = SPRING_SNAPBACK;
      startAnimating();
    }, 500);
    return () => { clearTimeout(timer); cancelAnimationFrame(animFrame.current); };
  }, []);

  const onPointerMove = useCallback((e) => {
    e.stopPropagation();
    setIsInteracting(true);
    clearTimeout(leaveTimer.current);
    spring.current = SPRING_INTERACT;
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
      sheenX: px * 100,
      sheenY: py * 100,
    };
    startAnimating();
  }, [maxTilt, startAnimating]);

  const onPointerLeave = useCallback(() => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      spring.current = SPRING_SNAPBACK;
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      setIsInteracting(false);
      startAnimating();
    }, 500);
  }, [startAnimating]);

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    lastTouch.current = { x: touch.clientX, y: touch.clientY };
    setIsInteracting(true);
    clearTimeout(leaveTimer.current);
    spring.current = SPRING_INTERACT;
  }, []);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    if (!lastTouch.current) {
      lastTouch.current = { x: touch.clientX, y: touch.clientY };
      return;
    }
    const dx = touch.clientX - lastTouch.current.x;
    const dy = touch.clientY - lastTouch.current.y;
    lastTouch.current = { x: touch.clientX, y: touch.clientY };

    const sensitivity = 0.6;
    const prev = target.current;
    const max = maxTilt * 2;
    const newY = Math.max(-max, Math.min(max, prev.y + dx * sensitivity));
    const newX = Math.max(-max, Math.min(max, prev.x - dy * sensitivity));
    const sheenX = ((newY + max) / (max * 2)) * 100;
    const sheenY = ((-newX + max) / (max * 2)) * 100;

    target.current = { x: newX, y: newY, sheenX, sheenY };
    startAnimating();
  }, [maxTilt, startAnimating]);

  const onTouchEnd = useCallback(() => {
    lastTouch.current = null;
    leaveTimer.current = setTimeout(() => {
      spring.current = SPRING_SNAPBACK;
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      setIsInteracting(false);
      startAnimating();
    }, 500);
  }, [startAnimating]);

  return {
    wrapperRef,
    cardRef,
    handlers: {
      onPointerMove,
      onPointerLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onContextMenu: (e) => e.preventDefault(),
    },
    isInteracting,
  };
}
