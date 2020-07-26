import React from 'react';
import zhCN from 'antd/es/locale/zh_CN'
import 'antd/dist/antd.css';
import Table from "./components/Table";
import {ConfigProvider} from "antd";

const App = () => (
  <ConfigProvider locale={zhCN}>
    <div className="App">
      <Table/>
    </div>
  </ConfigProvider>
);

export default App;
