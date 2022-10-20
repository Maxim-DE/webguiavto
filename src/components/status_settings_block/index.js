import React from 'react';

import './index.css'
import FormInput from '../form_input';

import { TbPlus } from 'react-icons/tb'
import { TbMinus } from 'react-icons/tb'

import Settings_block_calib from '../settings_block_calib';

function Status_settings(props) {

  const [statusSettingsState, setStatusSettingsState] = React.useState({
    supply_on_setting: 0,
  })

  React.useEffect(() => {
    if (props.settings_data != undefined &&
        Object.keys(props.settings_data).length != 0) {
      let state_copy = {}

      for (const key in props.settings_data) {
        state_copy[key] = props.settings_data[key]
      }

      setStatusSettingsState(state_copy)

    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? (+ target.checked) : target.value;
    const name = target.name;

    setStatusSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))

    const request_obj = {
      address: 'transmitter.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)
  }

  const plusMinusHandler = (event) => {

    event.preventDefault()

    const target = event.currentTarget,
      name = target.name

    let target_data = name.split('_'),
      action = target_data[0],
      action_value = parseInt(target_data[2])

    console.log(target_data);

    let output_string = `power_${action}$${action_value}`

    const request_obj = {
      address: 'transmitter.cgi',
      data: output_string,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)

  }

  const power_save_handleClick = (event) => {
    const request_obj = {
      address: 'transmitter.cgi',
      data: `save_power$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`настройки`}
      settings_type={`status_calib`}
      section_name={props.section_name}>
      <li
        key='supply_on_setting'
        id='supply_on_setting'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`supply_on_setting_input`}
            className="settings_itemLabel">
            Выкл./вкл. питание устройства
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`supply_on_setting_input`}
            name={`supply_on_setting`}
            changeHandler={handleChange}
            input_value={statusSettingsState.supply_on_setting}
            type="switch" />
        </div>
      </li>
      <li
        key='power_setting'
        id='power_setting'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`power_setting_input`}
            className="settings_itemLabel">
            Изменение мощности
          </label>
        </div>
        <div className='item_input'>

          {/* <FormInput
            id={`power_setting_input`}
            name={`power_setting`}
            changeHandler={handleChange}
            input_value={statusSettingsState.power_setting}
            statusHandler={setStatusSettingsState}
            type="text_buttons" /> */}
          
          <button
            className='button_input plus_minus'
            name='minus_value_3'
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <TbMinus />
            3
          </button>
          <button
            className='button_input plus_minus'
            name='minus_value_1'
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <TbMinus />
            1
          </button>
          <button
            className='button_input plus_minus'
            name='plus_value_1'
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <TbPlus />
            1
          </button>
          <button
            className='button_input plus_minus'
            name='plus_value_3'
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <TbPlus />
            3
          </button>
          <FormInput
            id={`status_save_power_input`}
            name={`status_save_power`}
            label='Сохр.'
            clickHandler={power_save_handleClick}
            type="button"
            />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default Status_settings;
