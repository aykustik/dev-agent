#!/usr/bin/env node

/**
 * HTML/CSS Expertise - CLI Tool
 * Component generation, responsive design, accessibility
 */

class HTMLCSS {
  generate_component(options) {
    const { component, style = 'css' } = options;
    
    let html = '';
    let css = '';
    
    switch (component) {
      case 'button':
        html = `<button class="btn" type="button">
  Button Text
</button>`;
        css = `.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}`;
        break;
        
      case 'card':
        html = `<article class="card">
  <header class="card__header">
    <h2>Card Title</h2>
  </header>
  <div class="card__body">
    <p>Card content goes here.</p>
  </div>
  <footer class="card__footer">
    <button class="btn">Action</button>
  </footer>
</article>`;
        css = `.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.card__header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.card__body {
  padding: 1rem;
}

.card__footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}`;
        break;
        
      case 'form':
        html = `<form class="form" action="#" method="POST">
  <div class="form__group">
    <label class="form__label" for="input-name">Name</label>
    <input 
      class="form__input" 
      type="text" 
      id="input-name" 
      name="name"
      required
    >
  </div>
  <div class="form__group">
    <label class="form__label" for="input-email">Email</label>
    <input 
      class="form__input" 
      type="email" 
      id="input-email" 
      name="email"
      required
    >
  </div>
  <button class="btn" type="submit">Submit</button>
</form>`;
        css = `.form {
  max-width: 400px;
}

.form__group {
  margin-bottom: 1rem;
}

.form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form__input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form__input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}`;
        break;
        
      case 'navbar':
        html = `<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar__brand">
    <a href="/">Brand</a>
  </div>
  <ul class="navbar__menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`;
        css = `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar__brand a {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar__menu {
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.navbar__menu a {
  text-decoration: none;
  color: #333;
}

.navbar__menu a:hover {
  color: #007bff;
}`;
        break;
        
      case 'modal':
        html = `<dialog class="modal" id="modal">
  <div class="modal__content">
    <header class="modal__header">
      <h2>Modal Title</h2>
      <button class="modal__close" aria-label="Close">&times;</button>
    </header>
    <div class="modal__body">
      <p>Modal content goes here.</p>
    </div>
    <footer class="modal__footer">
      <button class="btn btn--secondary">Cancel</button>
      <button class="btn">Confirm</button>
    </footer>
  </div>
</dialog>`;
        css = `.modal {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 90%;
}

.modal::backdrop {
  background: rgba(0,0,0,0.5);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal__body {
  padding: 1rem;
}

.modal__footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}`;
        break;
        
      default:
        return { success: false, error: { code: 'INVALID_COMPONENT', message: `Unknown component: ${component}` } };
    }
    
    return { success: true, data: { component, style, html, css } };
  }

  make_responsive(options) {
    const { css, breakpoints } = options;
    const defaultBreakpoints = [
      { name: 'mobile', width: '480px' },
      { name: 'tablet', width: '768px' },
      { name: 'desktop', width: '1024px' }
    ];
    const bp = breakpoints || defaultBreakpoints;
    
    let responsive = css + '\n\n';
    
    for (let i = 1; i < bp.length; i++) {
      responsive += `/* ${bp[i].name} */\n`;
      responsive += `@media (min-width: ${bp[i].width}) {\n`;
      responsive += `  /* Add responsive styles here */\n}\n\n`;
    }
    
    return { success: true, data: { responsive, breakpoints: bp } };
  }

  add_accessibility(options) {
    let { html } = options;
    
    // Add basic accessibility improvements
    html = html.replace(/<img/g, '<img alt="Image"');
    html = html.replace(/<button/g, '<button type="button"');
    html = html.replace(/<input/g, '<input aria-label="Input"');
    
    // Add role if missing
    if (!html.includes('role=') && html.includes('<nav')) {
      html = html.replace(/<nav/g, '<nav role="navigation"');
    }
    
    if (!html.includes('aria-label') && html.includes('<button')) {
      html = html.replace(/<button/g, '<button aria-label="Button"');
    }
    
    return { success: true, data: { html, improvements: ['added alt attributes', 'added type to buttons', 'added aria-labels'] } };
  }

  optimize_css(options) {
    let { css } = options;
    
    // Basic optimizations
    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove extra whitespace
    css = css.replace(/\s+/g, ' ');
    
    // Shorten colors where possible
    css = css.replace(/#000000/g, '#000');
    css = css.replace(/#ffffff/g, '#fff');
    
    return { success: true, data: { optimized: css.trim(), originalLength: css.length } };
  }

  generate_grid(options) {
    const { columns = 12, gap = '1rem' } = options;
    
    const css = `.grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap};
}

/* Responsive */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(${Math.floor(columns / 2)}, 1fr);
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}`;
    
    return { success: true, data: { css, columns, gap } };
  }

  generate_flexbox(options) {
    const { direction = 'row', justify = 'flex-start', align = 'stretch' } = options;
    
    const css = `.flex {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  gap: 1rem;
}

/* Common variants */
.flex--wrap {
  flex-wrap: wrap;
}

.flex--center {
  justify-content: center;
  align-items: center;
}

.flex--between {
  justify-content: space-between;
}

.flex--column {
  flex-direction: column;
}`;
    
    return { success: true, data: { css, direction, justify, align } };
  }

  validate_html(options) {
    const { html } = options;
    const errors = [];
    const warnings = [];
    
    // Basic validation
    if (!html.includes('<html')) errors.push('Missing <html> tag');
    if (!html.includes('<head')) errors.push('Missing <head> tag');
    if (!html.includes('<body')) errors.push('Missing <body> tag');
    
    // Check for self-closing tags issues
    if (html.includes('<br>') && !html.includes('<br/>') && !html.includes('<br />')) {
      warnings.push('Consider using <br/> for self-closing');
    }
    
    // Check for alt on images
    const imgCount = (html.match(/<img/g) || []).length;
    const altCount = (html.match(/alt="/g) || []).length;
    if (imgCount > altCount) {
      warnings.push('Some images may be missing alt attributes');
    }
    
    // Check for labels with inputs
    const inputCount = (html.match(/<input/g) || []).length;
    const labelCount = (html.match(/<label/g) || []).length;
    if (inputCount > labelCount) {
      warnings.push('Some inputs may be missing labels');
    }
    
    return {
      success: errors.length === 0,
      data: {
        valid: errors.length === 0,
        errors,
        warnings,
        score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
      }
    };
  }
}

// CLI handling
const args = process.argv.slice(2);
const htmlCSS = new HTMLCSS();

const command = args[0];

switch (command) {
  case 'generate':
  case 'component': {
    const component = args[1] || 'button';
    const style = args.includes('--tailwind') ? 'tailwind' : 'css';
    const result = htmlCSS.generate_component({ component, style });
    console.log('HTML:\n' + result.data.html + '\n\nCSS:\n' + result.data.css);
    break;
  }
  case 'responsive': {
    const css = args.slice(1).join(' ');
    const result = htmlCSS.make_responsive({ css });
    console.log(result.data.responsive);
    break;
  }
  case 'a11y': {
    const html = args.slice(1).join(' ');
    const result = htmlCSS.add_accessibility({ html });
    console.log(result.data.html);
    break;
  }
  case 'grid': {
    const columns = parseInt(args[1]) || 12;
    const gap = args[2] || '1rem';
    const result = htmlCSS.generate_grid({ columns, gap });
    console.log(result.data.css);
    break;
  }
  case 'flex':
  case 'flexbox': {
    const direction = args[1] || 'row';
    const result = htmlCSS.generate_flexbox({ direction });
    console.log(result.data.css);
    break;
  }
  case 'validate': {
    const html = args.slice(1).join(' ');
    const result = htmlCSS.validate_html({ html });
    console.log(JSON.stringify(result, null, 2));
    break;
  }
  default:
    console.log(`
🔧 HTML/CSS Expertise CLI

Usage:
  html-css.js generate <component>          Generate component
  html-css.js responsive <css>              Add responsive styles
  html-css.js a11y <html>                   Add accessibility
  html-css.js grid [columns] [gap]          Generate grid layout
  html-css.js flexbox [direction]           Generate flexbox layout
  html-css.js validate <html>               Validate HTML

Components: button, card, form, navbar, modal, table
    `);
}
