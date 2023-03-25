/**
 * 1 获取用户的收获地址
 *  1绑定点击事件
 *  2调用小程序内置api 获取地址 wx.chooseAddress
 * 
 * 2 页面加载完毕
 *  0 onLoad onShow
 *  1 获取本机存储的地址数据
 *  2 把数据设置给data中的一个变量
 * 
 * 3 页面 onShow
 *    0 回到了商品详情页面 第一次添加商品的时候，手动添加了属性
 *      num=1 checked=true
 *    1 获取缓存中的购物车数组
 *    2 把购物车数据填充到data中 
 * 
 * 4 全选实现
 *  1 onshow 获取缓存中的购物车数组
 *  2 根据购物车中的商品数据，所有商品都被选中了 =》全选
 * 
 * 5 总价格和数量
 *  1 商品被选中才计算
 *  2 获取购物车数组
 *  3 遍历
 *  4 判断商品是否被选中
 *  5 总价格 += 商品单价*商品数量
 *  6 总数量 += 商品数量
 *  7 把计算后的数量设置到data中即可
 * 
 * 6 商品选中
 *  1 绑定change事件
 *  2 获取到被修改的商品对象
 *  3 商品对象的选中状态 取反
 *  4 重新填充同data中和缓存中
 *  5 重新计算全选 总价格 总数量
 * 
 * 7 全选和反选功能
 *  1 全选复选框绑定事件 change
 *  2 获取data中的全选变量 allChecked
 *  3 直接取反 allChecked=!allChecked
 *  4 遍历购物车数组 让里面的商品选中状态跟随 allChecked 改变
 *  5 cart重新设置回data和缓存中
 * 
 * 8 商品数量的编辑
 *  1 + - 按钮 绑定同一个点击事件 区分关键 自定义属性
 *  2 传递被点击的商品id goods_id
 *  3 获取data中的购物车数组 来获取需要被修改的商品对象
 *  4 当购物车的数量 = 1 用户点击-1时
 *    弹窗提示 询问用户是否要删除  wx.showModal
 *    1. 确定 直接执行删除
 *    2. 取消 返回不做修改
 *  5 直接修改商品对象的数量num
 *  6 把cart数组 重新设置回 缓存中 和data中
 * 
 * 9 结算功能
 *  1 判断 有无收货信息
 *  2 判断 有无收获地址
 *  3 跳转支付页面
 */

import { showModal, showToast } from "../../utils/awaitWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];

    this.setData({ address });
    this.setCart(cart);
  },

  // 点击收获按钮
  handleChooseAddress() {
    // 获取收获地址
    // console.log("shouhuo");
    wx.chooseAddress({
      success: (result) => {
        let address = result;
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo,
          // console.log(result);
          wx.setStorageSync("address", result);
      },
    });
  },

  // 商品选中
  handleItemChange() {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);

  },

  // 设置购物车状态，重新计算总价格 总数量
  setCart(cart) {

    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num + v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    // 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },


  // 商品全选反选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {

    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      // wx.showModal({
      //   title: '',
      //   content: '您是否要删除该商品？',
      //   showCancel: true,
      //   cancelText: '取消',
      //   cancelColor: '#3CC51F',
      //   confirmText: '确定',
      //   confirmColor: '#000000',
      //   success: (result) => {
      //     if(result.confirm){
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (result.cancel) {
      //       console.log("用户点击取消");
      //     }
      //   },
      // });
      const result = await showModal({ content: "您是否要删除？" });
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
    // return;
  },

  // 结算
  async handlePay() {
    const { address, totalNum } = this.data;

    // 判断收货地址
    if (!address.userName) {
      await showToast({ title: "您还没有选择收获地址" });
      return;
    }

    // 判断用户没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }

    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }

})