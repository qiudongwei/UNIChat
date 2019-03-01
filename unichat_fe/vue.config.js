/**
 * UNIChat Project
 */

module.exports = {
    productionSourceMap: false,
    filenameHashing: false,
    outputDir: './dist',
    devServer: {
        proxy: {
            '/user': {
                // 跨域 API 地址
                target: 'http://localhost:8081',
                // 如果要代理 websockets
                ws: false,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                autoRewrite: true,
                cookieDomainRewrite: true
            }
        }
    }
}