import React from 'react';

import './index.css'
import FormInput from '../form_input';

import { BiPlus, BiPlusCircle, BiMinus, BiMinusCircle } from "react-icons/bi";


import Settings_block_calib from '../settings_block_calib';
import { reducers } from '../../store/reducers/status_settings_reducers';

function Status_settings(props) {

  const [statusSettingsState, setStatusSettingsState] = React.useState({
    supply_on_setting: 0,
    channel_setting: 0,
    freq_setting: 0
  })

  const device_status = props.status_data ? props.status_data.device_status : 0,
        device_locked = device_status === 3 ? true : false

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
      },
      reducer: reducers.transmitter,
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
    const value = statusSettingsState.channel_setting;
    const name = event.target.name;

    const request_obj = {
      address: 'transmitter.cgi',
      data: `${name}$${value}`,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: statusSettingsState
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
            disabled={device_locked}
            changeHandler={handleChange}
            input_value={statusSettingsState.supply_on_setting}
            type="switch" />
        </div>
      </li>
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
              <input
                id={`freq_setting_input`}
                name={`freq_setting`}
                type="text"
                className={`${device_locked ? 'disabled_input' : ''}`}
                disabled={device_locked}
                onChange={handleChange_channel}
                value={statusSettingsState.freq_setting}
                placeholder='Гц'
                // maxLength="2"
                style={{ maxWidth: '60px', marginRight: '10px' }}
              />
              <FormInput
                id={`freq_save_input`}
                name={`freq_save`}
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
      {props.device_type == 1 &&
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
              type="text"
              className={`${device_locked ? 'disabled_input' : ''}`}
              disabled={device_locked}
              onChange={handleChange_channel}
              value={statusSettingsState.channel_setting}
              maxLength="2"
              style={{ maxWidth: '35px', marginRight: '10px'}}
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
      <li className="group_divider"></li>
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
      </li>
      <li
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
      </li>
    </Settings_block_calib>
  )
}

export default Status_settings;
