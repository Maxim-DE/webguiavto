import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

export default function Software_version(props) {

  const [sofrwareVersionState, setSofrwareVersionState] = React.useState({
    os_version: 'N/A',
    bootloader_version: 'N/A',
  })

  React.useEffect(() => {
    if (Object.keys(props.settings_data).length != 0) {
      let settings_state_copy = sofrwareVersionState

      for (const key in props.settings_data) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setSofrwareVersionState(settings_state_copy)
    }
  }, [props.settings_data])

  return (
    <SettingsBlockWrap
      header={`версия по`}
      settings_type={`software_version`}
      section_name={props.section_name}>
      
      <li
        key='os_version'
        id='os_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`os_version_input`}
            className="settings_itemLabel">
            Версия прошивки
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`os_version`}
            input_value={sofrwareVersionState.os_version}
            type="text_sample" />
        </div>
      </li>
      <li
        key='bootloader_version'
        id='bootloader_version'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`bootloader_version_input`}
            className="settings_itemLabel">
            Версия загрузчика
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`bootloader_version`}
            input_value={sofrwareVersionState.bootloader_version}
            type="text_sample" />
        </div>
      </li>

    </SettingsBlockWrap>
  )
}
