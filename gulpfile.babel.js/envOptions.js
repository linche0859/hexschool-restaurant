const srcPath = './src';
const distPath = './dist';
const nodePath = './node_modules';

const envOptions = {
  // 透過「--env 參數」方式，可以將參數帶入 env 的屬性中
  string: 'env',
  // 預設會輸出 develop 字串
  default: {
    env: 'develop'
  },
  html: {
    src: [`${srcPath}/**/*.html`],
    ejsSrc: [`${srcPath}/**/*.ejs`],
    path: distPath
  },
  style: {
    src: [`${srcPath}/scss/**/*.scss`],
    outputStyle: 'expanded',
    includePaths: [
      `${nodePath}/bootstrap/scss`,
      `${nodePath}/material-icons/iconfont`,
      `${nodePath}/@fortawesome/fontawesome-free/scss`
    ],
    path: `${distPath}/style`
  },
  javascript: {
    src: [`${srcPath}/js/**/*.js`],
    concat: 'all.js',
    path: `${distPath}/js`
  },
  vendors: {
    src: [
      `${nodePath}/jquery/dist/**/jquery.slim.min.js`,
      `${nodePath}/bootstrap/dist/js/**/bootstrap.bundle.min.js`, // 已包含 popper.js
      `${nodePath}/@fortawesome/fontawesome-free/js/all.min.js`
    ],
    concat: 'vendors.js',
    path: `${distPath}/js`
  },
  image: {
    src: [`${srcPath}/assets/images/**/*`],
    path: `${distPath}/assets/images`
  },
  icon: {
    src: [`${srcPath}/assets/material-icons/**/*`],
    path: `${distPath}/assets/material-icons`
  },
  clean: {
    src: distPath
  },
  browserSetting: {
    dir: distPath,
    port: 8082
  },
  deploySrc: `${distPath}/**/*`
};

exports.envOptions = envOptions;
