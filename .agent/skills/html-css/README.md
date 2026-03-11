# HTML/CSS Expertise

## Overview
The HTML/CSS Expertise skill provides comprehensive tools for modern web development including responsive design, accessibility, component generation, and CSS architecture.

## Skill Metadata
```json
{
  "name": "html-css",
  "version": "1.0.0",
  "description": "HTML and CSS expertise",
  "author": "KI-Dev-Agent Team",
  "created": "2026-03-11",
  "tags": ["html", "css", "frontend", "responsive", "accessibility", "ui"]
}
```

## Tool Descriptions

### generate_component
Generate HTML/CSS component from specification.

**Parameters:**
- `component` (required): Component type (button, card, form, navbar, modal, table)
- `style` (optional): Style approach (css, scss, tailwind, modules) - default: css

### make_responsive
Add responsive styles to CSS.

**Parameters:**
- `css` (required): CSS code to make responsive
- `breakpoints` (optional): Custom breakpoints

### add_accessibility
Add accessibility attributes to HTML.

**Parameters:**
- `html` (required): HTML code to make accessible

### optimize_css
Optimize CSS for performance.

**Parameters:**
- `css` (required): CSS code to optimize

### generate_grid
Generate CSS Grid layout.

**Parameters:**
- `columns` (optional): Number of columns - default: 12
- `gap` (optional): Gap between items - default: 1rem

### generate_flexbox
Generate Flexbox layout.

**Parameters:**
- `direction` (optional): row or column - default: row
- `justify` (optional): Justify content - default: flex-start
- `align` (optional): Align items - default: stretch

### validate_html
Validate HTML structure.

**Parameters:**
- `html` (required): HTML code to validate

## Component Templates

### Button
```html
<button class="btn" type="button">
  Click me
</button>
```

```css
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Card
```html
<article class="card">
  <div class="card-header">
    <h2>Card Title</h2>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn">Action</button>
  </div>
</article>
```

## Responsive Breakpoints

```css
/* Mobile first approach */
.container {
  width: 100%;
  padding: 0 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
  }
}
```

## Accessibility Guidelines

### Semantic HTML
```html
<!-- ❌ Bad -->
<div onclick="doSomething()">Click me</div>

<!-- ✅ Good -->
<button type="button" onclick="doSomething()">Click me</button>
```

### ARIA Labels
```html
<!-- Search input with accessible label -->
<label for="search-input">Search</label>
<input type="search" id="search-input" aria-label="Search">

<!-- Icon button with label -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>
```

### Focus Management
```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #007bff;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## CSS Best Practices

### Use CSS Custom Properties
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.btn {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
```

### BEM Naming Convention
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--dark { }
```

### Mobile-First CSS
```css
/* Base styles (mobile) */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Larger screens */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Performance Tips

1. **Minimize CSS** - Remove unused styles
2. **Use transform** - For animations, use transform instead of layout properties
3. **Containment** - Use `contain` property for isolated components
4. **Font loading** - Use `font-display: swap`
5. **Critical CSS** - Inline critical styles in HTML head

---

*Last Updated: 2026-03-11*