module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "strict": 0,
    "no-console": "warn",
    "no-debugger": "warn",
    "no-unused-vars": [
      1
    ],
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    "prettier/prettier": ["error", {
     "endOfLine":"auto"
   }]
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["prettier", "jsx-a11y"]
}