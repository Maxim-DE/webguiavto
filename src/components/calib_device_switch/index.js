import React from 'react'
import './index.css'
import { getRandomColor } from '../../logic/utilites'

const device_amount = 3
const indicator_colors_arr = [...Array(device_amount).keys()].map(i => getRandomColor())

function CalibDeviceSwitch({device_num, deviceNum_handler, ...props}) {
  const amount_arr = [...Array(device_amount).keys()].map(i => i + 1)

  const handle_deviceChange = (event) => {
    const target = event.target,
          value = target.name.replace('avr_device_', '')

    deviceNum_handler(value)
  }

  return (
    <div className='avr_device_switch'>
      {amount_arr.map((item, index) => {
        const indicator_styles = {
          background: indicator_colors_arr[index]
        }

        return (
        <button
          className={`avr_device_item button_input ${device_num == index ? 'active_type' : ''}`}
          type='button'
          name={`avr_device_${index}`}
          onClick={handle_deviceChange}
          key={item}>
          <div className="device_indicator" style={indicator_styles}></div>
          Передатчик {item}
        </button>
        )
      })}
    </div>
  )
}

export default CalibDeviceSwitch