# Design System: Shots

## Brand Direction

Shots is a photo-first editorial gallery. It uses a darkroom-inspired neutral palette, sharp edges, oversized sans-serif type, and a measured exhibition rhythm.

## Core Principles

1. **The image leads:** interface elements stay quiet and never cover a photograph with decorative labels.
2. **Each frame keeps its composition:** images retain their native proportions inside a calm, consistent grid.
3. **One visual system:** sharp corners, one pale-cyan accent, and one sans-serif family across every route.
4. **Accessible by default:** visible focus, keyboard navigation, contrast, and reduced-motion fallbacks are required.
5. **Fast by construction:** Astro image optimization, a small inline interaction layer, and no animation framework.

## Visual Language

- **Theme:** system-aware dark and light modes. Dark is an off-black darkroom; light is a cool silver gallery.
- **Typography:** Avenir Next with Helvetica fallbacks for both display and interface text.
- **Layout:** an equal two-column exhibition grid on desktop and a strict single column below 768px.
- **Shape:** all-sharp. Borders and negative space communicate hierarchy.
- **Accent:** pale cyan in dark mode and deep teal in light mode.
- **Motion:** entry reveals clarify hierarchy. Image scale communicates hover and focus. Reduced motion is static.

## Component Direction

- **Header:** 64-72px sticky bar with text links and a restrained active underline.
- **Hero:** one full-bleed portfolio photograph, one headline, one sentence, and one gallery link.
- **Gallery:** equal-width columns that preserve each photograph's composition. Captions sit below images, while the lightbox and detail pages show the full frame.
- **Filters:** text controls with underline states, not pills.
- **Lightbox:** edge-to-edge dark media viewer with keyboard, swipe, loading, and error states.
- **Photo detail:** large image followed by a sparse two-part title and EXIF layout.

## Responsive Rules

- Below 768px, the gallery becomes a single column.
- The hero uses dynamic viewport units for mobile stability.
- Captions stack below images and controls remain at least 40px tall where possible.
- The lightbox metadata moves below the image on smaller screens.
