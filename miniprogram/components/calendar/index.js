const moment = require('../../util/moment.min');
Component({
  properties: {
  },
  data: {
    year: '',
    month: '',
    day: '',
    dateList: [],
  },
  lifetimes: {
    attached: function() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() || 0) + 1;
      const day = now.getDate();

      this.setData({ year, month, day });

      this.getDateList({ year, month, day });
      this.event();
    },
  },
  methods: {
    getDateList({ year, month, day }) {
      const week = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
      const dateList = [];

      for (let i = 0; i < 14; i++) {
        const date = moment(`${year}-${month}-${day}`).add(i, 'days');
        dateList.push({
          year: date.year(),
          month: (date.month() || 0) + 1,
          day: date.date(),
          week: week[date.day()],
        });
      }

      this.setData({ dateList });
    },

    onDayChange(e) {
      const { year, month, day } = e.currentTarget.dataset;
      this.setData({ year, month, day });
      this.event();
    },

    event() {
      const { year, month, day } = this.data;
      this.triggerEvent('dateChange', { year, month, day });
    },
  }
})