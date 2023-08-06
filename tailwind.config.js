/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    })
  ],
}
