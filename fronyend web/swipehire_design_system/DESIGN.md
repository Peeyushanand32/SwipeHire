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
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-padding: 20px
  card-gutter: 16px
---

## Brand & Style
The brand personality is "Friendly-Professional," bridging the gap between casual social discovery and career advancement. This design system focuses on reducing the friction and anxiety of job hunting through a tactile, approachable interface.

The design style is **Modern/Mobile-First** with a heavy emphasis on high-quality whitespace and card-based interactions. It utilizes soft elevation and generous radius values to create a "comfort-first" environment. The emotional response should be one of optimism and ease, moving away from the cold, data-heavy tables typical of legacy recruitment software toward a fluid, gesture-friendly experience.

## Colors
This design system uses a vibrant, tech-forward palette dominated by Indigo and Violet to establish trust and professional authority.

- **Primary (Indigo #4F46E5):** Used for primary brand moments and navigation.
- **Secondary (Violet #7C6CF0):** Used for interactive elements and subtle gradients.
- **Accent (Coral #FF6B5C):** Reserved strictly for high-conversion actions like "Apply" or "Match" to provide maximum visual contrast.
- **Background (#F7F7FB):** An off-white, cool-toned neutral that reduces eye strain and makes the white cards pop.
- **Text (#1A1A2E):** A deep navy-black that ensures high legibility while appearing softer than pure black.

## Typography
The system relies exclusively on **Inter** to maintain a clean, systematic look. 

To achieve the "Friendly-Professional" balance, headings use **Bold (700)** or **SemiBold (600)** weights with tight letter spacing to feel impactful and modern. Body copy uses the **Medium (500)** weight rather than Regular (400) to ensure text feels substantial and legible against soft backgrounds. Label styles are used for metadata, such as salary ranges and job tags, emphasizing clarity through slightly increased letter spacing.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high horizontal margins to focus the user's attention on the central stack of cards. 

- **Mobile:** Uses a single-column layout with 20px side margins. The primary interaction area is the "Swipe Card," which should occupy roughly 80% of the viewport height.
- **Desktop:** Adopts a centered 12-column grid. Sidebars are fixed at 280px, while the main content area remains flexible.
- **Spacing Rhythm:** Based on a 4px baseline, but defaults to 16px (sm) and 24px (md) for most component spacing to maintain a "breathable" feel.

## Elevation & Depth
Depth is created using **Ambient Shadows** rather than harsh borders. This system employs two primary layers:

1.  **Base Layer:** The background (#F7F7FB) is the lowest surface.
2.  **Card Layer:** Pure white (#FFFFFF) cards use a very soft, diffused shadow: `0px 10px 30px rgba(26, 26, 46, 0.05)`.
3.  **Active/Floating Layer:** Elements being dragged or "swiped" increase their shadow spread and opacity to `0px 20px 40px rgba(26, 26, 46, 0.12)` to simulate physical lifting from the surface.

Avoid using shadows on buttons; use solid color fills to keep the interface feeling flat and modern.

## Shapes
The shape language is defined by extreme roundness to promote a friendly, non-intimidating aesthetic.

- **Cards:** All main containers must use a **20px corner radius**.
- **Buttons:** All buttons must be **Pill-shaped** (height / 2), emphasizing their touch-friendly nature.
- **Input Fields:** Use the `rounded-lg` (16px) setting to align with the card language without being fully circular.
- **Icons:** Use simple line icons with rounded caps and joins (2px stroke width).

## Components

### Buttons
- **Primary:** Pill-shaped, Coral (#FF6B5C) background with White text. Reserved for the "Apply" or "Match" actions.
- **Secondary:** Pill-shaped, Indigo (#4F46E5) background. Used for standard navigation and form submissions.
- **Ghost:** No background, Violet text. Used for "Skip" or "Back" actions.

### Cards
The centerpiece of the UI. Cards must have a 20px radius, a white background, and the defined ambient shadow. Content within cards should have 24px internal padding.

### Inputs & Forms
Inputs should feature a subtle 1px border (#E2E2EC) and a 16px radius. On focus, the border transitions to Indigo (#4F46E5) with a 4px soft outer glow in the same color at 10% opacity.

### Mobile Navigation
A bottom tab bar using a blur effect (Glassmorphism) with 70% opacity. Icons should be Indigo for active states and a muted version of the Neutral color for inactive states.

### Sidebars & Lists
Sidebars on desktop should be integrated into the grid with no background color, using spacing and bold typography to define hierarchy. List items use 12px padding and an 8px radius for hover states.

### Chips/Tags
Small, pill-shaped badges used for job requirements (e.g., "Remote", "Full-time"). Use Indigo at 10% opacity for the background and Indigo for the text to create a soft, accessible "tonal" look.