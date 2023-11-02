import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import useGlobalStore from '../../../../../../logic/auth_store'

import { conf_file_links } from '../../../../../settings_block_calib/forms/conf_file_calib'
import { useSelector } from 'react-redux'

export default function Recover_settings(props) {
  const auth_store = useSelector((store) => store.authStore.auth_data),
        info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info)
  // const [auth_store, authGlobalActions] = useGlobalStore()
  const [recoveryState, setRecoveryState] = React.useState({
    device_conf_type: 0
  })

  // строка имени устройства
  let device_arr = []

  if (info_section_data.info_general) {
    device_arr = info_section_data.info_general.device_type_list ? info_section_data.info_general.device_type_list : []
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setRecoveryState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

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

  const device_conf_create = () => {
    const conf_type_value = recoveryState.device_conf_type

    const request_obj = {
      address: 'calib_super_admin_conf_file.cgi',
      data: `create_type_conf$${conf_type_value}`,
      // reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
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
      {auth_store.auth_access.calib_extend &&
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
              id={`device_conf_type_calib`}
              name={`device_conf_type_calib`}
              type='select'
              input_value={recoveryState.device_conf_type}
              title='Тип устройства'
              variants={device_arr}
              changeHandler={handleChange} />
            <FormInput
              id={`create_new_conf_calib_save`}
              name={`create_new_conf_calib`}
              clickHandler={device_conf_create}
              label='Создать'
              type="button" />
          </div>
        </li>
      }
    </SettingsBlockWrap>
  )
}