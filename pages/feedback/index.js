/**
 * 1 点击“+”号触发tap点击事件
 *  1 调用小程序内置的 选择图片的api
 *  2 获取到图片的路径 数组
 *  3 把图片路径 存到 data变量中
 *  4 页面就可以根据图片数组进行循环显示
 * 
 * 2 点击自定义组件
 *   1 获取被点击的元素索引
 *   2 获取被点击的元素索引
 *   3 根据索引 数组中删除对应的元素
 *   4 把数组重新设置回data中
 * 
 * 3 点击提交按钮
 *   1 获取文本域的内容 类似输入框获取
 *      1 data中定义变量 表示输入框内容
 *      2 文本域绑定输入事件 事件触发时候 把输入框的值存入到变量中
 *   2 对这些内容 合法性验证
 *   3 验证通过 用户选择的图片 上传到专门的图片服务器 返回图片外网链接
 *      1 遍历图片数组
 *      2 挨个上传
 *      3 自己再维护图片数组 存放 图片上传后的外网的链接
 *   4 文本域 和 外网的图片的路径一起提交到服务器中 （现只做前端模拟，并不会发送请求到后台）
 *   5 清除当前页面
 *   6 返回上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "投诉",
        isActive: false
      }
    ],

    // 被选中的图片路径的数组
    chooseImgs: [],

    // 文本域内容
    textVal: "",

    // 外网的图片路径数组
    UpLoadImgs: [],
  },


  // 标题点击事件
  HandleTabsItemChange(e) {

    //  1. 获取被点击的标题索引
    const { index } = e.detail;
    // 2. 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs,
    })
  },

  // 点击加号选择图片上传
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中图片数量
      count: 9,
      // 图片的格式： 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片来源： 相册
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
        })
      }
    })
  },

  // 点击删除图片
  handleRemoveImg(e) {
    // 获取被点击组件的索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },

  // 文本框的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 提交按钮点击事件
  handleFormSubmit() {
    // 获取文本域内容 图片数组
    const { textVal, chooseImgs } = this.data;
    // 合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 准备上传图片到专门的服务器
    // 上传文件api是不支持 多个文件同时上传的 遍历数组 挨个上传
    // 显示正在等待的图标
    wx.showLoading({
      title: "正在加载中",
      mask: true,
    });

    // 判断有没有要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        // wx.uploadFile({
        //   //url 图片上传目的地
        //   url: 'https://images.ac.cn/Home/Index/UploadAction/',
        //   // 被上传文件的路径
        //   filePath: v,
        //   // 上传文件的路径 后台来获取文件 File
        //   name: "file",
        //   // 顺带的文本信息
        //   formData: {},
        //   success: (result) => {
        //     // console.log(result);
        //     let url = JSON.parse(result.data).url;
        //     this.UpLoadImgs.push(url);
        //     // console.log(this.UpLoadImgs);

        //     // 所有图片都上传完毕才触发
        //     if (i === chooseImgs.length - 1) {
        //       //关掉loading
        //       wx.hideLoading();

        //       // 把文本内容和外网图片数组提交到外网中
        //       this.setData({
        //         textVal: "",
        //         chooseImgs: [],
        //       })

        //       // 返回上一个页面
        //       wx.navigateBack({
        //         delta: 1
        //       });
        //     }

        //   },
        // });
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: "image",
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url;
            this.UpLoadImgs.push(url);
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
        
      })
    } else {
      wx.hideLoading();
      // console.log("只提交了文本");
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }

  }
})