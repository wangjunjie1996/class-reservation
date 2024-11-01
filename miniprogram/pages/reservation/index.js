var app = getApp();
const moment = require('../../util/moment.min');

Page({
  data: {
    user: {},
    year: '',
    month: '',
    day: '',
    course: [],
    showLoginPanel: false,
  },

  onShow() {
    this.getList();
    this.setData({
      user: app.globalData.userInfo,
    });
  },

  getList() {
    const { year, month, day, user } = this.data;
    const week = moment(`${year}-${month}-${day}`)?.day() || 0;
    if ([0, 6].includes(week)) {
      this.setData({ course: [] });
      return;
    }

    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'course-list',
        params: {
          year,
          month,
          day,
        },
      }
    }).then(resp => {
      wx.hideLoading();
      let course = [];
      if (resp?.result?.success) {
        course = resp?.result?.data || [];
        course.sort((a, b) => moment(`2024-1-1 ${a.startTime || '00:00'}:00`)
          - moment(`2024-1-1 ${b.startTime || '00:00'}:00`)
        );
      }
      this.setData({ course: course.map((c) => {
        const endTime = moment(`2024-1-1 ${c.startTime || '00:00'}:00`)?.add(Number(c.courseTime), 'minutes')?.format('HH:mm') || '';
        return {
          ...c,
          reservationCount: c.reservationList?.filter(v => v.status === 1)?.length || 0,
          courseTimeBetween: `${c.startTime} ~ ${endTime}`,
          end: moment().isAfter(moment(`${year}-${month}-${day} ${c.startTime}:00`)),
          have: c.reservationList?.findIndex(v => v.userId === user?._id && v.status === 1) !== -1,
          wait: c.reservationList?.findIndex(v => v.userId === user?._id && v.status === 0) !== -1,
        }
      }) });
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '课程数据获取失败!',
        icon: 'none',
      });
    });
  },

  reservation(e) {
    const { year, month, day } = this.data;
    const { courseId, status } = e.target.dataset;
    const userId = this.data.user?._id;
    const text = status === '0' ? '排队' : '预约';
    if (!userId) {
      this.setData({ showLoginPanel: true });
      return;
    }

    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'reservation',
        params: {
          userId,
          courseId,
          status,
          time: `${year}-${month}-${day}`
        }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: `课程${ text }成功!`,
          icon: 'none',
        });
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || `课程${ text }失败!`,
          icon: 'none',
        });
      }
      setTimeout(() => {
        this.getList();
      }, 1500);
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: `课程${ text }失败!`,
        icon: 'none'
      });
      setTimeout(() => {
        this.getList();
      }, 1500);
    });
  },

  cancelReservation(e) {
    const { year, month, day } = this.data;
    const { courseId } = e.target.dataset;
    const userId = this.data.user?._id;
    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'cancel-reservation',
        params: {
          userId,
          courseId,
          time: `${year}-${month}-${day}`
        }
      }
    }).then(resp => {
      wx.hideLoading();
      if (resp?.result?.success) {
        wx.showToast({
          title: '预约取消成功!',
          icon: 'none',
        });
      } else {
        wx.showToast({
          title: resp?.result?.errorMessage || '预约取消失败!',
          icon: 'none',
        });
      }
      setTimeout(() => {
        this.getList();
      }, 1500);
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      wx.showToast({
        title: '预约取消失败!',
        icon: 'none'
      });
      setTimeout(() => {
        this.getList();
      }, 1500);
    });
  },

  dateChange(e) {
    this.setData({ ...e.detail });
    this.getList();
  },

  gotoAddClass() {
    wx.navigateTo({
      url: '/pages/add-course/index',
    })
  },

  closeLoginPanel() {
    this.setData({ showLoginPanel: false });
  },

  toLogin() {
    wx.reLaunch({
      url: '/pages/login/index',
    })
  },

  gotoDetail(e) {
    const { courseId } = e.target.dataset;
    const { year, month, day } = this.data;
    if (!this.data.user?.isAdmin) {
      return;
    }
    wx.navigateTo({
      url: `/pages/course-detail/index?id=${courseId}&time=${year}-${month}-${day}`,
    })
  }
})