import React from 'react';
import { X, Heart, Info } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onInfo: () => void;
  disabled?: boolean;
}

/**
 * Action dock rendered UNDER the card deck (never on top of a card),
 * so it stays in the same place no matter how many profiles are swiped.
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onInfo,
  disabled = false
}) => {
  return (
    <div className="action-dock" role="group" aria-label="Profile actions">
      {/* Pass */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        className="dock-btn dock-btn-side dock-btn-pass"
        aria-label="Pass profile"
        title="Pass (swipe left)"
      >
        <X size={26} strokeWidth={2.6} />
      </button>

      {/* Like (primary) */}
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        className="dock-btn dock-btn-like"
        aria-label="Like profile"
        title="Like (swipe right)"
      >
        <Heart size={30} strokeWidth={0} fill="#FFFFFF" className="dock-heart" />
      </button>

      {/* Details */}
      <button
        type="button"
        onClick={onInfo}
        disabled={disabled}
        className="dock-btn dock-btn-side dock-btn-info"
        aria-label="View profile details"
        title="View profile details"
      >
        <Info size={24} strokeWidth={2.3} />
      </button>
    </div>
  );
};
