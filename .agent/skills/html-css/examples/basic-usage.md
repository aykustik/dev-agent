# HTML CSS Examples

## Responsive Layout

### CSS Grid
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### Flexbox
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

---

## Accessibility

### ARIA Labels
```html
<button aria-label="Close menu">
  <span aria-hidden="true">&times;</span>
</button>
```

---

## Using with Skill Loader

```bash
node .agent/core/scripts/skill-loader.js find css
```

---

## Best Practices

- Use semantic HTML elements
- Ensure color contrast WCAG AA
- Add alt text to images
- Use CSS custom properties for theming
