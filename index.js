import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import MMFlowDemo from './demo';
import { Modal } from "antd";

ReactDOM.render(
    <Modal
        visible={true}
        width={900}
        title="Title"
    >
        <MMFlowDemo />
    </Modal>,
  document.getElementById('root')
);
