import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'
import { useSelector } from 'react-redux'

export default function Software_version(props) {
  const softwareVersion_store = useSelector((store) => store.globalStore.global_data.section_data.info?.software_version)

  const [sofrwareVersionState, setSofrwareVersionState] = React.useState({
    os_version: 'N/A',
    bootloader_version: 'N/A',
  })

  React.useEffect(() => {
    if (softwareVersion_store == undefined) return

    if (Object.keys(softwareVersion_store).length != 0) {
      let settings_state_copy = sofrwareVersionState

      for (const key in softwareVersion_store) {
        settings_state_copy[key] = softwareVersion_store[key]
      }

      setSofrwareVersionState(settings_state_copy)
    }
  }, [softwareVersion_store])

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
