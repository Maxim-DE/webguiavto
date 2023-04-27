import React from 'react';

import Settings_block_calib from '..';
import Hex_upload from './hex_upload';
import FormInput from '../../form_input';

function Firmware_calib(props) {

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
              props.calib_data != undefined &&
              Object.keys(props.calib_data).length > 0 ?
              props.calib_data.application.info.version :
              'отсутствует'
            }
          </label>
        </div>
      </li>
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
      {props.calib_data != undefined &&
       Object.keys(props.calib_data).length > 1 ? 
       Object.keys(props.calib_data).filter(item => item != "application").map((item, index) => {

        const firmware_data = props.calib_data[item]

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
      <Hex_upload
        updateHandler={props.clickHandler} />
    </Settings_block_calib>
    
  )
}

export default Firmware_calib