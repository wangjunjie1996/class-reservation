Page({
  data: {
    user: {
      phone: '',
      name: '',
      sex: ''
    }
  },

  onShow() {},

  onPhoneChange(e) {
    this.setData({
      'user.phone': e.detail.value
    });
  },

  onNameChange(e) {
    this.setData({
      'user.name': e.detail.value
    });
  },

  onSexChange(e) {
    this.setData({
      'user.sex': e.detail.value
    });
  },

  register() {
    const phoneRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    const { phone, name, sex } = this.data.user;
    if (!phone || !phoneRegex.test(phone)) {
      wx.showToast({
        title: '请填写正确的手机号!',
        icon: 'none',
      });
      return;
    }

    if (!name) {
      wx.showToast({
        title: '名字必填!',
        icon: 'none',
      });
      return;
    }

    if (!sex) {
      wx.showToast({
        title: '性别必填!',
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
        function: 'register',
        params: { phone, name, sex }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '注册成功!',
          icon: 'none',
          duration: 1200
        });
        setTimeout(() => {
          this.gotoLogin();
        }, 1200);
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '注册失败!',
          icon: 'none',
        });
      }
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '注册失败!',
        icon: 'none',
      });
    });
  },

  gotoLogin() {
    wx.reLaunch({ url: '/pages/login/index' });
  }
});
