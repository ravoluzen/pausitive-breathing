// Breathing techniques configuration
export const BREATHING_TECHNIQUES = {
  'technique-4-8': {
    id: 'technique-4-8',
    name: '4-8 Breathing',
    inhaleCount: 4,
    exhaleCount: 8,
    description: 'Beginner-friendly technique',
    level: 'Beginner'
  },
  'technique-7-11': {
    id: 'technique-7-11',
    name: '7-11 Breathing',
    inhaleCount: 7,
    exhaleCount: 11,
    description: 'Standard relaxation technique',
    level: 'Standard'
  },
  'technique-6-10': {
    id: 'technique-6-10',
    name: '6-10 Breathing',
    inhaleCount: 6,
    exhaleCount: 10,
    description: 'Intermediate breathing pattern',
    level: 'Intermediate'
  },
  'technique-8-12': {
    id: 'technique-8-12',
    name: '8-12 Breathing',
    inhaleCount: 8,
    exhaleCount: 12,
    description: 'Advanced deep breathing',
    level: 'Advanced'
  }
};

// Session modes configuration
export const SESSION_MODES = {
  'quick-break': {
    id: 'quick-break',
    name: 'Quick Break',
    sets: 5,
    description: '2-3 minutes',
    icon: '⚡'
  },
  'slow-down': {
    id: 'slow-down',
    name: 'Slow Down',
    sets: 15,
    description: '6-8 minutes',
    icon: '🌊'
  },
  'meditate': {
    id: 'meditate',
    name: 'Meditate',
    sets: 25,
    description: '10-15 minutes',
    icon: '🧘'
  },
  'custom': {
    id: 'custom',
    name: 'Custom',
    sets: null,
    description: 'Your choice',
    icon: '⚙️'
  }
};

// Animation and timing constants
export const ANIMATION = {
  CIRCLE_RADIUS: 120,
  STROKE_WIDTH: 8,
  TRANSITION_DURATION: 300,
  FPS: 60
};

// Color palettes for background gradients
export const COLOR_PALETTES = [
  ['#3B82F6', '#1E40AF'], // Deep Blue
  ['#14B8A6', '#0F766E'], // Ocean Teal
  ['#10B981', '#047857'], // Forest Green
  ['#8B5CF6', '#7C3AED'], // Royal Purple
  ['#F59E0B', '#D97706'], // Warm Amber
  ['#92857D', '#6B5B73'], // Earth Tones
  ['#06B6D4', '#0891B2'], // Sky Blue
  ['#84CC16', '#65A30D'], // Fresh Lime
  ['#EC4899', '#DB2777'], // Rose Pink
  ['#F97316', '#EA580C'], // Sunset Orange
  ['#6366F1', '#4F46E5'], // Indigo
  ['#22D3EE', '#0891B2'], // Cyan
  ['#A855F7', '#9333EA'], // Violet
  ['#EF4444', '#DC2626'], // Crimson
  ['#059669', '#047857'], // Emerald
  ['#7C3AED', '#5B21B6'], // Deep Purple
  ['#0D9488', '#0F766E'], // Dark Teal
  ['#DC2626', '#B91C1C'], // Ruby Red
  ['#2563EB', '#1D4ED8'], // Bright Blue
  ['#16A34A', '#15803D'], // Grass Green
];

// App states
export const APP_STATES = {
  SETUP: 'setup',
  SESSION_ACTIVE: 'session_active',
  SESSION_PAUSED: 'session_paused',
  SESSION_COMPLETE: 'session_complete'
};

// Breathing phases
export const BREATHING_PHASES = {
  INHALE: 'inhale',
  EXHALE: 'exhale',
  TRANSITION: 'transition'
};
