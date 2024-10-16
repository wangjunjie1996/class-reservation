// app.js
App({
  onLaunch: function () {
    // 小程序初始化时执行
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'course-reservation-3drw62dad1120',
        traceUser: true
      });
    }
  },

  checkLogin: async function () {
    // 获取本地存储的登录状态
    const loginStatus = await wx.getStorageSync('isLogin');
    if (loginStatus) {
      this.globalData.isLogin = true;
      await this.getUserInfo();
      return true;
    } else {
      // 用户未登录，跳转到登录页面
      this.globalData.isLogin = false;
      wx.reLaunch({
        url: '/pages/login/index'
      });
      return false;
    }
  },

  getUserInfo: async function () {
    // 获取用户信息
    const userInfo = await wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  globalData: {
    isLogin: false,
    userInfo: null
  }
});
