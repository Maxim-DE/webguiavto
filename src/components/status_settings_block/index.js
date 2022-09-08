import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'
import FormInput from '../form_input';

const settings_items = [
  {id: 'device_supply', name: "Питание передатчика", type: "switch"},
  {id: 'rds_mode', name: "Включить RDS", type: "switch"},
  {id: 'freq_control', name: "Изменение цастоты, МГц", type: "text"},
  {id: 'output_control', name: "Изменение мощности, Вт", type: "text_with_buttons"},
]

function Status_settings({settings_type, className = "", ...rest}) {
  return (
    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <div className="settings_block_header">
        <h3>{rest.header}</h3>
      </div>
      <div className="settings_container">
        <ul className="settings_list">
          {settings_items.map(item => (
            <li
              key={item.id}
              id={item.id}
              className="settings_item">
              <label
                htmlFor={`${item.id}_input`}
                className="settings_itemLabel">
                {item.name}
              </label>
              <FormInput
                id={`${item.id}_input`}
                name={item.id}
                type={item.type}
                // changeHandler={updateBlock}
                input_value={17}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Status_settings;
