import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'
import ChannelEnablerSettings from '../../../../../settings_block_calib/forms/channel_enabler_calib'
import { useSelector } from 'react-redux'
import { deepKeyExists } from '../../../../../../logic/utilites'

export default function Info_general(props) {
  const infoGeneral_store = useSelector((store) => store.globalStore.global_data.section_data.info.info_general),
        deviceName_string = useSelector((store) => {
          if (deepKeyExists(store.globalStore.global_data, 'Type_Device')) {
            return `${store.globalStore.global_data.section_data.info.info_general.Type_Device} №${store.globalStore.global_data.section_data.info.info_general.serial_number}`
          }
        })

  const [infoGeneralState, setInfoGeneralState] = React.useState({
    serial_number: 'N/A',
    plate_number: 'N/A',
    plate_version: 'N/A',
    // commutaion_serial_number: 'N/A',
    // commutaion_plate_number: 'N/A',
    // commutaion_digital_serial_number: 'N/A',
    // commutaion_digital_plate_number: 'N/A'
  })

  React.useEffect(() => {
    console.log(infoGeneral_store);
    if (infoGeneral_store != 'null' && infoGeneral_store) {
      let settings_state_copy = infoGeneralState

      for (const key in infoGeneral_store) {
        
        if (infoGeneral_store[key].length === 0) {
          settings_state_copy[key] = 'N/A'
          continue
        }

        settings_state_copy[key] = infoGeneral_store[key]
      }

      setInfoGeneralState(settings_state_copy)
    }
  }, [infoGeneral_store])

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
        key='Power_Supply_Unit'
        id='Power_Supply_Unit'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`Power_Supply_Unit_input`}
            className="settings_itemLabel">
            Блок питания
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`Power_Supply_Unit`}
            input_value={infoGeneralState.Power_Supply_Unit}
            type="text_sample" />
        </div>
      </li>
      {/* <li className="group_divider"></li> */}
      {/* <li
        key='commutaion_serial_number'
        id='commutaion_serial_number'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`commutaion_serial_number_input`}
            className="settings_itemLabel">
            Серийный номер БКА (аналог)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`commutaion_serial_number`}
            input_value={infoGeneralState.commutaion_serial_number}
            type="text_sample" />
        </div>
      </li>
      <li
        key='commutaion_plate_number'
        id='commutaion_plate_number'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`commutaion_plate_number_input`}
            className="settings_itemLabel">
            Номер платы БКА (аналог)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`commutaion_plate_number`}
            input_value={infoGeneralState.commutaion_plate_number}
            type="text_sample" />
        </div>
      </li>
      <li
        key='commutaion_digital_serial_number'
        id='commutaion_digital_serial_number'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Серийный номер БКА (цифра)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`commutaion_digital_serial_number_field`}
            input_value={infoGeneralState.commutaion_digital_serial_number}
            type="text_sample" />
        </div>
      </li>
      <li
        key='commutaion_digital_plate_number'
        id='commutaion_digital_plate_number'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Номер платы БКА (цифра)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`commutaion_digital_plate_number_field`}
            input_value={infoGeneralState.commutaion_digital_plate_number}
            type="text_sample" />
        </div>
      </li> */}
    </SettingsBlockWrap>
  )
}
