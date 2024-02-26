import React from 'react';

import './index.css'
import FormInput from '../form_input';

import { BiPlus, BiPlusCircle, BiMinus, BiMinusCircle } from "react-icons/bi";


import Settings_block_calib from '../settings_block_calib';
import { reducers } from '../../store/reducers/status_settings_reducers';
import { cloneDeep } from 'lodash';
import { useFormValidation } from '../../logic/validation/formValidation_hook';
import { isInNumRange, isNumber } from '../../logic/validation/validators';

const freq_ranges = {
  0: [87.5, 108],
  1: [65.9, 74.0],
  2: [65.9, 108]
}
  
  

function Status_settings(props) {

  const [statusSettingsState, setStatusSettingsState] = React.useState({
    supply_on_setting: 0,
    channel_setting: 0,
    ModeOneChannel: 0,
    frequency_setting: 0,
    frequency_range: 1
  })

  const { isFormValid, validStatus_getter, validInputList } = useFormValidation()

  const device_status = props.status_data ? props.status_data.device_status : 0,
        device_locked = device_status === 3 ? true : false

  const low_freq_range = freq_ranges[statusSettingsState.frequency_range] ? freq_ranges[statusSettingsState.frequency_range][0] : freq_ranges[2][0],
        high_freq_range = freq_ranges[statusSettingsState.frequency_range] ? freq_ranges[statusSettingsState.frequency_range][1] : freq_ranges[2][1]

  React.useEffect(() => {
    let status_settings_req_obj = {
      address: 'get_transmitter.cgi',
      reducer: reducers.transmitter,
      notifications: {
        good: 'none',
        bad: 'default'
      },
    }  

    props.updateHandler(status_settings_req_obj)
  }, [])

  React.useEffect(() => {
    if (props.settings_data != undefined &&
        Object.keys(props.settings_data).length != 0) {
      let state_copy = statusSettingsState

      for (const key in props.settings_data) {
        if (Array.isArray(props.settings_data[key])) {
          const divident = props.settings_data[key][0],
                divider = props.settings_data[key][1] == 0 ? 1 : props.settings_data[key][1],
                digits = Math.log10(divider)
          state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          state_copy[key] = props.settings_data[key]
        }
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
      },
      reducer: reducers.transmitter,
      error_handler:() => {
        const state_clone = cloneDeep(statusSettingsState)
        setStatusSettingsState(state_clone)
      },
      save_data: {
        ...statusSettingsState,
        [name]: value
      }
    }

    props.updateHandler(request_obj)
  }

  const handleChange_channel = (event) => { //сделать позже так, разделением
    const target = event.target;
    const value = target.type === 'checkbox' ? (+ target.checked) : target.value;
    const name = target.name;

    setStatusSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))

    // const request_obj = {
    //   address: 'transmitter.cgi',
    //   data: `${name}$${value}`,
    //   notifications: {
    //     good: 'default',
    //     bad: 'default'
    //   }
    // }

    // props.updateHandler(request_obj)
  } 

  const plusMinusHandler = (event) => {

    event.preventDefault()

    const target = event.currentTarget,
      name = target.name

    // let target_data = name.split('_'),
    //   action = target_data[0],
    //   action_value = parseInt(target_data[2])

    // console.log(target_data);

    let output_string = `power_${name}$0`

    const request_obj = {
      address: 'transmitter.cgi',
      data: output_string,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      // save_data: statusSettingsState
    }

    props.updateHandler(request_obj)

  }

  const power_save_handleClick = (event) => {
    const request_obj = {
      address: 'transmitter.cgi',
      data: `save_power$1`,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      // save_data: statusSettingsState
    }

    props.updateHandler(request_obj)
  }

  const channel_save_handleClick = (event) => { //сделать позже так, разделением
    const name = event.target.name,
          value_type = name.replace('_save', '')

    let value = parseFloat(statusSettingsState[`${value_type}_setting`].replaceAll(',', '.')),
        divider

    if (props.settings_data[`${value_type}_setting`]) {
      if (Array.isArray(props.settings_data[`${value_type}_setting`])) {
        divider = props.settings_data[`${value_type}_setting`][1]
      } else {
        divider = 1
      }
    } else {
      divider = 1
    }

    console.log((statusSettingsState[`${value_type}_setting`] * 100).toFixed());

    let request_obj = {}

    switch (value_type) {
      case 'channel':
        request_obj = {
          address: 'transmitter.cgi',
          data: `set_${value_type}$${value}`,
          reducer: reducers.transmitter,
          notifications: {
            good: 'default',
            bad: 'default'
          },
          save_data: statusSettingsState
        }
      
        break

      case 'frequency':
        request_obj = {
          address: 'transmitter.cgi',
          data: `${name}$${(value * divider).toFixed()}`,
          reducer: reducers.transmitter,
          notifications: {
            good: 'default',
            bad: 'default'
          },
          save_data: {
            [`${value_type}_setting`]: [+(value * divider).toFixed(), divider]
          }
        }

        break
    }

    props.updateHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`настройки`}
      settings_type={`status_calib`}
      section_name={props.section_name} >
      {/* <li
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
            disabled={device_locked}
            changeHandler={handleChange}
            input_value={statusSettingsState.supply_on_setting}
            type="switch" />
        </div>
      </li> */}
      {props.device_type == 0 &&
        <>
          <li
            key='freq_setting'
            id='freq_setting'
            className="settings_item">
            <div className='item_header'>
              <label
                htmlFor={`freq_setting_input`}
                className="settings_itemLabel">
                Изменение частоты
              </label>
            </div>
            <div className='item_input'>
              {/* <input
                id={`frequency_setting_input`}
                name={`frequency_setting`}
                type="number"
                className={`${device_locked ? 'disabled_input' : ''}`}
                disabled={device_locked}
                onChange={handleChange_channel}
                value={statusSettingsState.frequency_setting}
                placeholder='Гц'
                // maxLength="2"
                max={108}
                min={87.5}
                step={0.1}
                style={{ maxWidth: '72px', marginRight: '10px' }}
              /> */}
              <FormInput
                id={`frequency_setting_input`}
                name={`frequency_setting`}
                changeHandler={handleChange_channel}
                input_value={statusSettingsState.frequency_setting}
                style={{ margin: '0', maxWidth: '86px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setStatusSettingsState}
                max={high_freq_range}
                min={low_freq_range}
                step={0.1}
                validators={[
                  isNumber(),
                  isInNumRange(low_freq_range, high_freq_range)
                ]}
                formValidHandler={validStatus_getter}
                 />
              <FormInput
                id={`frequency_save_input`}
                name={`frequency_save`}
                label='Сохранить'
                disabled={device_locked || !validInputList[`frequency_setting`]}
                clickHandler={channel_save_handleClick}
                type="button" />
              {/* <FormInput
              id={`channel_setting_input`}
              name={`channel_setting`}
              changeHandler={handleChange}
              input_value={statusSettingsState.channel_setting}
              type="text" /> */}
            </div>
          </li>
        </>
      }
      {props.device_type == 1 &&
       statusSettingsState.ModeOneChannel == 1 &&
        <>
        <li
          key='channel_setting'
          id='channel_setting'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`channel_setting_input`}
              className="settings_itemLabel">
              Изменение канала
            </label>
          </div>
          <div className='item_input'>
            <input
              id={`channel_setting_input`}
              name={`channel_setting`}
              type="number"
              className={`${device_locked ? 'disabled_input' : ''}`}
              disabled={device_locked}
              onChange={handleChange_channel}
              value={statusSettingsState.channel_setting}
              min={6}
              max={80}
              maxLength="2"
              style={{ maxWidth: '55px', marginRight: '10px'}}
            />
            <FormInput
              id={`channel_save_input`}
              name={`channel_save`}
              label='Сохранить'
              disabled={device_locked}
              clickHandler={channel_save_handleClick}
              type="button"
            />
            {/* <FormInput
              id={`channel_setting_input`}
              name={`channel_setting`}
              changeHandler={handleChange}
              input_value={statusSettingsState.channel_setting}
              type="text" /> */}
          </div>
        </li>
        </>
      }
      {/* <li className="group_divider"></li>
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
          <FormInput
            id={`power_setting_input`}
            name={`power_setting`}
            changeHandler={handleChange}
            input_value={statusSettingsState.power_setting}
            statusHandler={setStatusSettingsState}
            type="text_buttons" />
          
          <button
            className={`button_input plus_minus ${device_locked ? 'disabled_input' : ''}`}
            name='minus_big_step'
            disabled={device_locked}
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <BiMinusCircle />
          </button>
          <button
            className={`button_input plus_minus ${device_locked ? 'disabled_input' : ''}`}
            name='minus_small_step'
            disabled={device_locked}
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <BiMinus />
          </button>
          <button
            className={`button_input plus_minus ${device_locked ? 'disabled_input' : ''}`}
            name='plus_small_step'
            disabled={device_locked}
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <BiPlus />
          </button>
          <button
            className={`button_input plus_minus ${device_locked ? 'disabled_input' : ''}`}
            name='plus_big_step'
            disabled={device_locked}
            onClick={(e) => {
              plusMinusHandler(e)
            }}
            >
            <BiPlusCircle />
          </button>
        </div>
      </li> */}
      {/* <li
        key='status_save_power_setting'
        id='status_save_power_setting'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`status_save_power_input`}
            className="settings_itemLabel">
            Фиксация мощности
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`status_save_power_input`}
            name={`status_save_power`}
            label='Фиксировать'
            disabled={device_locked}
            clickHandler={power_save_handleClick}
            type="button"
            />
        </div>
      </li> */}
    </Settings_block_calib>
  )
}

export default Status_settings;
