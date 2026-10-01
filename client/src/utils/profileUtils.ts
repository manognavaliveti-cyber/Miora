import { Profile, CurrentUser } from '../types';

/**
 * Calculates accurate age from a ISO/date string (e.g., '2001-05-14' or '2001-05-14T00:00:00Z').
 * Returns null if invalid or missing.
 */
export function calculateAgeFromDob(dob?: string | null): number | null {
  if (!dob || typeof dob !== 'string' || !dob.trim()) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age > 0 && age < 120 ? age : null;
}

export interface CompatibilityResult {
  score: number;
  isIncomplete: boolean;
  label: string;
}

/**
 * Calculates dynamic compatibility score between the current user and target profile.
 * Avoids hardcoded artificial 90% match scores.
 */
export function calculateCompatibilityScore(
  user?: CurrentUser | Profile | null,
  target?: Profile | null
): CompatibilityResult {
  if (!target) {
    return { score: 0, isIncomplete: true, label: 'Profile incomplete' };
  }

  const pAny = target as any;
  const uAny = user as any;

  // Check profile completeness threshold
  const targetInterests = target.interests || [];
  const targetPhotos = target.photos || [];
  const targetBio = target.bio || '';

  const isTargetIncomplete =
    targetPhotos.length === 0 ||
    targetInterests.length === 0 ||
    !targetBio.trim() ||
    (pAny.profileCompletion !== undefined && pAny.profileCompletion < 35);

  if (isTargetIncomplete || !user) {
    return {
      score: 0,
      isIncomplete: true,
      label: 'Profile incomplete'
    };
  }

  const userInterests = uAny.interests || [];
  const userIntent = uAny.relationshipIntent;

  if (userInterests.length === 0) {
    return {
      score: 0,
      isIncomplete: true,
      label: 'Profile incomplete'
    };
  }

  // Calculate interest overlap
  const shared = targetInterests.filter((i) =>
    userInterests.some((ui: string) => ui.toLowerCase() === i.toLowerCase())
  );
  
  const maxPossible = Math.max(1, Math.min(targetInterests.length, userInterests.length));
  const overlapRatio = shared.length / maxPossible;

  // Base score scaling dynamically based on actual interest overlap
  // 0 shared interests => 45%-55% base chemistry
  // 1 shared => 65-75%
  // 2+ shared => 80-95%
  let calculatedScore = Math.round(48 + overlapRatio * 42);

  // Intent alignment bonus
  if (target.relationshipIntent && userIntent && target.relationshipIntent === userIntent) {
    calculatedScore += 5;
  }

  // Proximity bonus
  if (target.distanceKm !== undefined && target.distanceKm <= 15) {
    calculatedScore += 4;
  }

  const finalScore = Math.min(98, Math.max(40, calculatedScore));

  return {
    score: finalScore,
    isIncomplete: false,
    label: `${finalScore}% Vibe Match`
  };
}
