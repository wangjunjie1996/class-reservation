var app = getApp();

Page({
  data: {
    navBarHeight: 40,
    statusBarHeight: 20,
    user: {},
  },

  onShow() {
    const { statusBarHeight } = wx.getWindowInfo();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navBarHeight =
      menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;

    this.setData({
      navBarHeight,
      statusBarHeight,
      user: app.globalData.userInfo,
    });
  },

  toLogin() {
    wx.reLaunch({
      url: '/pages/login/index',
    })
  },

  gotoUserList() {
    wx.navigateTo({
      url: '/pages/user-list/index',
    })
  },

  gotoUserEdit() {
    wx.navigateTo({
      url: '/pages/user-edit/index',
    })
  },

  logout() {
    app.logout();
    wx.reLaunch({
      url: '/pages/login/index',
    })
  }
});
