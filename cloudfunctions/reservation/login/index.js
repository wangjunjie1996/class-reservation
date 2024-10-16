// 登录函数
exports.login = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};

  try {
    const { data: users } = await db.collection('user').where({
      phone: params.phone,
      name: params.name
    }).get();
    if (!users.length || !users[0]) {
      return { success: false, errorMessage: '账号不存在，请注册', data: {} };
    }
    return { success: true, errorMessage: '', data: users[0] };
  } catch (e) {
    return {
      success: false,
      errorMessage: '登录失败',
      data: {}
    };
  }
};

// 管理员登录函数
exports.adminLogin = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};

  try {
    const { data: users } = await db.collection('user').where({
      name: params.name,
      password: Buffer.from(params.password).toString('base64'),
    }).get();
    if (!users.length || !users[0]) {
      return { success: false, errorMessage: '账号不存在', data: {} };
    }
    return { success: true, errorMessage: '', data: users[0] };
  } catch (e) {
    return {
      success: false,
      errorMessage: '登录失败',
      data: {}
    };
  }
};