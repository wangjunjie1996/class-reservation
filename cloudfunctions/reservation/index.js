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

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.function) {
    case 'register':
      return await register.register(event, context, cloudParams);
    case 'login':
      return await login.login(event, context, cloudParams);
    case 'adminLogin':
      return await login.adminLogin(event, context, cloudParams);
  }
}