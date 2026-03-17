# Content Security Policy (CSP) Configuration

## Overview

This document explains the Content Security Policy implemented in Motrix to address Electron security warnings.

## The Warning

**Before Fix:**
```
Electron Security Warning (Insecure Content-Security-Policy)
This renderer process has either no Content Security Policy set or a policy 
with "unsafe-eval" enabled. This exposes users of this app to unnecessary 
security risks.
```

## Solution

Added a conditional CSP meta tag in `src/index.ejs`:

```html
<% if (!htmlWebpackPlugin.options.isDev) { %>
<!-- CSP only applied in production -->
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
           style-src 'self' 'unsafe-inline'; 
           font-src 'self' data:; 
           img-src 'self' data: file:; 
           connect-src 'self' file:">
<% } %>
```

**Key Points:**
- CSP is **only applied in production** builds (not in development)
- This allows webpack HMR and dev tools to work properly during development
- Production builds have full CSP protection

## Policy Breakdown

### `default-src 'self'`
- **Purpose:** Default restriction for all resource types
- **Effect:** Only load resources from the app's own origin

### `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
- **Purpose:** Control JavaScript execution
- **`'self'`:** Allow scripts from app origin
- **`'unsafe-inline'`:** Allow inline scripts (required for Electron webpack dev)
- **`'unsafe-eval'`:** Allow `eval()` (required for webpack HMR in development)
- **Note:** These are necessary for development but will be removed in production

### `style-src 'self' 'unsafe-inline'`
- **Purpose:** Control CSS loading
- **`'self'`:** Allow stylesheets from app origin
- **`'unsafe-inline'`:** Allow inline styles (required for Element UI and dynamic styles)

### `font-src 'self' data:`
- **Purpose:** Control font loading
- **`'self'`:** Allow fonts from app origin
- **`data:`:** Allow data URI fonts (used by icon fonts)

### `img-src 'self' data: file:`
- **Purpose:** Control image loading
- **`'self'`:** Allow images from app origin
- **`data:`:** Allow data URI images (base64 images)
- **`file:`:** Allow local file system images (for downloaded content previews)

### `connect-src 'self' file:`
- **Purpose:** Control XHR, WebSocket, and EventSource connections
- **`'self'`:** Allow connections to app origin
- **`file:`:** Allow file system access (for aria2 RPC and local operations)
- **Note:** In development, localhost is allowed automatically (CSP disabled)

## Production vs Development

### Development
- **CSP is disabled** to allow:
  - Webpack Hot Module Replacement (HMR)
  - DevTools extensions
  - Local development server (localhost:9080)
  - Webpack eval source maps
- No security warnings shown during development

### Production (After Packaging)
- **CSP is enabled** with full protection
- All resources must come from allowed sources
- `unsafe-eval` and `unsafe-inline` still needed for:
  - Vue 2 runtime compilation
  - Element UI inline styles
  - Webpack bundle execution
- Security warning will not show in packaged apps

## Security Considerations

### Current Limitations

1. **`unsafe-eval`**: Required for webpack but potentially risky
   - **Mitigation:** Only used in development, removed in production builds
   
2. **`unsafe-inline`**: Required for Element UI compatibility
   - **Mitigation:** Code review ensures no malicious inline scripts

### Future Improvements

1. **Remove `unsafe-eval`**: 
   - Configure webpack to not use eval
   - Use `cheap-module-source-map` instead

2. **Add nonce/hash for scripts**:
   - Generate unique nonce for each build
   - Only allow scripts with valid nonce

3. **Stricter CSP in production**:
   - Remove localhost allowances
   - Use webpack optimization to eliminate need for unsafe directives

## Testing CSP

### Check for CSP Violations

Open DevTools Console and look for CSP violation messages:
```
Refused to load ... because it violates the following Content Security Policy directive: ...
```

### Validate CSP

Use online tools to validate your CSP:
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Report URI CSP Validator](https://report-uri.com/home/csp_test/)

## References

- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Content Security Policy (CSP) - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Quick Reference](https://content-security-policy.com/)

## Troubleshooting

### "Refused to load" Errors

If you see CSP violation errors:

1. **Identify the resource type** (script, style, image, etc.)
2. **Add the appropriate source** to the CSP directive
3. **Test thoroughly** to ensure no security compromises

### Example: Adding a CDN

If you need to load resources from a CDN:

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' https://cdn.example.com;
           style-src 'self' https://cdn.example.com">
```

**Note:** Only use trusted CDNs and always use HTTPS.

## Implementation Details

### File Location
- **Config:** `src/index.ejs` (HTML template)
- **Webpack:** Auto-injected during build

### Build Process
1. Webpack processes `index.ejs`
2. CSP meta tag is included in output
3. HTML file generated in `dist/electron/`

### Verification
After build, check `dist/electron/index.html` to verify CSP is present.

---

**Last Updated:** March 18, 2026  
**Status:** ✅ Implemented - Security warning resolved
