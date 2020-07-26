const express = require('express');
const bodyParser = require('body-parser');
//导入模型
const modules = require('../db/models');
const {Op} = require('sequelize');

const app = express();

app.use(express.json());

app.use(express.urlencoded());

app.use(bodyParser.urlencoded({extended: true}));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

/**
 * 查询任务列表
 */
app.get('/list/:status/:page/:limit', async (req, res) => {
  let {status, page, limit} = req.params;
  //数据偏移量
  let offset = (page - 1) * limit;
  let where = {
    [Op.not]:[
      {status:[3]}
    ]
  };
  //1.状态（1：待办，2：完成，3：删除，-1：全部）
  if (status != -1) {
    where.status = status;
  }
  //2.分页
  let list = await modules.Todo.findAndCountAll({
    where,
    offset,
    limit:limit*1,
    order: [
      ['id', 'DESC']
    ]
    
  });
  res.json({
    msg: "查询成功",
    list
  })
  
});

/**
 * 创建todo
 */
app.post('/create', async (req, res, next) => {
  try {
    let {name, deadline, content} = req.body;
    //数据持久到数据库
    let todo = await modules.Todo.create({
      name,
      deadline,
      content
    });
    res.json({
      msg: "创建成功",
      todo
    })
  } catch (err) {
    next(err);
  }
  
})

/**
 * 修改todo
 */
app.post('/update', async (req, res, next) => {
  try {
    let {name, deadline, content, id} = req.body;
    //根据id查找任务
    let todo = await modules.Todo.findOne({
      where: {
        id
      }
    });
    //判断是否存在
    if (todo) {
      //执行更新
      todo = await todo.update({
        name,
        deadline,
        content
      })
    }
    res.json({
      msg: "修改成功",
      todo
    })
  } catch (err) {
    next(err);
  }
  
})
/**
 * 修改一个todo的状态
 */
app.post('/update_status', async (req, res, next) => {
  try {
    let {id, status} = req.body;
    //查找任务
    let todo = await modules.Todo.findOne({
      where: {
        id
      }
    });
    //判断是否存在
    if (todo && status != todo.status) {
      //更新操作
      todo = await todo.update({
        status
      })
    }
    res.json({
      msg: "修改成功",
      todo
    })
  } catch (err) {
    next(err);
  }
  
});


/**
 * 异常处理
 */
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      message: err.message
    })
  } else {
  
  }
})


app.listen(3600, () => {
  console.log("启动成功");
})