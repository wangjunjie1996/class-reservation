Page({
  data: {
    courseId: '',
    startTime: '',
  },

  onLoad(options) {
    const { id } = options || {};
    this.setData({ courseId: id });
    this.getDetail(id);
  },

  onShow() {
    this.getDetail(this.data.courseId);
  },

  onStartTime(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  getDetail(_id) {
    wx.showLoading({
      title: ''
    });

    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'course-detail',
        params: { _id }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?._id) {
        const detail = resp.result;
        this.setData({ detail, startTime: detail.startTime });
      }
    }).catch(e => {
      wx.hideLoading();
    })
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
        function: 'update-course',
        params: {
          ...data,
          _id: this.data.courseId
        }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '课程更新成功!',
          icon: 'none',
          duration: 1200
        });
        setTimeout(async () => {
          wx.navigateBack();
        }, 1200);
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '课程更新失败!',
          icon: 'none',
        });
      }
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '课程更新失败!',
        icon: 'none',
      });
    });
  }
})