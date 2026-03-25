import React from 'react';

import Settings_block_calib from '..';
import Hex_upload from './hex_upload';
import FormInput from '../../form_input';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

function Firmware_calib(props) {
  const calibFirmware_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_firmware)

  const handleClick_crc_check = (event) => {
    const target = event.target,
          name = target.name,
          firmware_address = name.replace('firmware_crc_check_', '')

    const request_obj = {
      address: 'firmware_crc_check.cgi',
      data: `firmware$${firmware_address}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj)
  }

  const handleClick_info_refresh = (event) => {
    const request_obj = {
      address: 'calib_get_info_firmware.cgi',
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj)
  }
  
  return (
    <Settings_block_calib 
      header={`управление прошивкой`}
      settings_type={`firmware_calib`} >
      <li
        key='firmware_current_ver_calib'
        id='firmware_current_ver_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Тек. версия прошивки: {
              calibFirmware_store != undefined &&
              Object.keys(calibFirmware_store).length > 0 ?
              calibFirmware_store.application.info.version :
              'отсутствует'
            }
          </label>
        </div>
      </li>
      {/* <li
        key='commutator_current_ver_calib'
        id='commutator_current_ver_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Тек. версия прошивки БКА: {
              calibFirmware_store != undefined &&
                Object.keys(calibFirmware_store).length > 0 ?
                calibFirmware_store.application.info.commutator_version :
                'отсутствует'
            }
          </label>
        </div>
      </li> */}
      {/* <li
        key='commutator_digital_current_ver_calib'
        id='commutator_digital_current_ver_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Тек. версия прошивки БКА (цифра): {
              calibFirmware_store != undefined &&
                Object.keys(calibFirmware_store).length > 0 ?
                calibFirmware_store.application.info.commutator_digital_version :
                'отсутствует'
            }
          </label>
        </div>
      </li> */}
      {/* 
      <li
        key='firmware_add_version_label'
        className="settings_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Прошивки во внутр. памяти:
          </label>
        </div>
        <div className='item_input'>
        </div>
      </li>
      {calibFirmware_store != undefined &&
       Object.keys(calibFirmware_store).length > 1 ? 
       Object.keys(calibFirmware_store).filter(item => item != "application").map((item, index) => {

        const firmware_data = calibFirmware_store[item]

        if (firmware_data.info.version.length != 0) return (
          <li
            key={`firmware_add_ver_${index + 1}_calib`}
            id={`firmware_add_ver_${index + 1}_calib`}
            className="settings_item nested_item">
            <div className='item_header'>
              <label
                className="settings_itemLabel">
                {firmware_data.info.version}
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`firmware_crc_check_input_${index + 1}`}
                name={`firmware_crc_check_${index + 1}`}
                clickHandler={handleClick_crc_check}
                label='Проверить CRC'
                type="button" />
            </div>
          </li>
        )
       }) :

      <li
        key='firmware_missing'
        id='firmware_missing'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            className="settings_itemLabel">
            Прошивки отсутствуют
          </label>
        </div>
        <div className='item_input'>
        </div>
      </li>
      }
    */}
      <li className="group_divider"></li>
      <Hex_upload
        updateHandler={props.clickHandler} /> 
        
      {/* TEST TEST TEST */}
      {/* <li
        key='firmware_refresh_calib'
        id='firmware_refresh_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`firmware_refresh_calib_input`}
            className="settings_itemLabel">
            Обновление инф. о прошивке
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`firmware_refresh_calib_input`}
            name={`firmware_refresh_calib`}
            clickHandler={handleClick_info_refresh}
            label='Обновить'
            type="button" />
        </div>
      </li> */}
    </Settings_block_calib>
  )
}

export default Firmware_calib