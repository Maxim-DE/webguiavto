import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'
import { useSelector } from 'react-redux'
import { deepKeyExists } from '../../../../../../logic/utilites'

export default function Info_cap(props) {
  const infoCap_store = useSelector((store) => store.globalStore.global_data.section_data.info.info_cap)

  const [infoCapState, setInfoCapState] = React.useState({
    // software_version: 'N/A'
  })

  React.useEffect(() => {
    if (infoCap_store != 'null' && infoCap_store ) {
      console.log('infoCap_store',infoCap_store)
      
      let settings_state_copy = infoCapState
      console.log('settings_state_copy',settings_state_copy)
      console.log('infoCapState',infoCapState)
      for (const key in infoCap_store) {
        if (infoCap_store[key].length === 0) {
          settings_state_copy[key] = 'N/A'
          continue
        }
        settings_state_copy[key] = infoCap_store[key]
      }
      setInfoCapState(settings_state_copy)
    }
  }, [infoCap_store])

  return (
    <SettingsBlockWrap
      header={'информация о сар'}
      settings_type={'info_cap'}
      section_name={props.section_name}>
      <li
        key='serial_number_cap'
        id='serial_number_cap'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_cap_input`}
            className="settings_itemLabel">
            САР Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number_cap`}
            input_value={infoCapState.serial_number_cap}
            type="text_sample" />
        </div>
      </li>

      <li
        key='software_cap_version'
        id='software_cap_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`software_cap_version_input`}
            className="settings_itemLabel">
            САР Версия ПО
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`software_cap_version`}
            input_value={infoCapState.software_cap_version}
            type="text_sample" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}