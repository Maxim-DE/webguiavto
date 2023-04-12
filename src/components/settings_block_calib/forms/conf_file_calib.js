import React from 'react';

import Settings_block_calib from '..';
import Syslog_calib from './syslog_calib';

import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

export default function ConfFileCalib(props) {
  const [authGlobalState, authGlobalActions] = useGlobalStore()

    const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = 1

    const request_obj = {
      address: 'calib_conf_file.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`файл конфигурации`}
      settings_type={`conf_file_calib`}
    // save_handler={handleClick_save}
    >
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
          {/* <FormInput
            id={`save_as_factory_input`}
            name={`save_as_factory`}
            clickHandler={handleChange_save}
            label='Сохр. как завод.'
            type="button" /> */}
        </div>
      </li>
      {authGlobalState.auth_access.calib_extend &&
        <>
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
        <li
          key='set_settings_as_factory'
          id='set_settings_as_factory'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`set_settings_as_factory_input`}
              className="settings_itemLabel">
              Сохранить тек. настройки как дефолтные
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`set_settings_as_factory_input`}
              name={`set_settings_as_factory`}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
            {/* <FormInput
              id={`save_as_factory_input`}
              name={`save_as_factory`}
              clickHandler={handleChange_save}
              label='Сохр. как завод.'
              type="button" /> */}
          </div>
        </li>
        <li className="group_divider" />
        <li
          key='conf_file_manage'
          id='conf_file_manage'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`conf_file_manage_input`}
              className="settings_itemLabel">
              Управление файлом конфигурации
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`conf_file_download_input`}
              name={`conf_file_download`}
              clickHandler={handleClick_save}
              label='Скачать'
              type="button" />
            <FormInput
              id={`conf_file_upload_input`}
              name={`conf_file_upload`}
              clickHandler={handleClick_save}
              label='Загрузить'
              type="button" />
          </div>
        </li>
        </>
      }
    </Settings_block_calib>
  )
}
