import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import useGlobalStore from '../../../../../../logic/auth_store'

import { conf_file_links } from '../../../../../settings_block_calib/forms/conf_file_calib'

export default function Recover_settings(props) {
  const [authGlobalState, authGlobalActions] = useGlobalStore()

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      address = conf_file_links[name].address,
      data = conf_file_links[name].data

    const request_obj = {
      address: address,
      data: data,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap header={'восстановление'}
                       settings_type={'recover_settings'}
                       section_name={props.section_name}>
      <li
        key='factory_reset_manage'
        id='factory_reset_manage'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Восст. заводских настроек
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`factory_reset_input`}
            name={`factory_reset`}
            clickHandler={handleClick_save}
            label='Восстановить'
            type="button" />
        </div>
      </li>
      {authGlobalState.auth_access.calib_extend &&
        <li
          key='create_new_conf'
          id='create_new_conf'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`tcreate_new_conf_input`}
              className="settings_itemLabel">
              Создать новый файл
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`create_new_conf_input`}
              name={`create_new_conf`}
              clickHandler={handleClick_save}
              label='Создать'
              type="button" />
          </div>
        </li>
      }
    </SettingsBlockWrap>
  )
}