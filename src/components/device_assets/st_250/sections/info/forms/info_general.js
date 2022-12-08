import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

export default function Info_general(props) {
  const [infoGeneralState, setInfoGeneralState] = React.useState({
    serial_number: 'N/A',
    plate_number: 'N/A',
    plate_version: 'N/A',
    memory_type: 'N/A'
  })

  React.useEffect(() => {
    if (Object.keys(props.settings_data).length != 0) {
      let settings_state_copy = infoGeneralState

      for (const key in props.settings_data) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setInfoGeneralState(settings_state_copy)
    }
  }, [props.settings_data])

  return (
    <SettingsBlockWrap
      header={'общее'}
      settings_type={'info_general'}
      section_name={props.section_name}>

      <li
        key='serial_number'
        id='serial_number'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`serial_number_input`}
            className="settings_itemLabel">
            Серийный номер
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`serial_number`}
            input_value={infoGeneralState.serial_number}
            type="text_sample" />
        </div>
      </li>
      <li
        key='plate_number'
        id='plate_number'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`plate_number_input`}
            className="settings_itemLabel">
            Номер платы
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`plate_number`}
            input_value={infoGeneralState.plate_number}
            type="text_sample" />
        </div>
      </li>
      <li
        key='plate_version'
        id='plate_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`plate_version_input`}
            className="settings_itemLabel">
            Ревизия платы
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`plate_version`}
            input_value={infoGeneralState.plate_version}
            type="text_sample" />
        </div>
      </li>
      <li
        key='memory_type'
        id='memory_type'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`memory_type_input`}
            className="settings_itemLabel">
            Тип памяти
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`memory_type`}
            input_value={infoGeneralState.memory_type}
            type="text_sample" />
        </div>
      </li>

    </SettingsBlockWrap>
  )
}
