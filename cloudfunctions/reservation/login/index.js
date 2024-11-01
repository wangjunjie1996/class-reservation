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

// 用户列表
exports.userList = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const _ = db.command;

  try {
    const { data: users } = await db.collection('user').where({
      isAdmin: _.neq(true)
    }).get();
    return users || [];
  } catch (e) {
    return [];
  }
}

// 删除用户

exports.delUser = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};

  try {
    await db.collection('user').doc(params._id).remove();
    return {
      success: true,
      errorMessage: '删除用户成功',
      data: {}
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '删除用户失败',
      data: {}
    };
  }
}

// 编辑用户
exports.editUser = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};
  const id = params.id;
  delete params.id;

  try {
    const data = await db.collection('user').doc(id).update({
      data: params
    });
    return {
      success: true,
      errorMessage: '',
      data: { _id: data._id }
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: '修改失败',
      data: {}
    };
  }
}