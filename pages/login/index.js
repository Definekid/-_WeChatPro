// pages/login/index.js
Page({
  handleGetUserInfo(e) {
  //  console.log(e);
    
    // 将用户信息存储到缓存
    const { userInfo } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1,
    });

  }
})