Page({
  data: {
    userList: [],
  },

  onShow() {
    this.getUserList();
  },

  getUserList() {
    wx.showLoading({
      title: ''
    });
    wx.cloud.callFunction({
      name: 'reservation',
      data: {
        function: 'user-list',
        params: {},
      }
    }).then(resp => {
      wx.hideLoading();
      this.setData({
        userList: resp?.result || [],
      });
    }).catch(e => {
      console.error('error', e);
      wx.hideLoading();
      this.setData({ userList: [] })
    });
  },

  onDelUser(e) {
    const { id } = e.target.dataset;

    wx.showModal({
      title: '删除用户',
      content: '确认删除该用户吗？',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: ''
          });
          wx.cloud.callFunction({
            name: 'reservation',
            data: {
              function: 'del-user',
              params: { _id: id },
            }
          }).then(resp => {
            wx.hideLoading();
            this.getUserList();
          }).catch(e => {
            console.error('error', e);
            wx.hideLoading();
            wx.showToast({
              title: '删除用户失败!',
            })
          });
        }
      }
    })
  }
})