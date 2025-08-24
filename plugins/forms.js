const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addBase, theme }) {
  addBase({
    'input, textarea, select, button': {
      fontFamily: theme('fontFamily.sans', 'ui-sans-serif,system-ui,sans-serif'),
      borderColor: theme('colors.gray.300', '#d1d5db'),
      borderWidth: '1px',
      borderRadius: theme('borderRadius.md', '0.375rem'),
      padding: theme('spacing.2', '0.5rem'),
      backgroundColor: theme('colors.white', '#fff'),
    },
  });
});
