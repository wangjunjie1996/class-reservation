// 注册函数
exports.register = async (event, context, cloudParams) => {
  const { cloud, db } = cloudParams;
  const params = event.params || {};

  const { data: users } = await db.collection('user').where({
    phone: params.phone,
    name: params.name
  }).get();
  if (users.length > 0) {
    return {
      success: false,
      errorMessage: '该手机号和姓名已注册',
      data: {}
    };
  }

  try {
    const data = await db.collection('user').add({
      data: {
        phone: params.phone,
        name: params.name,
        sex: params.sex,
        isAdmin: false,
        password: '',
        createdAt: new Date(),
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
      errorMessage: '注册失败',
      data: {}
    };
  }
};