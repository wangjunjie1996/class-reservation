// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const cloudParams = {
  cloud,
  db
};

// 业务函数
const register = require('./register/index');
const login = require('./login/index');
const course = require('./course/index');
const reservation = require('./reservation/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.function) {
    case 'register':
      return await register.register(event, context, cloudParams);
    case 'login':
      return await login.login(event, context, cloudParams);
    case 'adminLogin':
      return await login.adminLogin(event, context, cloudParams);
    case 'user-list':
      return await login.userList(event, context, cloudParams);
    case 'del-user':
      return await login.delUser(event, context, cloudParams);
    case 'edit-user':
      return await login.editUser(event, context, cloudParams);
    case 'add-course':
      return await course.addCourse(event, context, cloudParams);
    case 'course-list':
      return await course.courseList(event, context, cloudParams);
    case 'update-course':
      return await course.updateCourse(event, context, cloudParams);
    case 'course-detail':
      return await course.CourseDetail(event, context, cloudParams);
    case 'cancel-course':
      return await course.cancelCourse(event, context, cloudParams);
    case 'reservation':
      return await reservation.reservation(event, context, cloudParams);
    case 'cancel-reservation':
      return await reservation.cancelReservation(event, context, cloudParams);
    case 'reservation-list':
      return await reservation.reservationList(event, context, cloudParams);
  }
}