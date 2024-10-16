# 数据表

## user 用户表

```js
{
    _id: string, // id
    phone: string,
    name: string,
    sex: string,
    password: string,
    isAdmin: boolean,
    createdAt: Date,
}
```

## course 课程表

```js
{
    _id: string,
    name: string, // 课程名称
    address: string, // 上课校区
    teacher: string, // 上课老师
    maxPeople: number, // 满班人数
    courseTime: number, // 课程时长(分钟)
    startTime: Date,
    isDelete: boolean,
    createdAt: Date,
}
```

## reservation 预约信息

```js
{
    _id: string,
    userId: string,
    courseId: string,
    status: number, // 预约状态 0: 排队 1: 已预约 2: 已取消
    createdAt: Date,
}
```
