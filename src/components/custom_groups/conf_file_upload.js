import React from 'react'

import FormInput from '../form_input'
import '../form_input/index.css'
import '../settings_block/index.css'

export const conf_file_upload = {
  'render_structure': function (form_handler, block_state, group_id, group_name) {

    const changeHandler_fileUpload = (event) => {
      let target = event.target,
          form_data = new FormData(),
          file = target.files[0],
          xhr = new XMLHttpRequest()

      if (target.files.length > 0) {
        form_data.append('conf_file_upload_input', file)
        xhr.open('POST', 'get_file.cgi')
        xhr.send(file)
      }
    }

    return (
      <>
        <li
          key='silence_det_settings'
          id='silence_det_settings'
          className="settings_item">
          <label
            htmlFor=''
            className="settings_itemLabel">
            {group_name}
          </label>
        </li>
        <li className="settings_item nested_item">
          <label htmlFor="conf_file_download_input" 
          className="setting_itemLabel">
            Скачать файл с устройства
          </label>
          <input
            id='conf_file_download_input'
            name='conf_file_download'
            className='file_load_input'
            type="button"
            value="Скачать файл"
            // onClick={form_handler} 
            />
        </li>
        <li className="settings_item nested_item">
          <label htmlFor=""
            className="setting_itemLabel">
            Скачать файл с устройства
          </label>
          <input
            id='conf_file_upload_input'
            name='conf_file_upload'
            // className='file_load_input'
            type="file"
            style={{
              display: 'none'
            }}
            onChange={changeHandler_fileUpload}
          />
          <input 
            type="button" 
            value="Выберите файл"
            className='file_load_input' />
        </li>
      </>
    )
  },

  'data_structure': []
}