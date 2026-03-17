/**
 * ESLint Flat Configuration for Motrix
 * Minimal config compatible with ESLint v10
 */

module.exports = [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'release/**',
      'build/**',
      'src/shared/locales/**/*.js', // Locale files are JSON-like
      'src/renderer/components/Icons/*.js', // Icon files
    ]
  },
  
  // JavaScript files config
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      'semi': 'warn',
      'quotes': 'warn',
      'indent': ['warn', 2],
    }
  },
  
  // Vue files config - disable problematic rules
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'no-unused-vars': 'off', // Vue templates have different scoping
      'semi': 'off', // Vue templates don't use semicolons
      'quotes': 'off', // Vue templates can use both quote types
      'indent': 'off', // Vue templates have different indentation
    }
  },
];
