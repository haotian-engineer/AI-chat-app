module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off"
  }
};