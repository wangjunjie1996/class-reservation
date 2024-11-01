Page({
  data: {
    startTime: '09:15',
  },

  onShow() {
  },

  onStartTime(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  submitForm: function(e) {
    const data = e.detail.value;
    const keys = Object.keys(data);
    if (keys?.some((k) => !['teacher', 'address'].includes(k)  && !data[k])) {
      wx.showToast({
        title: '信息未填写完，请检查!',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'add-course',
        params: data
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '课程添加成功!',
          icon: 'none',
          duration: 1200
        });
        setTimeout(async () => {
          wx.navigateBack();
        }, 1200);
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '课程添加失败!',
          icon: 'none',
        });
      }
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '课程添加失败!',
        icon: 'none',
      });
    });
  }
})