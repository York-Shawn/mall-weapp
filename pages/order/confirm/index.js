// pages/order/confirm/index.js
import http from '../../../utils/http'

Page({

  // 页面的初始数据
  data: {
    goodsItem: [],
    totalPrice: 0.00,
    totalGoodsCount: 0,
    show: false,
    showView: true,
    showAddressList: false,
    addressList: [],
    address: Object
  },

  // 生命周期函数--监听页面显示
  onShow() {
    this.getAddresList()
    this.getCartInfo()
  },

  // 获取购物车信息
  async getCartInfo(){
    let res = await http.GET('/cart/info', {openId: wx.getStorageSync('openId')})
    console.log("res",res)
    this.setData({
      goodsItem: res.data.data.cartItem,
      totalPrice: res.data.data.totalPrice
    })
    let totalGoodsCount = 0
    for (let i = 0; i < this.data.goodsItem.length; i++) {
      totalGoodsCount = totalGoodsCount + this.data.goodsItem[i].count
      if (this.data.goodsItem[i].id == this.data.goodsId) {
        this.setData({goodsCount: this.data.goodsItem[i].count})
        console.log(this.data.goodsItem[i].count);
      }
    }
    this.setData({totalGoodsCount: totalGoodsCount})
  },

  // 提交订单
  submitOrder(){
    this.setData({show: true})
  },

  // 确认支付
  confirmPay(){
    this.setData({showView: false})
    console.log("443",this.data.address)
    http.POST('/order/submit', {
      openId: wx.getStorageSync('openId'),
      sid: parseInt(wx.getStorageSync('sid')),
      address: JSON.stringify(this.data.address)
    })
  },

  async getAddresList() {
    let res = await http.GET('/address/list',{ openId: wx.getStorageSync('openId') })
    console.log("2233",res)
    for (let i = 0; i < res.data.data.length; i++) {
      console.log("223",res.data.data[i])
      if (res.data.data[i].isDefault == 1) {
        this.setData({address: res.data.data[i]})
        break
      }
    }

    this.setData({ addressList: res.data.data })
    console.log("123", this.data.address)
  },
  
  // 返回首页
  backToHome(){
    wx.switchTab({url: '/pages/home/index'})
  },

  showAddressList() {
    console.log(this.data.showAddressList)
    this.setData({ showAddressList: true})
  },
  onClose() {
    this.setData({ showAddressList: false });
  },
  changeAddress(event) {
    console.log("233",event)
    this.setData({address: event.currentTarget.dataset.nowdata, showAddressList: false})
  },
  toAddForm: function(event) {
    wx.navigateTo({ url: '/pages/address/form/index' })
  },

  // 跳转到编辑地址
  toEditForm: function(event) {
    wx.navigateTo({ url: '/pages/address/form/index?id=' + event.currentTarget.id })
  },
  // 点击删除按钮，出现提示
  onClickDelete: function(event) {
    let _this = this;
      _this.delete(event)
  },
  
  // 删除收货地址
  async delete(event){
    await http.DELETE('/address/delete',{
      id: parseInt(event.currentTarget.id)
    })
    this.onShow()
  }
})