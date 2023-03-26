/**
 * promise 形式 showModal
 * @param {object} param0 参数
 */

export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#3CC51F',
            confirmText: '确定',
            confirmColor: '#000000',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/**
 * promise 形式 showToast
 * @param {object} param0 参数
 */

export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}


/**
 * promise 形式 login
 * @param {object} param0 参数
 */


export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}


/**
 * promise 形式 小程序微信支付
 * @param {object} pay 支付所必要的参数
 */


export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
       wx.requestPayment({
           ...pay,
        success: (result)=>{
            resolve(resolve);
        },
           fail: (err) => {
               reject(err);
        },
       });
    })
}