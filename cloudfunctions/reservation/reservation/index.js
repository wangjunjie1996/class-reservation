const moment = require('moment');

// 预约/排队
exports.reservation = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};
  const { userId, courseId, time } = params;

  const currentWeekCanReservation = await this.currentWeekCanReservation(event, context, cloudParams);
  if (!currentWeekCanReservation) {
    return {
      success: false,
      errorMessage: '本周只能预约/排队一次, 请取消其他的后继续操作',
      data: {}
    };
  }

  const canReservation = await this.canReservation(event, context, cloudParams);
  if (!canReservation && Number(params.status) === 1) {
    return {
      success: false,
      errorMessage: '课程' + Number(params.status) === 0 ? '排队' : '预约' + '失败',
      data: {}
    };
  }

  try {
    const { data: ress } = await db.collection('reservation').where({
      userId,
      courseId,
      time
    }).get();
    if (ress?.length) {
      const data = await db.collection('reservation').where({
        userId,
        courseId,
        time
      }).update({
        data: {
          status: Number(params.status),
        }
      });
      return {
        success: true,
        errorMessage: '',
        data: { _id: data._id }
      };
    } else {
      const data = await db.collection('reservation').add({
        data: {
          ...params,
          status: Number(params.status),
          createdAt: new Date(),
        }
      });
      return {
        success: true,
        errorMessage: '',
        data: { _id: data._id }
      };
    }
  } catch (e) {
    return {
      success: false,
      errorMessage: '课程' + Number(params.status) === 0 ? '排队' : '预约' + '失败',
      data: {}
    };
  }
}

// 取消预约
exports.cancelReservation = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const { userId, courseId, time } = event.params || {};

  try {
    const data = await db.collection('reservation').where({
      userId,
      courseId,
      time
    }).update({
      data: {
        status: 2,
      }
    });
    // 排队的
    const { data: waits } = await db.collection('reservation').where({
      courseId,
      time,
      status: 0,
    }).get();
    const wait_id = waits[0]? waits[0]._id : '';
    if (wait_id) {
      await db.collection('reservation').where({
        _id: wait_id,
      }).update({
        data: {
          status: 1,
        }
      });
    }
    return {
      success: true,
      errorMessage: '',
      data: { _id: data._id }
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '取消预约失败!',
      data: {}
    };
  }
}

// 检查是否预约已满
exports.canReservation = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const { courseId, time } = event.params || {};

  try {
    const { data: ress } = await db.collection('reservation').where({
      courseId,
      time,
      status: 1,
    }).get();
    const resCount = ress?.length || 0;
  
    const { data: cours } = await db.collection('course').doc(courseId).get();
    return !!(resCount < cours.maxPeople);
  } catch (e) {
    return false;
  }
}

// 预约列表
exports.reservationList = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const { courseId, time, status } = event.params || {};
  const _ = db.command;
  const $ = db.command.aggregate

  try {
    const { list: ress } = await db.collection('reservation').aggregate().match({
      courseId,
      time,
      status: Number(status)
    }).lookup({
      from: 'user',
      let: {
        user_id: '$userId',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_id', '$$user_id'])
        ]))).done(),
      as: 'userList',
    })
    .end();
    return ress || [];
  } catch (e) {
    return [];
  }
}

// 本周是否能预约
exports.currentWeekCanReservation = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const _ = db.command;
  const { time, userId } = event.params || {};

  const currentDate = new Date(time);
  const dayOfWeek = currentDate.getDay(); // 获取星期几
  const forward = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

  const firstDay = moment(time).subtract(forward, 'days');
  const days = [];
  for (let i = 0; i < 7; i++) {
    const clone = firstDay.clone();
    days.push(clone.add(i, 'days').format('YYYY-M-D'));
  }

  try {
    const { data: ress } = await db.collection('reservation').where({
      time: _.in(days),
      userId,
      status: _.in([0, 1]),
    }).get();
    return ress?.length === 0;
  } catch (e) {
    return false;
  }
}
