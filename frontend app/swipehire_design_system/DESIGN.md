---
name: SwipeHire Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad7f3'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecff'
  surface-container-high: '#e8e5ff'
  surface-container-highest: '#e2e0fc'
  on-surface: '#1a1a2e'
  on-surface-variant: '#464555'
  inverse-surface: '#2f2e43'
  inverse-on-surface: '#f2efff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5846ca'
  on-secondary: '#ffffff'
  secondary-container: '#7161e4'
  on-secondary-container: '#fffbff'
  tertiary: '#8e1914'
  on-tertiary: '#ffffff'
  tertiary-container: '#b03229'
  on-tertiary-container: '#ffd0ca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e4dfff'
  secondary-fixed-dim: '#c7bfff'
  on-secondary-fixed: '#170065'
  on-secondary-fixed-variant: '#422cb3'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#8c1713'
  background: '#fcf8ff'
  on-background: '#1a1a2e'
  surface-variant: '#e2e0fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 16px
---

## Brand & Style

The design system is built on the principle of "Professional Fluidity." It reimagines the high-stakes world of recruitment through the lens of effortless, modern social interaction. The brand personality is optimistic, efficient, and refined—striking a balance between the seriousness of a career move and the low-friction experience of a mobile-first app.

The aesthetic leans heavily into **Modern Minimalism** with a **Tactile** edge. By utilizing generous whitespace and large, rounded surfaces, the UI feels approachable and spacious, reducing the cognitive load often associated with job hunting. The interface prioritizes the "deck" metaphor, where opportunities are presented as physical objects that can be manipulated with natural gestures.

## Colors

This design system utilizes a high-energy palette centered around Indigo and Violet to convey trust and innovation. 

- **Primary Indigo & Violet**: Used for primary branding, active states, and focus indicators. These colors can be used as a subtle gradient (Indigo to Violet) to represent progress or "matching."
- **Coral Accent**: Reserved exclusively for high-impact primary actions, such as "Apply" or "Accept Match," ensuring they stand out against the cooler primary tones.
- **Background & Surfaces**: A soft off-white (`#F7F7FB`) is used for the base layer to reduce eye strain and provide a clean canvas for the elevated cards.
- **Text**: Deep Navy (`#1A1A2E`) provides superior legibility and a more premium feel than pure black.

## Typography

**Inter** is the sole typeface for this design system, chosen for its exceptional readability on mobile screens and its neutral yet modern character. 

- **Headlines**: Use Bold (700) or SemiBold (600) weights with slightly tighter letter spacing to create a strong visual anchor.
- **Body Text**: Exclusively uses Medium (500) weight instead of Regular to ensure clarity against the soft background and within cards.
- **Hierarchy**: On mobile, font sizes are capped at 32px to ensure titles do not push critical content off-viewport. For smaller labels (like job tags or metadata), use uppercase with slight letter spacing to increase scannability.

## Layout & Spacing

The design system follows a **fluid layout** tailored for native mobile environments. It uses a base-4 spacing scale to maintain rhythmic consistency.

- **Margins**: A standard horizontal margin of **20px** is applied to the main viewport to prevent content from hitting the screen edges.
- **The Deck Model**: The primary interface features a centered "Job Card" that occupies approximately 85-90% of the screen height, with 12px of spacing visible between stacked cards to indicate depth.
- **Safe Areas**: All layouts must respect the top notch/dynamic island and the bottom home indicator, ensuring actionable items like the navigation bar remain within the thumb zone.

## Elevation & Depth

Visual hierarchy is achieved through **Ambient Shadows** and **Tonal Layering**. 

- **Base Layer**: The background (`#F7F7FB`) sits at 0dp elevation.
- **The Card Layer (Floating)**: Primary swipeable cards use a medium-diffusion shadow (Y: 8px, Blur: 20px, 8% Opacity of `#1A1A2E`) to appear as if they are floating above the surface. 
- **The Interaction Layer**: Buttons and active navigation bars use a more pronounced shadow to indicate tapability.
- **Backdrop Blurs**: When modals or filters are active, a 10px backdrop blur is applied to the background to maintain context while focusing the user on the task at hand.

## Shapes

The shape language is defined by extreme roundedness to reinforce the "friendly-professional" vibe.

- **Primary Cards**: Use a fixed **20px radius**. This large radius makes the cards feel like physical, handheld objects.
- **Buttons**: All buttons are **Pill-shaped** (fully rounded edges). This distinguishes them from cards and provides a large, inviting hit area for thumbs.
- **Inputs & Small Components**: Use a 12px radius to maintain the soft aesthetic without wasting space in denser UI sections.
- **Chips**: Used for job tags (e.g., "Remote", "Full-time"), these are also pill-shaped and utilize low-opacity versions of the primary colors.

## Components

- **Buttons**:
    - *Primary Action*: Pill-shaped, Coral background, white text. Large height (56px) for easy thumb access.
    - *Secondary Action*: Pill-shaped, Indigo or Violet ghost buttons (outline or light tint).
- **The Swipe Card**: The centerpiece component. 20px corner radius, white background, containing a bold job title, company logo, and summary. It must support gesture-based "swipe right" (green tint overlay) and "swipe left" (amber tint overlay).
- **Navigation Bar**: A bottom-anchored blur-glass bar with simple line icons. The active state uses the Primary Indigo.
- **Job Tags (Chips)**: Small pill-shaped containers with medium-weight text. For example, a "Full-time" tag uses Indigo text on a 10% Indigo background.
- **Form Fields**: Clean, minimal inputs with 12px rounded corners and a subtle 1px border. On focus, the border transitions to Primary Indigo with a soft outer glow.
- **Action Bubbles**: Circular floating action buttons (FABs) located at the bottom of the card for users who prefer tapping over swiping.