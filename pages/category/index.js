// pages/category/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],

    // 右侧的商品数据
    rightContent: [],

    // 被点击的左侧的菜单
    currentIndex: 0,

    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0

  },
  // 接口返回数据  -> 变量不必放在data里面
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    /* 缓存技术
    0. 以前web中的存储和小程序的存储本地存储区别：
      1 写代码方式不一样
        web: localStorage.setItem("key", "value") localStorage.getItem("key")
        小程序： wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2 存的时候 有没有做类型转换
        web: 先调用toString(), 把数据变成字符串，再存进去
        小程序：存什么，打印什么

    1. 判断本地有没有旧数据
      {time:Date.now(), data:[...]}

    2. 没有旧数据就直接发送请求

    3. 有旧数据 同时旧数据也没有过期 就使用 本地存储中的旧数据

    */

    // 1 获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送新网络请求 获取数据
      this.getCates();
    } else {
      // 存在旧数据， 定义过期时间10S 改成5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧数据
        this.Cates = Cates.data;
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);

        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }

  },

  // 获取分类数据
  async getCates() {

    // 1. 使用 es7 的async await 请求
    const res = await request({
      url: '/categories'
    });
    // console.log(res);
    // this.Cates = res.data.message;
    this.Cates = res;

    // 把接口数据存入本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);

    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent,
    });

  },

  handleItemTap(e) {
    // console.log(e);
    /*
      1. 获取被点击标题的索引
      2. 给data里面的currentIndex赋值
      3. 根据不同的索引来渲染右侧商品内容
    */

    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,

      // 重新设置 右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0,
    })
  },

})