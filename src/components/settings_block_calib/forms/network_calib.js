import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';

export default function NetworkCalibSettings(props) {

  const [networkCalibState, setNetworkCalibState] = React.useState({
    req_period: '',
    retry_time_value: '',
    retry_count: '',
    keep_alive_timeout: ''
  })

  React.useEffect(() => {
    if (!props.calib_data) {
      return
    }

    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = cloneDeep(networkCalibState)

      for (const key in props.calib_data) {
        if (Array.isArray(props.calib_data[key])) {
          const divident = props.calib_data[key][0],
            divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
            digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = props.calib_data[key]
        }
      }

      setNetworkCalibState(calib_state_copy)

    }
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setNetworkCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value, state_to_save

    if (Array.isArray(props.calib_data[name])) {
      value = networkCalibState[name] * 10
      let state_obj = { [name]: value }
      state_to_save = calib_state_conversion(state_obj, props.calib_data)
    } else {
      value = networkCalibState[name]
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_network.cgi',
      data: `${name}$${value}`,
      update_data: networkCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_current: {
          current_value: state_to_save
        }
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`сетевые настройки`}
      settings_type={`network_calib`}
      section_name={props.section_name}>
      <li
        key='req_period'
        id='req_period'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`req_period_input`}
            className="settings_itemLabel">
            Период запросов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`req_period_input`}
            name={`req_period`}
            changeHandler={handleChange}
            input_value={networkCalibState.req_period}
            type="text" />
          <FormInput
            id={`req_period_save`}
            name={`req_period`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='retry_time_value'
        id='retry_time_value'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`retry_time_value_input`}
            className="settings_itemLabel">
            Период попытки повт. соединения
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`retry_time_value_input`}
            name={`retry_time_value`}
            changeHandler={handleChange}
            input_value={networkCalibState.retry_time_value}
            type="text" />
          <FormInput
            id={`retry_time_value_save`}
            name={`retry_time_value`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='retry_count'
        id='retry_count'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`retry_count_input`}
            className="settings_itemLabel">
            Кол-во попыток повт. соединения
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`retry_count_input`}
            name={`retry_count`}
            changeHandler={handleChange}
            input_value={networkCalibState.retry_count}
            type="text" />
          <FormInput
            id={`retry_count_save`}
            name={`retry_count`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='keep_alive_timeout'
        id='keep_alive_timeout'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`keep_alive_timeout_input`}
            className="settings_itemLabel">
            Keep Alive Timeout
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`keep_alive_timeout_input`}
            name={`keep_alive_timeout`}
            changeHandler={handleChange}
            input_value={networkCalibState.keep_alive_timeout}
            type="text" />
          <FormInput
            id={`keep_alive_timeout_save`}
            name={`keep_alive_timeout`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )

}