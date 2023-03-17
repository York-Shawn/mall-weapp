// pages/goods/index.js
import http from '../../utils/http'
Page({

  // 页面的初始数据
  data: {
    goods: null,
    windowWidth: 0,
    goodsId: 0,
    goodsCount: 0,
    show: false,
    goodsItem: [],
    totalPrice: 0.00,
    checked: [],
    totalGoodsCount: 0
  },

  // 生命周期函数--监听页面加载
  async onLoad(options) {
    this.setData({ goodsId: options.id })
    this.setData({ windowWidth: wx.getSystemInfoSync().windowWidth })
    let res = await http.GET('/goods/info',{ id: options.id });
    this.setData({ goods: res.data.data })
  },

  checkGoodsDetail(event){
    wx.navigateTo({ url: '/pages/goods/index?id=' + event.currentTarget.id })
  },

  // 返回首页
  backToHome() {
    wx.switchTab({ url: '/pages/home/index' })
  },

  // 增加商品数量
  addGoods() {
    this.setData({goodsCount: 1})
    this.addToCart().then(
      this.onShow()
    )
  },

  // 当进步器改变时，修改商品数量
  stepperChange(event){
    console.log("event:", event)
    this.setData({goodsCount: event.detail})
    this.addToCart().then(
      this.onShow()
    )
  },

  // 添加商品到购物车
  async addToCart() {
    await http.POST('/cart/add',{ 
      goodsId: this.data.goodsId, 
      goodsCount: this.data.goodsCount,
      openId: wx.getStorageSync('openId')
    })
  },

  // 展示购物车
  showCartPopup() {
    if(this.data.show){
      this.setData({ show: false });
    } else {
      this.setData({ show: true });
    }
    console.log(this.data.show);
  },

  // 生命周期函数--监听页面显示
  async onShow() {
    // 获取购物车信息
    let res = await http.GET('/cart/info', {openId: wx.getStorageSync('openId')})
    console.log("res", res)
    this.setData({
      goodsItem: res.data.data.cartItem,
      totalPrice: res.data.data.totalPrice,
      goodsCount: this.data.goodsItem[this.data.goodsId]
    })
    let totalGoodsCount = 0
    for (let i = 0; i < this.data.goodsItem.length; i++) {
      totalGoodsCount = totalGoodsCount + this.data.goodsItem[i].count
      if (this.data.goodsItem[i].id == this.data.goodsId) {
        if (this.data.goodsItem[i].count != 0){
          this.setData({goodsCount: this.data.goodsItem[i].count})
        }
        console.log(this.data.goodsItem[i].count);
      }
    }
    this.setData({totalGoodsCount: totalGoodsCount})
  },

  // 清空购物车
  async clearCart(){
    await http.DELETE('/cart/clear',{ 
      openId: wx.getStorageSync('openId')
    }).then(
    this.onShow()
    )
  },
  
  // 购物车选中
  onChange(event) {
    this.setData({ checked: event.detail});
  },

  // 点击结算
  settleAccounts(){
    wx.navigateTo({url: '/pages/order/confirm/index'})
  }
})