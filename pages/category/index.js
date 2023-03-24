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
    currentIndex: 0 

  },
  // 接口返回数据  -> 变量不必放在data里面
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCates();
  },

  // 获取分类数据
  getCates() {
    request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories'
    })
      .then(res => {
        // console.log(res);
        this.Cates = res.data.message;

        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);

        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent,
        })
      })
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
    })
  }
})