module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "react-hooks/exhaustive-deps": "off",
    "jsx-a11y/anchor-is-valid": "off", //注销a标签的警告
    "no-debugger": 0,
    "default-case": 1, // 要求 switch 语句中有 default 分支
    "no-empty-function": 1, // 禁止出现空函数
    "no-multi-spaces": 1, // 禁止使用多个空格
    "spaced-comment": ["error", "always"], // 注释后面必须跟随至少一个空白
    "no-multiple-empty-lines": [
      // 禁止出现多行空行
      "error",
      { max: 3 },
    ],
  },
}
