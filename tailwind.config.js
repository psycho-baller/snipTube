/** @type {import('tailwindcss').Config} */
module.exports = {
  // not in the app dir
  content: ["./src/**/*.{tsx,html}", "!./src/app/**/*", "!./src/components/**/*", "!./src/lib/**/*"],
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    })
  ],
}
