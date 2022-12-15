import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'

export default function Snmp_agent(props) {
  const [snmpAgentState, setSnmpAgentState] = React.useState({
    community_read: '',
    community_write: '',
  })

  React.useEffect(() => {
    if (props.settings_data != 'null' && props.settings_data != undefined) {
      let settings_state_copy = snmpAgentState

      for (const key in settings_state_copy) {
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
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        snmp_agent: snmpAgentState
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
        key='community_read'
        id='community_read'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`community_read_input`}
            className="settings_itemLabel">
            Community Read
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`community_read_input`}
            name={`community_read`}
            changeHandler={handleChange}
            input_value={snmpAgentState.community_read}
            type="text" />
        </div>
      </li>
      <li
        key='community_write'
        id='community_write'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`community_write_input`}
            className="settings_itemLabel">
            Community Write
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`community_write_input`}
            name={`community_write`}
            changeHandler={handleChange}
            input_value={snmpAgentState.community_write}
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
