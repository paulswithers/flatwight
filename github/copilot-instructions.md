# Project Details

This is a repository for a modern website built using Vite and vanilla JavaScript. The project is designed to be fast, efficient, and easy to maintain.

## CSP

The website implements a strict Content Security Policy (CSP) to enhance security and prevent various types of attacks, such as Cross-Site Scripting (XSS). The CSP is configured to allow only trusted sources for scripts, styles, and other resources.

Inline styles and scripts are avoided to comply with the CSP, ensuring that all code is loaded from external files or trusted sources.

## CSS

The project uses modern CSS techniques, including CSS variables, Flexbox, and Grid layout, to create a responsive and visually appealing design. The styles are organized in a modular fashion, making it easy to maintain and update the design as needed.

Classes and psuedo-classes should be nested and descriptive to enhance readability and maintainability. E.g.

```css
.:root {
  --primary-color: #3498db;
  --primary-color-dark: #2980b9;
  --primary-color-light: #5dade2;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .header {
    font-size: 2em;
    margin-bottom: 10px;
  }

  .content {
    font-size: 1em;
    line-height: 1.5;
  }
}
.button {
  background-color: var(--primary-color);
  border: none;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-color-dark);
  }

  &.active {
    background-color: var(--primary-color-light);
  }
}
```

Container queries are used to create responsive components that adapt to their parent container's size, enhancing the overall user experience across different devices.

```css
.main-area {
    container: main / inline-size;
}

.card {
  container-type: inline-size;
  padding: 20px;
  border: 1px solid #ccc;
}

@container main (min-width: 600px) {
  .card {
    background-color: #f0f0f0;
  }
}
@container main (max-width: 599px) {
  .card {
    background-color: #ffffff;
  }
}
```