import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'

export default function Snmp_agent(props) {
  const [snmpAgentState, setSnmpAgentState] = React.useState({
    community_read_settings: '',
    community_write_settings: '',
  })

  React.useEffect(() => {
    if (Object.keys(props.settings_data).length != 0) {
      let settings_state_copy = snmpAgentState

      for (const key in props.settings_data) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setSnmpAgentState(settings_state_copy)
    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setSnmpAgentState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(snmpAgentState)

    const request_obj = {
      address: 'set_snmp_agent.cgi',
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);
  }

  const clickHandler_mibDownload = (event) => {
    const url = "mib/okb_alpha.mib"
    window.location.assign(url);
  }

  return (
    <SettingsBlockWrap 
      header={'SNMP-агент'}
      settings_type={'snmp_agent'}
      section_name={props.section_name}
      save_handler={handleClick_save}>

      <li
        key='community_read_settings'
        id='community_read_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`community_read_settings_input`}
            className="settings_itemLabel">
            Community Read
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`community_read_settings_input`}
            name={`community_read_settings`}
            changeHandler={handleChange}
            input_value={snmpAgentState.community_read_settings}
            type="text" />
        </div>
      </li>
      <li
        key='community_write_settings'
        id='community_write_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`community_write_settings_input`}
            className="settings_itemLabel">
            Community Write
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`community_write_settings_input`}
            name={`community_write_settings`}
            changeHandler={handleChange}
            input_value={snmpAgentState.community_write_settings}
            type="text" />
        </div>
      </li>
      <li
        key='mib_file_download'
        id='mib_file_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mib_file_download_input`}
            className="settings_itemLabel">
            Загрузить MIB-файл
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mib_file_download_input`}
            name={`mib_file_download`}
            label={`Скачать`}
            clickHandler={clickHandler_mibDownload}
            type="button" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
