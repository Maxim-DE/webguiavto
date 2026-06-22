import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'
import { useSelector } from 'react-redux'
import { deepKeyExists } from '../../../../../../logic/utilites'

export default function Info_exiter(props) {
  const infoExiter_store = useSelector((store) => store.globalStore.global_data.section_data.info.info_exiter)

  const [infoExiterState, setInfoExiterState] = React.useState({
    // software_version: 'N/A'
  })

  React.useEffect(() => {
    if (infoExiter_store != 'null' && infoExiter_store ) {
      console.log('infoExiter_store',infoExiter_store)
      
      let settings_state_copy = infoExiterState
      console.log('settings_state_copy',settings_state_copy)
      console.log('infoExiterState',infoExiterState)
      for (const key in infoExiter_store) {
        if (infoExiter_store[key].length === 0) {
          settings_state_copy[key] = 'N/A'
          continue
        }
        settings_state_copy[key] = infoExiter_store[key]
      }
      setInfoExiterState(settings_state_copy)
    }
  }, [infoExiter_store])

  return (
    <SettingsBlockWrap
      header={'информация о возбудителях'}
      settings_type={'info_exiter'}
      section_name={props.section_name}>
      <li
        key='serial_number_exiter_1'
        id='serial_number_exiter_1'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_exiter_1_input`}
            className="settings_itemLabel">
            ПРД ОСН Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number_exiter_1`}
            input_value={infoExiterState.serial_number_exiter_1}
            type="text_sample" />
        </div>
      </li>

      <li
        key='software_exiter_1_version'
        id='software_exiter_1_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`software_exiter_1_version_input`}
            className="settings_itemLabel">
            ПРД ОСН Версия ПО
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`software_exiter_1_version`}
            input_value={infoExiterState.software_exiter_1_version}
            type="text_sample" />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='serial_number_exiter_2'
        id='serial_number_exiter_2'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_exiter_2_input`}
            className="settings_itemLabel">
            ПРД РЕЗ Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number_exiter_2`}
            input_value={infoExiterState.serial_number_exiter_2}
            type="text_sample" />
        </div>
      </li>
      <li
        key='software_exiter_2_version'
        id='software_exiter_2_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`software_exiter_2_version_input`}
            className="settings_itemLabel">
            ПРД РЕЗ Версия ПО
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`software_exiter_2_version`}
            input_value={infoExiterState.software_exiter_2_version}
            type="text_sample" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}