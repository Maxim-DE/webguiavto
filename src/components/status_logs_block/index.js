import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

const log_items = [
  {id: '0', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '1', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '2', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '3', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '4', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '5', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
]

function Status_logs({settings_type, className = "", ...rest}) {
  return (
    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <div className="settings_container">
        <div className="settings_block_header">
          <h3>{rest.header}</h3>
        </div>
        <div className="logs_header">
          <span className="header_num">№</span>
          <span className="header_message">сообщение</span>
          <span className="header_time">дата и время</span>
        </div>
        <ul className="log_list">
          {log_items.map(item => (
            <li
              key={item.id}
              id={`log_${item.id}`}
              className="log_item">
              <span className="log_num">{item.id}</span>
              <span className="log_message">{item.message}</span>
              <span className="log_time">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Status_logs;
