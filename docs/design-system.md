# Design System: Shots (Astro Rewrite)

## Brand Direction

Shots should feel cinematic, minimal, and premium. The photos remain the hero, while the UI stays quiet, confident, and readable.

## Core Principles

1. **Photo-first:** UI never competes with the imagery.
2. **Low-noise hierarchy:** Clear typography, restrained color, strong spacing.
3. **Accessible by default:** Focus visibility, keyboard navigation, contrast.
4. **Fast and tactile:** Subtle motion, instant feedback, no heavy client JS.

## Visual Language

- **Theme:** Dark-forward neutral palette with warm accent highlights.
- **Typography:** Serif display for identity, sans-serif for interface and metadata.
- **Layout:** Wide gallery canvas with comfortable gutters and asymmetric rhythm.
- **Motion:** Soft easing, short durations, reduced-motion support.

## Tokens

All design tokens live in `src/styles/tokens.css` and are consumed by Tailwind theme extensions.

- **Color tokens:** `--color-bg`, `--color-surface`, `--color-muted`, `--color-text`, `--color-accent`.
- **Spacing tokens:** `--space-1` to `--space-10`.
- **Radius tokens:** `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`.
- **Shadow tokens:** `--shadow-soft`, `--shadow-elevated`.
- **Timing tokens:** `--motion-fast`, `--motion-medium`, `--motion-slow`.

## Component Direction

- **Header:** Transparent at top, subtle backdrop on scroll.
- **Gallery card:** Rounded corners, gentle lift on hover, metadata reveal.
- **Filters:** Compact controls with visible active state and URL-synced state.
- **Lightbox:** Edge-to-edge media with keyboard navigation and EXIF panel.

## Responsive Rules

- Mobile first; card density increases progressively.
- Grid columns:
  - `1` on small screens
  - `2` on medium
  - `3` on large
  - `4` on extra large

## Accessibility Rules

- Minimum contrast ratio of 4.5:1 for body text.
- All interactive controls keyboard accessible.
- Focus ring always visible on keyboard navigation.
- Respect `prefers-reduced-motion`.

