/**
 * 1 页面加载时候
 *  1 从缓存中获取购物车数据（checked属性必为true） 渲染到页面中
 * 
 * 2 微信支付
 *  1  哪些人 哪些账号 可以实现微信支付
 *    1 企业账号
 *    2 企业账号的小程序后台中还要给开发者添加上白名单
 *      一个appid可以同时绑定多个开发者 这些开发者可以共用一个appid 和 它的开发权限了
 * 
 * 3 支付实现
 *    1 先判断缓存中有没有token 
 *    2 没有跳转到授权页面 进行获取token
 *    3 有token
 *    4 创建订单 获取订单编号
 *    5 已经完成微信支付
 *    6 手动的删除缓存中已经被选中的商品
 *    7 删除后的购物车数据填充到缓存中
 *    8 再跳转页面
 */

import { showModal, showToast, requestPayment } from "../../utils/awaitWx.js"
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onShow() {
    // 1 获取缓存中的收获地址
    const address = wx.getStorageSync("address") || [];

    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];

    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    this.setData({ address });
    // this.setCart(checkedCart);

    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {

      totalPrice += v.num + v.goods_price;
      totalNum += v.num;

    })

    // 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击支付功能
  async handleOrderPay() {
    try {

      // 1. 判断缓存中有没有token
      const token = wx.getStorageSync("token");

      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',

        });
        return;
      }

      // 1 创建订单
      // 2 请求头参数
      // const header = { Authorization: token };
      // 3 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price,
      }))

      const orderParams = { order_price, consignee_addr, goods };
      // 4 准备发送请求 创建订单 获取订单号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });

      // 5 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });

      // 6 发起微信支付
      await requestPayment(pay);

      // 7 查询后台 看订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });

      await showToast({ title: "支付成功" });

      // 8 手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);

      // 8 跳转到支付页面
      wx.navigateTo({
        url: '/pages/order/index',
      });

    } catch (error) {
      await showToast({ title: "支付失败" });
      console.log(error);
    }
  }

})