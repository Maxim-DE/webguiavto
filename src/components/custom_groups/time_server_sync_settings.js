import React from 'react'

import FormInput from '../form_input'
import '../form_input/index.css'
import '../settings_block/index.css'

export const time_server_sync_settings = {
  'render_structure': function (form_handler, block_state, group_id, group_name) {
    return (
      <>
        <li
          key={group_id}
          id={group_id}
          className="settings_item group_divider">
          <label
            htmlFor={`${group_id}_input`}
            className="settings_itemLabel">
            {group_name}
          </label>
          <FormInput
            id={`${group_id}_input`}
            name={`${group_id}_switch`}
            value={block_state[group_id]}
            type="switch"
            changeHandler={form_handler} />
        </li>
        {block_state.time_server_sync_switch == true &&
        <>
        <li
          key='time_sync_server_ip'
          id='time_sync_server_ip'
          className="settings_item">
          <label
            htmlFor={`time_sync_server_ip_input`}
            className="settings_itemLabel">
            IP сервера
          </label>
          <FormInput
            id={`time_sync_server_ip_input`}
            name={`time_sync_server_ip`}
            type="text"
            changeHandler={form_handler}
            input_value={block_state.time_sync_server_ip} />
        </li>
        <li
          key='time_sync_timezone'
          id='time_sync_timezone'
          className="settings_item">
          <label
            htmlFor={`time_sync_timezone_input`}
            className="settings_itemLabel">
            Часовой пояс
          </label>
          <FormInput
            id={`time_sync_timezone_input`}
            name={`time_sync_timezone`}
            type="select"
            changeHandler={form_handler}
            input_value={block_state.time_sync_timezone}
            variants={[
              '-12',
              '-11',
              '-10',
              '-9',
              '-8',
              '-7',
              '-6',
              '-5',
              '-4',
              '-3',
              '-2',
              '-1',
              '0',
              '+1',
              '+2',
              '+3',
              '+4',
              '+5',
              '+6',
              '+7',
              '+8',
              '+9',
              '+10',
              '+11',
              '+12',
            ]} />
        </li>
        <li
          key='time_sync_period'
          id='time_sync_period'
          className="settings_item">
          <label
            htmlFor={`time_sync_period_input`}
            className="settings_itemLabel">
            Период синхронизации, ч
          </label>
          <FormInput
            id={`time_sync_period_input`}
            name={`time_sync_period`}
            type="text"
            changeHandler={form_handler}
            input_value={block_state.time_sync_period} />
        </li>
        </>
        }
      </>
    )
  },

  'data_structure':[
    'time_sync_switch',
    'time_sync_server_ip',
    'time_sync_timezone',
    'time_sync_period'
  ]
}
