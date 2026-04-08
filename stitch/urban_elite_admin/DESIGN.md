# Design System Document

## 1. Overview & Creative North Star: "The Digital Concierge"

This design system is engineered to transform a standard administrative interface into a high-end editorial experience. Moving away from the cluttered, "dashboard-heavy" aesthetic of traditional SaaS, we embrace **The Digital Concierge**—a philosophy rooted in high-performance minimalism, atmospheric depth, and intentional white space.

The system breaks the "template" look by rejecting rigid borders in favor of **Tonal Layering**. It prioritizes a premium, "Linear-meets-Airbnb" feel where information is not just displayed but curated. By leveraging asymmetric layouts and a sophisticated contrast between tight Inter body text and expansive Outfit headlines, we create a mobile experience that feels as much like a luxury portfolio as it does a functional tool.

---

## 2. Colors & Surface Architecture

The color strategy is built on a foundation of "Off-White" luxury, using deep blues and purples to anchor the hierarchy.

### Core Palette (Material Convention)
- **Primary (`#021540`):** The "Midnight Blue" anchor for critical actions.
- **Secondary (`#1952cc`):** A vibrant "Electric Cobalt" for interactive elements and accents.
- **Surface (`#faf8ff`):** An airy, cool-tinted base that avoids the sterile look of pure white.
- **Functional Status:** 
  - **Pending:** Amber (Custom)
  - **Assigned:** Secondary (`#1952cc`)
  - **Confirmed:** Success (`#2CC763`)
  - **Cancelled:** Error (`#ba1a1a`)

### The "No-Line" Rule
Sectioning must **never** be achieved via 1px solid borders. Boundaries are defined exclusively through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a "pocket" of content.

### The Glass & Gradient Rule
To inject "soul" into the UI:
- **Main CTAs:** Use a subtle linear gradient from `primary` (#021540) to `primary_container` (#1a2b55).
- **Floating Elements:** Use **Glassmorphism**. Apply `surface_container_lowest` at 70% opacity with a 20px backdrop-blur. This ensures the UI feels like layered sheets of frosted glass rather than flat digital blocks.

---

## 3. Typography: The Editorial Scale

We pair the precision of **Inter** with the geometric character of **Outfit** to establish an authoritative yet modern voice.

- **Display & Headlines (Outfit):** Use `display-md` and `headline-lg` for key metrics and property titles. These should feel expansive and light.
- **Body & Labels (Inter):** Use `body-md` for data entry and `label-sm` for metadata. Inter provides the legibility required for high-speed administrative tasks.
- **Hierarchy through Weight:** High-end feel is achieved by pairing a `headline-sm` (Bold) with a `body-sm` (Regular) at 40% opacity (`on_surface_variant`).

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are largely replaced by **Surface Nesting**.

### The Layering Principle
Depth is achieved by "stacking" the `surface-container` tiers:
1. **Base:** `surface` (#faf8ff)
2. **Section:** `surface_container_low` (#f2f3ff)
3. **Interactive Card:** `surface_container_lowest` (#ffffff)

This creates a soft, natural lift.

### Ambient Shadows
When a "floating" effect is mandatory (e.g., a Bottom Sheet or Floating Action Button), use an **Ambient Shadow**:
- **Blur:** 24px - 40px
- **Spread:** -4px
- **Color:** `on_surface` (#051943) at 6% opacity.
- *Result:* A soft glow that mimics natural gallery lighting.

### The "Ghost Border"
If a container requires more definition for accessibility, use a **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Cards & Lists
*The Golden Rule: No Dividers.* 
- Separate list items using **Vertical Breathing Room**. Use spacing token `6` (1.5rem) between logical groups.
- Use `surface_container_high` as a subtle background hover state for list items instead of a bottom border.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), roundedness `md` (0.75rem), white text.
- **Secondary:** Surface-tinted background (`surface_container_highest`) with `on_primary_fixed_variant` text.
- **Touch Targets:** All interactive elements must maintain a minimum 44x44pt area to ensure thumb-friendly execution.

### Input Fields
- Avoid "Boxy" inputs. Use a subtle `surface_container_low` background with a `Ghost Border` that transitions to a `secondary` 2pt bottom-stroke only upon focus.
- Labels should use `label-md` in `on_surface_variant` for a sophisticated, "understated" look.

### Status Chips
- Use the `full` (9999px) roundedness scale.
- **Style:** Low-saturation backgrounds with high-saturation text (e.g., Pending: Pale Amber background / Deep Amber text). This prevents the "traffic light" effect from overpowering the premium aesthetic.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use `xl` (1.5rem) corner radii for large property cards to emphasize the "Luxury SaaS" feel.
- **Do** use asymmetric spacing (e.g., more top padding than bottom) to create an editorial flow.
- **Do** use `backdrop-blur` on navigation bars to allow property imagery to bleed through subtly.

### Don’t:
- **Don’t** use pure black (#000000). Always use `primary` (#021540) or `on_surface` for text to maintain tonal depth.
- **Don’t** use standard "Material Design" shadows. They are too heavy for a luxury real estate context.
- **Don’t** use dividers to separate content. Use the spacing scale (Token `4` or `8`) to create "visual silences."