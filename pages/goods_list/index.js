/**
 * 1 用户上划页面滚动条触底就加载下一个页面
 *   1. 找到滚动条触底界面 onReachBottom
 *   2. 判断还有没有下一页数据
 *      1. 获取总页数 总页数 = Math.ceil(总条数 / 页容量)
 *      2. 获取当前页码
 *      3. 判断当前页码是否大于总页数
 *   3. 假如没有下一页数据 弹出一个提示框
 *   4. 假如还有下一页， 加载
 *      1. 当前页码++
 *      2. 重新发送请求
 *      3. 数据请求回来了， 拼接
 * 
 * 2 下拉刷新页面
 *    1. 触发下拉刷新事件  需要在页面json文件中开启一个配置  "enablePullDownRefresh": true,
 *        找到下拉刷新事件，添加逻辑代码
 *    2. 重置数据事件
 *    3. 重置页码 设置为1
 *    4. 重新发送请求
 *    5. 数据请求结束，手动关闭等待效果
 */
import { request } from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]

  },

  // 接口要的参数
  QueryParams: {
    query: "",
    cid:"",
    pagenum: 1,
    pagesize:10,
  },
  // 获取条数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.QueryParams.cid = options.cid;
    this.getGoodsList();

  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res);
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods],
    })

    // 关闭下拉刷新按钮 如果没有调用下拉刷新，直接关闭也不影响
    wx.stopPullDownRefresh();
  },

  // 标题点击事件
  HandleTabsItemChange(e) {
    // console.log(e);
    //  1. 获取被点击的标题索引
    const { index } = e.detail;
    // 2. 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs,
    })
  },

  // 滚动条触底，页面加载
  onReachBottom() {
    // console.log("触底");
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页");
      wx.showToast({
        title: '没有下一页数据',
      });
    } else {
      // console.log("有下一页");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }

  },

  // 下拉刷新函数
  onPullDownRefresh() {
    // 1 重置数据
    this.setData({
      goodsList:[]
    })

    // 2 重置页码
    this.QueryParams.pagenum = 1;

    // 3. 重新请求
    this.getGoodsList();
  }

})