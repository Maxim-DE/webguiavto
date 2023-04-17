import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

export default function File_download(props) {
  const download_links = {
    user_conf: 'ReadFile.hex?confing_user$1',
    sys_log: 'ReadFile.hex?syslog$1',
    all_file: 'ReadFile.hex'
  }

  return (
    <SettingsBlockWrap header={'загрузка файлов'}
                       settings_type={'time_settings'}
                       section_name={props.section_name}>
      <li
        key='full_conf_download'
        id='full_conf_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`device_conf_download_input`}
            className="settings_itemLabel">
            Пользовательский журнал
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.user_conf}>
            Скачать
          </a>
          {/* <FormInput
            id={`full_conf_download_input`}
            name={`full_conf_download`}
            clickHandler={(e) => {
              e.preventDefault()
              file_download_download(download_links.full_conf)
            }}
            label='Скачать'
            type="button" /> */}
        </div>
      </li>
      <li
        key='sys_log_download'
        id='sys_log_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`sys_log_download_input`}
            className="settings_itemLabel">
            Системный журнал
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.sys_log}>
            Скачать
          </a>
          {/* <FormInput
            id={`sys_log_download_input`}
            name={`sys_log_download`}
            clickHandler={(e) => {
              e.preventDefault()
              file_download_download(download_links.sys_log)
            }}
            label='Скачать'
            type="button" /> */}
        </div>
      </li>
      <li
        key='all_file_download'
        id='all_file_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`all_file_download_input`}
            className="settings_itemLabel">
            Все файлы в одном
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.all_file}
            target="_blank"
            rel='noopener noreferrer'
            download>
            Скачать
          </a>
          {/* <FormInput
            id={`all_file_download_input`}
            name={`all_file_download`}
            clickHandler={(e) => {
              e.preventDefault()
              file_download_download(download_links.all_file)
            }}
            label='Скачать'
            type="button" /> */}
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
