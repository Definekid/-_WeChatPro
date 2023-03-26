
// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    //判断url中  是否带有字符串 /my/ 带上header请求头 token
    let header = {...params.header};
    if (params.url.includes('/my/')) {
        // 拼接一下header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }

    ajaxTimes++;
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    });

    //   setTimeout(function () {

    //   }, 3000);
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header:header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) { wx.hideLoading(); }
            }
        });
    })
}