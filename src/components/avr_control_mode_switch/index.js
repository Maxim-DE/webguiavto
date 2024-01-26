import React from 'react'
import './index.css'
import { getRandomColor } from '../../logic/utilites'
import FormInput from '../form_input'
import { dataArray_to_string } from '../../logic/request_logic'
import { reducers } from '../../store/reducers/avr_control_reducers'


function AVRControlModeSwitch({ clickHandler, parent_state, ...props }) {
  const active_control_mode = parent_state.active_control_mode

  const handle_modeChange = (event) => {
    const target = event.target,
          value = target.name.replace('avr_mode_', '')

    create_ModeRequest(value)
  }

  const create_ModeRequest = (mode_num) => {
    const request_obj = {
      address: `set_avr_control_mode.cgi`,
      data: `mode$${Number(mode_num)};`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }

  return (
    <div className='avr_device_switch'>
      <span className='control_mode_label'>режим управления: </span>
      <div className="control_switch_wrap">
        <div className="avr_device_item_wrap">
          <button
            className={`avr_control_mode button_input ${active_control_mode == 0 ? 'active_type' : ''}`}
            type='button'
            name={`avr_mode_${0}`}
            onClick={handle_modeChange}
          >
            автомат.
          </button>
        </div>
        <div className="vertical_li_divider" ></div>
        <div className="avr_device_item_wrap">
          <button
            className={`avr_control_mode button_input ${active_control_mode == 1 ? 'active_type' : ''}`}
            type='button'
            name={`avr_mode_${1}`}
            onClick={handle_modeChange}
            >
            ручной
          </button>
        </div>
      </div>
      </div>
  )
}

export default AVRControlModeSwitch