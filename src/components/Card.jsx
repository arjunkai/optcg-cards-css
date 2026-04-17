import { useSpringTilt } from '../hooks/useSpringTilt';
import './Card.css';

import '../effects/holo.css';
import '../effects/textured-holo.css';
import '../effects/gold-textured.css';
import '../effects/border-foil.css';
import '../effects/gold-foil.css';
import '../effects/sparkle.css';

const VALID_EFFECTS = ['holo', 'textured-holo', 'gold-textured', 'border-foil', 'gold-foil', 'sparkle', 'none'];

export default function Card({ image, effect = 'none', name = '', className = '' }) {
  const { wrapperRef, cardRef, handlers, isInteracting } = useSpringTilt();

  const hasEffect = effect !== 'none' && VALID_EFFECTS.includes(effect);

  return (
    <div
      ref={wrapperRef}
      className={`optcg-card-wrapper ${isInteracting ? 'active' : ''} ${className}`}
      style={{ WebkitTouchCallout: 'none' }}
      {...handlers}
    >
      <div
        ref={cardRef}
        className={`optcg-card ${hasEffect ? `effect-${effect}` : ''}`}
        style={{
          transform: 'rotateX(-6deg) rotateY(4deg)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <img
          src={image}
          alt={name}
          className="optcg-card__image"
          draggable={false}
        />

        {hasEffect && (
          <>
            <div className="optcg-card__shine" />
            <div className="optcg-card__glare" />
            <div className="optcg-card__texture" />
          </>
        )}
      </div>
    </div>
  );
}
