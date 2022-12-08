import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'

export default function Device_address(props) {
  const [deviceAddressState, setDeviceAddressState] = React.useState({
    mac_defаult_settings: '',
    mac_settings: '',
    ip_settings: '',
    subnet_mask_settings: '',
    gateway_settings: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.settings_data).length != 0) {
      let settings_state_copy = deviceAddressState

      for (const key in props.settings_data) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setDeviceAddressState(settings_state_copy)
    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setDeviceAddressState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(deviceAddressState)

    const request_obj = {
      address: 'set_device_adress.cgi',
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap 
      header={'адрес устройства'}
      settings_type={'device_adress'}
      section_name={props.section_name}
      save_handler={handleClick_save}>

      <li
        key='mac_defаult_settings'
        id='mac_defаult_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mac_defаult_settings_input`}
            className="settings_itemLabel">
            Дефолтный MAC-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mac_defаult_settings_input`}
            name={`mac_defаult_settings`}
            changeHandler={handleChange}
            input_value={deviceAddressState.mac_defаult_settings}
            type="text" />
        </div>
      </li>
      <li
        key='mac_settings'
        id='mac_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mac_settings_input`}
            className="settings_itemLabel">
            MAC-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mac_settings_input`}
            name={`mac_settings`}
            changeHandler={handleChange}
            input_value={deviceAddressState.mac_settings}
            type="text" />
        </div>
      </li>
      <li
        key='ip_settings'
        id='ip_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`ip_settings`}
            className="settings_itemLabel">
            IP-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`ip_settings_input`}
            name={`ip_settings`}
            changeHandler={handleChange}
            input_value={deviceAddressState.ip_settings}
            type="text" />
        </div>
      </li>
      <li
        key='subnet_mask_settings'
        id='subnet_mask_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`subnet_mask_settings`}
            className="settings_itemLabel">
            Маска подсети
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`subnet_mask_settings_input`}
            name={`subnet_mask_settings`}
            changeHandler={handleChange}
            input_value={deviceAddressState.subnet_mask_settings}
            type="text" />
        </div>
      </li>
      <li
        key='gateway_settings'
        id='gateway_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`gateway_settings`}
            className="settings_itemLabel">
            Шлюз
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`gateway_settings_input`}
            name={`gateway_settings`}
            changeHandler={handleChange}
            input_value={deviceAddressState.gateway_settings}
            type="text" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
