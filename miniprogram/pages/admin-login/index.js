var app = getApp();

Page({
  data: {
    name: '',
    password: ''
  },
  onShow() {},

  onNameChange(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onPassChange(e) {
    this.setData({
      password: e.detail.value
    });
  },

  login() {
    const { name, password } = this.data;
    if (!name) {
      wx.showToast({
        title: '名字必填!',
        icon: 'none',
      });
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码必填!',
        icon: 'none',
      });
      return;
    }

    wx.showLoading({
      title: ''
    });

    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'adminLogin',
        params: { name, password }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '登录成功!',
          icon: 'none',
          duration: 1200
        });
        setTimeout(async () => {
          await wx.setStorageSync('isLogin', true);
          await wx.setStorageSync('userInfo', resp?.result?.data);
          const login = await app.checkLogin();
          if (login) {
            wx.reLaunch({ url: '/pages/index/index' });
          }
        }, 1200);
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '登录失败!',
          icon: 'none',
        });
      }
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '登录失败!',
        icon: 'none',
      });
    });
  },

  toLogin() {
    wx.reLaunch({
      url: '/pages/login/index'
    });
  }
});
