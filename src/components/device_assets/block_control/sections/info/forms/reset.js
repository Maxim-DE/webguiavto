import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

export default function Reset_Info(props) {

  const handleClick_reset = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    const request_obj = {
      address: 'calib_conf_file.cgi',
      data: 'user_settings_reset$1',
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap 
      header={'сброс и удаление'}
      settings_type={'reset_settings'}
      section_name={props.section_name}>
      <li
        key='user_settings_reset'
        id='user_settings_reset'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Сброс польз. настроек
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`user_settings_reset_input`}
            name={`user_settings_reset`}
            clickHandler={handleClick_reset}
            label='Сбросить'
            type="button" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
