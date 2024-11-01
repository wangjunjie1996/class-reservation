var app = getApp();

Page({
  data: {
    id: '',
    name: '',
    phone: '',
    gender: 'man',
    genders: [{ label: '男', value: 'man' }, { label: '女', value: 'woman' }]
  },

  onShow() {
    const { _id, name, phone, sex } = app.globalData.userInfo;
    this.setData({
      id: _id,
      name,
      phone,
      gender: sex || 'man'
    });
  },

  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  onGenderChange(e) {
    this.setData({
      gender: e.detail.value
    });
  },

  submitUserInfo() {
    const { id, name, phone, gender: sex } = this.data;
    const phoneRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
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
        function: 'edit-user',
        params: { id, phone, name, sex }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '修改成功!',
          icon: 'none',
          duration: 1200
        });
        setTimeout(() => {
          app.logout();
          wx.reLaunch({
            url: '/pages/login/index',
          });
        }, 1200);
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '修改失败!',
          icon: 'none',
        });
      }
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '修改失败!',
        icon: 'none',
      });
    });
  }
})