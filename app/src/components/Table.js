// 导入react
import React from 'react';
// 导入antd相关组件
import {Table, Button, message, PageHeader} from 'antd';
// 导入antd的icon图标库
import {DeleteOutlined} from '@ant-design/icons'
// 导入数据请求相关函数
import {getTodoList, changeStatus} from "../network/todo";
// 导入编辑任务组件
import Edit from "./Edit";
// 导入添加任务组件
import Add from "./Add";

// 全局保存this
let that;


//设置表头
const columns = [{
  title: "标题",
  dataIndex: "name",
  align: "center",
}, {
  title: "内容",
  dataIndex: "content",
  align: "center"
}, {
  title: "截止时间",
  dataIndex: "deadline",
  align: "center",
  sorter: {//排序
    compare: (a, b) => {
      // 转换为时间戳
      a = new Date(a.deadline).getTime()
      b = new Date(b.deadline).getTime()
      return a - b;
    },
    multiple: 2,
  },
}, {
  title: "状态",
  dataIndex: "status",
  align: "center",
  sorter: {//排序
    compare: (a, b) => a.status - b.status,
    multiple: 1,
  },
  render: (text, record, index) => {
    // 根据status返回任务的状态
    switch (text) {
      case 1:
        return <span>待办</span>;
      case 2:
        return <span>完成</span>;
      case 3:
        return <span>删除</span>;
      default:
        break;
    }
    
  }
}, {
  title: "操作",
  align: "center",
  filters: [//筛选列表
    {
      text: "待办",
      value: 1
    },
    {
      text: "完成",
      value: 2
    }
  ],
  // 筛选事件
  onFilter: (value, record) => record.status === value,
  render: (text, record, index) => {
    let title = '待办';
    let isShow = true
    
    //修改状态按钮
    function Active(props) {
      const isShow = props.isShow;
      // 判断是否显示按钮
      if (isShow) {
        return (
          <Button size={"small"} onClick={props.onClick}>
            {props.title}
          </Button>);
      }
      return <span></span>;
    }
    
    //删除按钮
    function Delete(props) {
      if (props.isShow) {
        return (
          <Button
            type="danger"
            size={"small"}
            icon={<DeleteOutlined/>}
            onClick={props.onClick}>
            删除
          </Button>)
      }
      return <span></span>
      
    }
    
    //判断状态
    switch (record.status) {
      case 1:
        title = '完成'
        break;
      case 2:
        title = '待办'
        break;
      case 3:
        isShow = false
        break;
      default:
      
    }
    return (//操作列的内容
      <div>
        <Button type={"primary"} size={"small"} onClick={editItem.bind(that, record)}>编辑</Button>
        <Active isShow={isShow} title={title} onClick={changeTodoStatus.bind(this, record)}/>
        <Delete isShow={isShow} onClick={deleteTodoItem.bind(this, record)}/>
      </div>)
  }
}];

/**
 * 点击编辑按钮事件
 * @param record
 */
function editItem(record) {
  this.setState({
    editModalVisible: true,
    currentEditData: record
  })
}

/**
 * 删除任务
 * @param record
 */
function deleteTodoItem(record) {
  let {id} = record;
  changeStatus(id, 3).then(res => {
    if (res.status === 200) {//判断是否删除成功
      // 重新获取数据，刷新列表
      that.getTodoList(that.state.status, that.state.currentPage, that.state.pageSize)
      message.success("删除成功", 1);
    } else {
      message.error('删除失败', 1)
    }
    
  })
}

/**
 * 改变任务状态按钮事件
 * @param record
 */
function changeTodoStatus(record) {
  let {id, status} = record;
  // 根据现在的状态判断应该修改的状态
  status = status === 1 ? 2 : 1;
  changeStatus(id, status).then(res => {
    if (res.status === 200) {//判断是否修改成功
      // 重新获取数据，刷新列表
      that.getTodoList(that.state.status, that.state.currentPage, that.state.pageSize)
      message.success("修改成功", 1)
    } else {
      message.error('修改失败', 1)
    }
    
  })
}


class Todo extends React.Component {
  state = {
    data: [],//任务列表数据
    status: -1,//展示的数据状态，默认为-1，表示展示全部状态的数据
    currentPage: 1,//当前页
    total: 0,//总条数
    pageSize: 10,//每页数据条数
    editModalVisible: false,//编辑弹窗是否显示
    addModalVisible: false,//添加弹窗是否显示
    currentEditData: {},//当前编辑项的旧数据
  };
  
  /**
   * 生命周期函数：第一次渲染后调用
   */
  componentDidMount() {
    // 获取分页数据
    this.getTodoList(this.state.status, this.state.currentPage, this.state.pageSize)
    // 存储this
    that = this;
  }
  
  
  /**
   * 获取分页数据
   * @param status
   * @param current
   * @param size
   */
  getTodoList(status, current, size) {
    getTodoList(status, current, size).then(res => {
      this.setState({
        data: res.data.list.rows,
        total: res.data.list.count,
        // currentPage:th
      })
    })
  }
  
  /**
   * 分页改变数据
   * @param page
   * @param pageSize
   */
  todoListPageChange(page, pageSize) {
    //设置当前页数和每页条数
    this.setState({
      currentPage: page,
      pageSize
    })
    // 根据当前的页数和每页条数重新获取数据
    this.getTodoList(this.state.status, page, pageSize);
  }
  
  /**
   * 设置编辑弹窗的显示状态
   * @param status
   */
  setEditShow(status) {
    this.setState({
      editModalVisible: status
    })
  }
  
  /**
   * 设置添加弹窗的显示状态
   * @param status
   */
  setAddShow(status) {
    this.setState({
      addModalVisible: status
    })
  }
  
  /**
   * 编辑完成
   */
  editOk() {
    this.setEditShow(false);
    this.getTodoList(this.state.status, this.state.currentPage, this.state.pageSize)
  }
  
  /**
   * 添加完成
   */
  addOk() {
    this.setAddShow(false);
    this.getTodoList(this.state.status, this.state.currentPage, this.state.pageSize)
  }
  
  render() {
    return (
      <div>
        <PageHeader
          ghost={false}
          title="Todo-List"
          extra={[
            <Button key="1" type="primary" onClick={this.setAddShow.bind(this, true)}>
              添加
            </Button>,
          ]}
        >
        </PageHeader>
        <Table
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={{
            total: this.state.total,
            current: this.state.currentPage,
            showSizeChanger: true,
            onChange: this.todoListPageChange.bind(this)
          }}
          rowKey="id"/>
        <Edit
          isShow={this.state.editModalVisible}
          data={this.state.currentEditData}
          changeShow={this.setEditShow.bind(this)}
          ok={this.editOk.bind(this)}/>
        <Add
          isShow={this.state.addModalVisible}
          changeShow={this.setAddShow.bind(this)}
          ok={this.addOk.bind(this)}/>
      </div>
    )
  }
  
  
}

export default Todo;