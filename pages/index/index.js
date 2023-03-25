// index.js
// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index"
Page({
    data: {
        // 轮播图数组
        swiperList: [],

        // 导航数组
        catesList: [],

        // 楼层图
        floorList: []



    },
    // 页面开始加载就会触发
    onLoad: function (options) {
        // 1.发送异步请求获取轮播图数据 
        // 优化的方法：可以通过es6的promise来解决这个问题

        // var reqTask = wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     // 表示传送的数据
        //     // data:{},
        //     // 默认
        //     // header: {'content-type':'application/json'},
        //     // method: 'GET',
        //     // dataType: 'json',
        //     // responseType: 'text',
        //     success: (result) => {
        //         // console.log(result);
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     },
        //     // fail: ()=>{},
        //     // complete: ()=>{}
        // });

        // request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata' })
        //     .then(result => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     })
        this.getSwiperList();
        this.getCateList();
        this.getFloorList();
    },

    // 获取轮播图数据
    getSwiperList() {
        request({ url: '/home/swiperdata' })
            .then(result => {
                this.setData({
                    swiperList: result
                })
            })
    },

    // 获取导航数组
    getCateList() {
        request({ url: '/home/catitems' })
            .then(result => {
                this.setData({
                    catesList: result
                })
            })
    },

    //  获取楼层数据
    getFloorList() {
        request({ url: '/home/floordata' })
            .then(result => {
                this.setData({
                    floorList: result
                })
            })
    }

});
