import React from 'react'

import FormInput from '../form_input'
import '../form_input/index.css'
import '../settings_block/index.css'

export const mib_file_download = {
  'render_structure': function (form_handler, block_state, group_id, group_name) {

    const clickHandler_mibDownload = (event) => {
      const url = "mib/okb_alpha.mib"
      window.location.assign(url);
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
          <FormInput
            id={`mib_file_download_input`}
            name={`mib_file_download`}
            label='Скачать'
            clickHandler={clickHandler_mibDownload}
            type="button"
          />
        </li>
      </>
    )
  },

  'data_structure': []
}