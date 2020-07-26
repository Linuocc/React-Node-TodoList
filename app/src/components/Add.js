import React from "react";
import {Modal, Input, DatePicker,message} from 'antd';
import moment from 'moment';
import {add} from "../network/todo";


class Add extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      content: '',
      deadline: ''
    };
  }
  
  /**
   * 关闭编辑面板
   */
  closeModal() {
    this.props.changeShow(false);
    this.setState({
      name: '',
      content: '',
      deadline: ''
    })
  }
  
  /**
   * 输入变化
   * @param e
   */
  changeInput(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  
  disabledDate(current) {
    return current && current < moment().subtract(1, "days");
  }
  
  /**
   * 选择时间
   * @param value
   * @param date
   */
  dateTimeOk(value, date) {
    this.setState({
      deadline: date
    })
  }
  
  /**
   * 保存
   */
  save() {
    let params = {};
    if (this.state.name && this.state.name.length > 0) {
      params.name = this.state.name
    }
    if (this.state.content && this.state.content.length > 0) {
      params.content = this.state.content
    }
    if (this.state.deadline && this.state.deadline.length > 0) {
      params.deadline = this.state.deadline
    }
    
    add({
      ...params
    }).then(res => {
      if (res.status === 200) {
        message.success("添加成功",1)
        this.props.ok();
        this.setState({
          name: '',
          content: '',
          deadline: ''
        })
      }
    })
  }
  
  render() {
    
    return (
      <Modal title={"添加任务"} visible={this.props.isShow} onCancel={this.closeModal.bind(this)}
             onOk={this.save.bind(this)}>
        <div style={{marginBottom: 16}}>
          <Input addonBefore={"名字"} id={"name"} value={this.state.name} onChange={this.changeInput.bind(this)}></Input>
        </div>
        <div style={{marginBottom: 16}}>
          <Input addonBefore={"内容"} id={"content"} value={this.state.content}
                 onChange={this.changeInput.bind(this)}></Input>
        </div>
        <DatePicker
          showTime
          showNow={false}
          // defaultValue={moment(moment(), 'YYYY-MM-DD')}
          onChange={this.dateTimeOk.bind(this)}
          disabledDate={this.disabledDate}/>
      </Modal>
    )
  }
}


export default Add;