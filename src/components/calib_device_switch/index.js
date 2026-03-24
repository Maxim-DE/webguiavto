import React from 'react'
import './index.css'
import { getRandomColor } from '../../logic/utilites'
import FormInput from '../form_input'
import { dataArray_to_string } from '../../logic/request_logic'
import { reducers } from '../../store/reducers/avr_control_reducers'
import { new_status_colors } from '../graph_blocks'

const device_amount = 1 // количество вкладок прд

function CalibDeviceSwitch({ clickHandler, parent_state, state_handler, device_avaliability, settings_type, ...props }) {
  const amount_arr = [...Array(device_amount).keys()].map(i => i + 1)

  const device_num = parent_state.active_device,
        deviceAvaliability = device_avaliability

  React.useEffect(() => {
    create_DeviceRequest(parent_state.active_device)
  }, [parent_state.active_device])

  const handle_deviceChange = (event) => {
    const target = event.target,
      value = target.name.replace('avr_device_', '')

    handle_DeviceNum(value)
  }

  const handle_deviceAvailiableChange = (event) => {
    const target = event.target,
          device_num = target.name.replace(/(device_)|(_available)/g, ''),
          device_bool = Number(target.checked)

    handle_DeviceAvailiable(device_num, device_bool)
  }

  const handle_DeviceNum = (value) => {
    state_handler(prevState => ({
      ...prevState,
      active_device: value
    }))
  }


  const create_DeviceRequest = (device_num) => {
    const request_obj = {
      address: `get_avr_device_info.cgi`,
      data: `avr_device$${Number(device_num)};`,
      reducer: reducers.get_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }

  const handle_DeviceAvailiable = (value, bool) => {
    let data_to_transfer = Object.assign({}, parent_state.device_avaliability)

    data_to_transfer[`device_${value}`] = bool

    // state_handler(prevState => ({
    //   ...prevState,
    //   device_avaliability: data_to_transfer
    // }))

    const req_data_str = dataArray_to_string(data_to_transfer)

    const request_obj = {
      address: `get_avr_device_availiable.cgi`,
      data: req_data_str,
      reducer: reducers.get_avr_device_availability,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        device_avaliability: data_to_transfer
      }
    }

    clickHandler(request_obj);
  }

  return (
    <div className='avr_device_switch'>
      {amount_arr.map((item, index) => {
        const device_status = deviceAvaliability[`exiter_${item}`].status,
              indicator_styles = {
                background: new_status_colors[device_status]
              }

        return (
          <>
          <div className="avr_device_item_wrap" key={item}>
            {/* <FormInput
              id={`device_${item}_available_input`}
              name={`device_${item}_available`}
              changeHandler={handle_deviceAvailiableChange}
              input_value={deviceAvaliability[`exiter_${item}`].status}
              type="checkbox" /> */}
            <button
              className={`avr_device_item button_input ${device_num == item ? 'active_type' : ''}`}
              type='button'
              name={`avr_device_${item}`}
              onClick={handle_deviceChange}
              >
              <div className="device_indicator" style={indicator_styles}></div>
              Передатчик {item}
            </button>
          </div>
          <div className="vertical_li_divider" key={`${item}_vdiv`}></div>
          </>
        )
      })}
      {settings_type == 1 &&
        <div className="avr_device_item_wrap" key={0}>
          <button
            className={`avr_device_item button_input ${device_num == 0 ? 'active_type' : ''}`}
            type='button'
            name={`avr_device_${0}`}
            onClick={handle_deviceChange}
            >
            <div className="device_indicator" style={{
              background: new_status_colors[deviceAvaliability[`exiter_${0}`].status]
            }}></div>
            Рез. передатчик
          </button>
        </div>
      }
    </div>
  )
}

export default CalibDeviceSwitch