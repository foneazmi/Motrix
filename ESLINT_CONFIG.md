# ESLint Configuration for Motrix

## Overview

This project uses ESLint v10 with the new flat config format (`eslint.config.js`).

## Configuration

The ESLint configuration is defined in `eslint.config.js` at the project root.

### Key Settings

- **ECMA Version:** 2022 (supports class fields, static properties)
- **Source Type:** Module (ES6 modules)
- **Rules:** Warning-only for style rules to avoid breaking existing code

### Ignored Files

- `node_modules/`
- `dist/`
- `release/`
- `build/`
- `src/shared/locales/**/*.js` (JSON-like locale files)

## Rules

### JavaScript Files (`.js`)
- `no-console`: Off (allowed in development)
- `no-debugger`: Off (allowed in development)
- `no-unused-vars`: Warn (ignores variables starting with `_`)
- `semi`: Warn (prefer no semicolons)
- `quotes`: Warn (prefer single quotes)
- `indent`: Warn (2 spaces)

### Vue Files (`.vue`)
All style rules disabled to avoid conflicts with Vue template syntax:
- Templates have different scoping rules
- Mixed quote usage is common in templates
- Indentation varies in template structures

## Webpack Integration

ESLint is integrated into the webpack build process via `eslint-webpack-plugin`.

### Configuration

Both main and renderer webpack configs use ESLint:
- **Main process:** Lints `.js` files only
- **Renderer process:** Lints `.js` files only (Vue linting disabled due to parser issues)

### Build Behavior

- ESLint runs during webpack compilation
- Errors are reported but don't fail the build (`failOnError: false`)
- Warnings are always allowed
- Uses `eslint-friendly-formatter` for readable output

## Running ESLint

### Lint All Files
```bash
npm run lint
```

### Auto-fix Issues
```bash
npm run lint:fix
```

### Lint During Build
```bash
npm run build
```

## Known Issues

### Vue File Linting
Vue file linting is disabled in webpack due to compatibility issues between:
- ESLint v10 (flat config)
- vue-eslint-parser
- eslint-webpack-plugin

**Workaround:** Run `npm run lint` separately for Vue files.

### Style Warnings
The build will show many style warnings (semi, quotes). These are intentional:
- Existing code doesn't follow consistent style
- Warnings don't break the build
- Fix gradually over time

## Migration Notes

### From ESLint v9 to v10
- Config format changed from `.eslintrc.js` to `eslint.config.js`
- Flat config format is now required
- Some plugins may not be compatible yet

### From babel-eslint to @babel/eslint-parser
- `babel-eslint` is deprecated
- `@babel/eslint-parser` is the official replacement
- Requires `@babel/core` as a peer dependency

## Future Improvements

1. **Enable Vue linting:** Wait for eslint-webpack-plugin compatibility
2. **Stricter rules:** Gradually enable error-level rules
3. **Prettier integration:** Add formatting automation
4. **TypeScript support:** Consider migration for better type safety

## Troubleshooting

### "Could not find config file"
Ensure `eslint.config.js` exists in the project root.

### "Parsing error: Unexpected token"
Check that `ecmaVersion: 2022` is set in the config (required for class fields).

### Too many warnings
- Style warnings are expected in existing code
- Use `npm run lint:fix` to auto-fix some issues
- Focus on errors first, warnings can be fixed gradually

## References

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [eslint-webpack-plugin](https://github.com/webpack-contrib/eslint-webpack-plugin)
- [Vue ESLint Parser](https://github.com/vuejs/vue-eslint-parser)
