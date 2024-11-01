
const moment = require('../../util/moment.min');
Page({
  data: {
    detail: {},
    status: 1,
    time: '',
    courseId: '',
    reservations: [],
  },

  onLoad(options) {
    const { id, time } = options || {};
    this.setData({
      courseId: id,
      time,
    });
    this.getDetail(id);
  },

  onShow() {
    this.getDetail(this.data.courseId);
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
        const endTime = moment(`2024-1-1 ${detail.startTime || '00:00'}:00`)?.add(Number(detail.courseTime), 'minutes')?.format('HH:mm') || '';
        this.setData({ detail: {
          ...detail,
          courseTimeBetween: `${detail.startTime} ~ ${endTime}`,
        } });
        this.getReservation();
      }
    }).catch(e => {
      wx.hideLoading();
    })
  },

  onTab(e) {
    const { status } = e.target.dataset;
    this.setData({ status: Number(status) });
    this.getReservation();
  },

  getReservation() {
    this.setData({ reservations: [] });
    const { status, time, courseId } = this.data;

    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'reservation-list',
        params: {  status, time, courseId }
      }
    }).then(resp => {
      wx.hideLoading();
      this.setData({
        reservations: resp?.result || []
      });
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      this.setData({
        reservations: []
      });
    });
  },

  gotoEdit() {
    wx.navigateTo({
      url: `/pages/edit-course/index?id=${this.data.courseId}`,
    })
  },

  onCancel() {
    const _id = this.data.courseId;
    wx.showModal({
      title: '取消',
      content: '确认取消该课程吗?',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: ''
          });
          wx.cloud.callFunction({
            name: 'reservation',
            data: {
              function: 'cancel-course',
              params: { _id }
            }
          }).then(resp => {
            wx.hideLoading();
            if (resp?.result?.success) {
              wx.showToast({
                title: '课程取消成功!',
                icon: 'none',
                duration: 1200
              });
              setTimeout(async () => {
                wx.navigateBack();
              }, 1200);
            } else {
              wx.showToast({
                title: resp?.result?.errorMessage || '课程取消失败!',
                icon: 'none',
              });
            }
          }).catch(e => {
            console.error('error', e);
            wx.hideLoading();
            wx.showToast({
              title: '课程取消失败!',
              icon: 'none',
            });
          });
        }
      }
    });
  }
})