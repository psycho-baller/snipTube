/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    })
  ],
}
