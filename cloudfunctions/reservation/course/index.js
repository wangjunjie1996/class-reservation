// 新增课程
exports.addCourse = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};
  try {
    const data = await db.collection('course').add({
      data: {
        ...params,
        maxPeople: Number(params.maxPeople),
        courseTime: Number(params.courseTime),
        createdAt: new Date(),
        isDelete: false,
      }
    });
    return {
      success: true,
      errorMessage: '',
      data: { _id: data._id }
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '课程新增失败',
      data: {}
    };
  }
}

// 课程列表
exports.courseList = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const { year, month, day } = event.params || {};
  const _ = db.command;
  const $ = db.command.aggregate

  try {
    const res = await db.collection('course').aggregate().match({
      isDelete: _.neq(true) // 过滤条件
    }).lookup({
      from: 'reservation',
      let: {
        course_id: '$_id',
      },
      pipeline: $.pipeline()
      .match(_.expr($.and([
        $.eq(['$courseId', '$$course_id']),
        $.eq(['$time', year + '-' + month + '-' + day]),
        $.in(['$status', [0, 1]]),
      ]))).done(),
      as: 'reservationList',
    }).end();
    return {
      success: true,
      data: res?.list || [],
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errorMessage: '获取课程列表失败',
      data: []
    };
  }
}

// 更新课程
exports.updateCourse = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};
  const id = params._id;
  delete params._id;

  try {
    const data = await db.collection('course').doc(id).update({
      data: {
        ...params,
        maxPeople: Number(params.maxPeople),
        courseTime: Number(params.courseTime),
      }
    });
    return {
      success: true,
      errorMessage: '',
      data: { _id: data._id }
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '课程更新失败',
      data: {}
    };
  }
}

// 课程详情
exports.CourseDetail = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const { _id } = event.params || {};

  try {
    const { data: detail } = await db.collection('course').doc(_id).get();
    return detail;
  } catch (e) {
    return null;
  }
}

// 取消课程
exports.cancelCourse = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};
  const id = params._id;
  delete params._id;

  try {
    const data = await db.collection('course').doc(id).update({
      data: { isDelete: true }
    });
    return {
      success: true,
      errorMessage: '',
      data: { _id: data._id }
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '课程取消失败',
      data: {}
    };
  }
}