import { request } from "../../request/index";
import { login } from "../../utils/awaitWx"
Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const { encrypteDaata, rawData, iv, signature } = e.detail;
      // 获取小程序登录成功之后的code
      const { code } = await login();
      const loginParams = {
        encrypteDaata, rawData, iv, signature, code
      };
      // 发送请求，获取用户的token
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      // 把token存储到缓存中，同时跳转到上一个页面中

      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      // wx.setStorageSync("token", token);

      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})