import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'
import { useSelector } from 'react-redux'
import { deepKeyExists } from '../../../../../../logic/utilites'

export default function Info_amplifire(props) {
  const infoAmplifire_store = useSelector((store) => store.globalStore.global_data.section_data.info.info_amplifire)

  const [infoAmplifireState, setInfoAmplifireState] = React.useState({
    // software_version: 'N/A'
  })

  React.useEffect(() => {
    if (infoAmplifire_store != 'null' && infoAmplifire_store ) {
      console.log('infoAmplifire_store',infoAmplifire_store)
      
      let settings_state_copy = infoAmplifireState
      console.log('settings_state_copy',settings_state_copy)
      console.log('infoAmplifireState',infoAmplifireState)
      for (const key in infoAmplifire_store) {
        if (infoAmplifire_store[key].length === 0) {
          settings_state_copy[key] = 'N/A'
          continue
        }
        settings_state_copy[key] = infoAmplifire_store[key]
      }
      setInfoAmplifireState(settings_state_copy)
    }
  }, [infoAmplifire_store])

  // console.log('infoAmplifireState.serial_number_amplifire_1',infoAmplifireState.serial_number_amplifire_1)
  // console.log('infoAmplifireState.serial_number_amplifire_2',infoAmplifireState.serial_number_amplifire_2)
  // console.log('infoAmplifireState.software_amplifire_1_version',infoAmplifireState.software_amplifire_1_version)
  // console.log('infoAmplifireState.software_amplifire_2_version',infoAmplifireState.software_amplifire_2_version)
  
  return (
    <SettingsBlockWrap
      header={'информация об усилителях'}
      settings_type={'info_amplifire'}
      section_name={props.section_name}>
      <li
        key='serial_number_amplifire_1'
        id='serial_number_amplifire_1'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_amplifire_1_input`}
            className="settings_itemLabel">
            Усилитель 1 Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number_amplifire_1`}
            input_value={infoAmplifireState.serial_number_amplifire_1}
            type="text_sample" />
        </div>
      </li>

      <li
        key='software_amplifire_1_version'
        id='software_amplifire_1_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`software_amplifire_1_version_input`}
            className="settings_itemLabel">
            Усилитель 1 Версия ПО
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`software_amplifire_1_version`}
            input_value={infoAmplifireState.software_amplifire_1_version}
            type="text_sample" />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='serial_number_amplifire_2'
        id='serial_number_amplifire_2'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_amplifire_2_input`}
            className="settings_itemLabel">
            Усилитель 2 Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number_amplifire_2`}
            input_value={infoAmplifireState.serial_number_amplifire_2}
            type="text_sample" />
        </div>
      </li>
      <li
        key='software_amplifire_2_version'
        id='software_amplifire_2_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`software_amplifire_2_version_input`}
            className="settings_itemLabel">
            Усилитель 2 Версия ПО
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`software_amplifire_2_version`}
            input_value={infoAmplifireState.software_amplifire_2_version}
            type="text_sample" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}