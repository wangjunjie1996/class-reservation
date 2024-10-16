var app = getApp();

Page({
  data: {
    name: '',
    phone: '',
  },

  onShow() {
  },

  onNameChange(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onPhoneChange(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  onLogin() {
    const phoneRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    const { phone, name } = this.data;
    if (!name) {
      wx.showToast({
        title: '名字必填!',
        icon: 'none',
      });
      return;
    }
    if (!phone || !phoneRegex.test(phone)) {
      wx.showToast({
        title: '请填写正确的手机号!',
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
        function: 'login',
        params: { phone, name }
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

  onRegister() {
    wx.reLaunch({ url: '/pages/register/index' });
  },

  adminLogin() {
    wx.reLaunch({
      url: '/pages/admin-login/index',
    })
  },

  ty() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
})