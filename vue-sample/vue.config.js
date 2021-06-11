
module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 80,
    public: '127.0.0.1:80'
  },
  publicPath: ".",//路径如果不想让他修改，需要修改\KLineChartSample\vue-sample\node_modules\@vue\cli-service\lib\Service.js
  //注释掉resolved.publicPath = resolved.publicPath.replace(/^\.\//, '')
  //只有为.的时候 ，才能让浏览器在本地打开使用页面
  productionSourceMap: false,
  validPublicPath:false

}
