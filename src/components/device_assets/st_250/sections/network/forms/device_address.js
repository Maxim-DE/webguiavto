import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import { reducers } from '../../../../../../core_store_reducers'
import { useSelector } from 'react-redux'

export default function Device_address(props) {
  const deviceAddress_store = useSelector((store) => store.globalStore.global_data.section_data.network.device_adress)

  const [deviceAddressState, setDeviceAddressState] = React.useState({
    mac_deafult: '',
    mac: '',
    ip: '',
    subnet_mask: '',
    gateway: ''
  })

  React.useEffect(() => {
    console.log(deviceAddress_store);

    if (deviceAddress_store != 'null' && deviceAddress_store != undefined) {
      let settings_state_copy = deviceAddressState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = deviceAddress_store[key]
      }

      setDeviceAddressState(settings_state_copy)
    }
  }, [deviceAddress_store])

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
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.section_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        device_adress: deviceAddressState
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
        key='mac_deafult'
        id='mac_deafult'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mac_deafult_input`}
            className="settings_itemLabel">
            Дефолтный MAC-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mac_deafult_input`}
            name={`mac_deafult`}
            changeHandler={handleChange}
            input_value={deviceAddressState.mac_deafult}
            type="text" />
        </div>
      </li>
      <li
        key='mac'
        id='mac'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mac_input`}
            className="settings_itemLabel">
            MAC-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mac_input`}
            name={`mac`}
            changeHandler={handleChange}
            input_value={deviceAddressState.mac}
            type="text" />
        </div>
      </li>
      <li
        key='ip'
        id='ip'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`ip`}
            className="settings_itemLabel">
            IP-адрес
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`ip_input`}
            name={`ip`}
            changeHandler={handleChange}
            input_value={deviceAddressState.ip}
            type="text" />
        </div>
      </li>
      <li
        key='subnet_mask'
        id='subnet_mask'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`subnet_mask`}
            className="settings_itemLabel">
            Маска подсети
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`subnet_mask_input`}
            name={`subnet_mask`}
            changeHandler={handleChange}
            input_value={deviceAddressState.subnet_mask}
            type="text" />
        </div>
      </li>
      <li
        key='gateway'
        id='gateway'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`gateway`}
            className="settings_itemLabel">
            Шлюз
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`gateway_input`}
            name={`gateway`}
            changeHandler={handleChange}
            input_value={deviceAddressState.gateway}
            type="text" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
