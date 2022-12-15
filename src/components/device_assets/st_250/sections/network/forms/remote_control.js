import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'

export default function Remote_control(props) {
  const [remoteControlState, setRemoteControlState] = React.useState({
    remote_ip_addr_1_settings: '',
    remote_ip_addr_2_settings: '',
    remote_ip_addr_3_settings: '',
    remote_ip_addr_4_settings: ''
  })

  React.useEffect(() => {
    if (props.settings_data != 'null' && props.settings_data != undefined) {
      let settings_state_copy = remoteControlState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setRemoteControlState(settings_state_copy)
    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setRemoteControlState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(remoteControlState)

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        remote_control: remoteControlState
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap 
      header={'управление устройством'}
      settings_type={'remote_control'}
      section_name={props.section_name}
      save_handler={handleClick_save}>
      <li
        key='remote_ip_addr_1_settings'
        id='remote_ip_addr_1_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`remote_ip_addr_1_settings_input`}
            className="settings_itemLabel">
            IP-адрес 1
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`remote_ip_addr_1_settings_input`}
            name={`remote_ip_addr_1_settings`}
            changeHandler={handleChange}
            input_value={remoteControlState.remote_ip_addr_1_settings}
            type="text" />
        </div>
      </li>
      <li
        key='remote_ip_addr_2_settings'
        id='remote_ip_addr_2_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`remote_ip_addr_2_settings_input`}
            className="settings_itemLabel">
            IP-адрес 2
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`remote_ip_addr_2_settings_input`}
            name={`remote_ip_addr_2_settings`}
            changeHandler={handleChange}
            input_value={remoteControlState.remote_ip_addr_2_settings}
            type="text" />
        </div>
      </li>
      <li
        key='remote_ip_addr_3_settings'
        id='remote_ip_addr_3_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`remote_ip_addr_3_settings_input`}
            className="settings_itemLabel">
            IP-адрес 3
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`remote_ip_addr_3_settings_input`}
            name={`remote_ip_addr_3_settings`}
            changeHandler={handleChange}
            input_value={remoteControlState.remote_ip_addr_3_settings}
            type="text" />
        </div>
      </li>
      <li
        key='remote_ip_addr_4_settings'
        id='remote_ip_addr_4_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`remote_ip_addr_4_settings_input`}
            className="settings_itemLabel">
            IP-адрес 4
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`remote_ip_addr_4_settings_input`}
            name={`remote_ip_addr_4_settings`}
            changeHandler={handleChange}
            input_value={remoteControlState.remote_ip_addr_4_settings}
            type="text" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
