/**
 * 1 页面被打开 onShow
 *   0 onShow 不同于onLoad 无法在形参上接收 options参数 
 *   0.5 判断缓存中有没有token
 *      1 没有 -> 授权页面
 *      2 有-> 继续
 *   1 获取url上的参数
 *   2 根据type 去发送请求 获取订单数据 决定页面标题数组元素哪个被激活选中
 *   3 渲染页面
 * 2 点击不同标题 重新发送请求来获取和渲染数据
 */

import { request } from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收获",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],


  },

  onShow() {
    const token = wx.getStorageSync('token');

    // 实现不了，为了好区分，就这样吧

    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index',

    //   })
    //   return;
    // }

    // 1 获取小程序的界面栈 - 数组 长度最大是 10 页面 ,数组中索引最大的就是当前页面
    let pages = getCurrentPages();

    let currentPage = pages[pages.length - 1];

    // 获取url上的type参数
    const { type } = currentPage.options;

    // 激活选中页面标题 当type=1 index=0
    this.changeTitleByIndex(type-1);

    this.getOrders(type);
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    // console.log(res);
    this.setData({
      orders: res.orders
    })
  },

  // 根据标题索引来激活标题选中数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs,
    })
  },

  // 标题点击事件 
  HandleTabsItemChange(e) {
    // console.log(e);
    //  1. 获取被点击的标题索引
    const { index } = e.detail;
 
    this.changeTitleByIndex(index)
    // 2 重新发送请求
    this.getOrders(index + 1);
  },
})