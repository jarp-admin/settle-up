/** @type {import("prettier").Config} */
const config = {
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    require.resolve("prettier-plugin-packagejson"),
    require.resolve("prettier-plugin-prisma"),
  ],
};

module.exports = config;
