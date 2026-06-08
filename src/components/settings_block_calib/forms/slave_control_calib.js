import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input'
import { BsFillLightningFill } from 'react-icons/bs'
import { FiPower, FiLink } from 'react-icons/fi'
import { TbMinus, TbPlus } from 'react-icons/tb'
import { BsMoonFill } from 'react-icons/bs'

const slave_devices = [
  { type: 'exiter', order_num: 1, label: 'Возбудитель 1' },
  { type: 'amplifier', order_num: 1, label: 'Усилитель 1' },
  { type: 'amplifier', order_num: 2, label: 'Усилитель 2' },
]

export default function Slave_control_calib({ clickHandler, ...rest }) {
  const [slaveControlState, setSlaveControlState] = React.useState({
    exiter_action: 0,
    amplifier_1_action: 0,
    amplifier_2_action: 0
  })

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name

    setSlaveControlState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_action = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name

    const [action, action_value, slave_type, slave_num] = name.split('_')

    const request_obj = {
      address: `slave_action_${action}.cgi`,
      data: `${slave_type}$${slave_num};${action_value}$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  }

  return (
    <Settings_block_calib
      header={`упр. устройствами`}
      settings_type={`slave_control_calib`} >
      {slave_devices.map((slave_device) => {
        return (
        <li
          key={`${slave_device.type}_${slave_device.order_num}`}
          id={`slave_${slave_device.type}_${slave_device.order_num}_calib`}
          className="settings_item calib">
          <div className='item_header'>
            <label
              className="settings_itemLabel">
              {`${slave_device.label}`}
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`slave_${slave_device.type}_${slave_device.order_num}_action_input`}
              name={`${slave_device.type}_${slave_device.order_num}_action`}
              class="calib_input"
              changeHandler={handleChange}
              input_value={slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`]}
              type="select"
              variants={[
                'Питание',
                'Мощность',
                'Sleep',
                'Modbus',
                slave_device.type == 'exiter' ? 'Управление' : undefined
              ]} />
            {slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`] == 0 &&
              <>
              <button
                id={`supply_on_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`supply_on_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                Вкл.
              </button>
              <button
                id={`supply_off_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`supply_off_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                Выкл.
              </button>
              </>
            }

            {slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`] == 1 &&
              <>
              <button
                id={`power_minus_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`power_minus_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                <TbMinus />
                1
              </button>
              <button
                id={`power_plus_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`power_plus_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                <TbPlus />
                1
              </button>
              </>
            }
            
            {slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`] == 2 &&
              <FormInput
                id={`sleep_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`sleep_sleep_${slave_device.type}_${slave_device.order_num}`}
                clickHandler={handleClick_action}
                label={
                  <>
                  Sleep
                  </>
                }
                type="button" />
            }

            {slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`] == 3 &&
              <>
              <button
                id={`modbus_m_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`modbus_m_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                M
              </button>
              <button
                id={`modbus_s_${slave_device.type}_${slave_device.order_num}_calib_input`}
                name={`modbus_s_${slave_device.type}_${slave_device.order_num}`}
                className={`button_input plus_minus`}
                type='button'
                onClick={(e) => {
                  handleClick_action(e)
                }}
              >
                S
              </button>
              </>
            }
            {slaveControlState[`${slave_device.type}_${slave_device.order_num}_action`] == 4 &&
              <>
                <button
                  id={`control_reset_${slave_device.type}_${slave_device.order_num}_calib_input`}
                  name={`control_reset_${slave_device.type}_${slave_device.order_num}`}
                  className={`button_input plus_minus`}
                  type='button'
                  onClick={(e) => {
                    handleClick_action(e)
                  }}
                >
                  Reset
                </button>
                <button
                  id={`control_pause_${slave_device.type}_${slave_device.order_num}_calib_input`}
                  name={`control_pause_${slave_device.type}_${slave_device.order_num}`}
                  className={`button_input plus_minus`}
                  type='button'
                  onClick={(e) => {
                    handleClick_action(e)
                  }}
                >
                  Pause
                </button>
                <button
                  id={`control_start_${slave_device.type}_${slave_device.order_num}_calib_input`}
                  name={`control_start_${slave_device.type}_${slave_device.order_num}`}
                  className={`button_input plus_minus`}
                  type='button'
                  onClick={(e) => {
                    handleClick_action(e)
                  }}
                >
                  Start
                </button>
              </>
            }
          </div>
        </li>
      )
      })}
    </Settings_block_calib>
  )
}
