module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'airbnb'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    page: true,
    chrome: true
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**.js', '**/**.test.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    // 缩进配置
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-no-undef': 1, //在JSX中禁止未声明的变量
    // button里面要带type
    'react/button-has-type': 0,
    // 禁用++
    'no-plusplus': 0,
    'no-unreachable': 2, //不能有无法执行的代码
    // 后面的分号之类的
    // 'semi': 0,
    // 强制使用一致的换行风格
    'linebreak-style': 'off',
    'react/sort-comp': 2, //强制组件方法顺序
    // 不允许空格和 tab 混合缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 允许使用字符串拼接
    'prefer-template': 'off',
    // 可以对参数进行重新赋值
    'no-param-reassign': 0,
    // 定义过的变量必须使用
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'after-used',
      },
    ],
    'no-underscore-dangle': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    // 对象结构需要进行换行
    'object-curly-newline': 0,
    // 字符串最后的逗号
    'comma-dangle': 0,
    // 类后面的换行
    'padded-blocks': 0,
    'no-trailing-spaces': 0,
    'quote-props': 0,
    'no-script-url': 0,
    // 不允许console
    'no-console': 0,
    // 代码的长度限制
    'max-len': 0,
    // 星号后面的空格
    'generator-star-spacing': 0,
    // 驼峰
    camelcase: 0,
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
  },
};
