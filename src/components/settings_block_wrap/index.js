import React from 'react';

import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'

import './index.css'

function SettingsBlockWrap({ settings_type, className = "", disable_save = false, ...rest }) {
  return (
    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <form className="settings_container" onSubmit={(e) => e.preventDefault()}>
        <div className="settings_block_header">
          <h3>{rest.header}</h3>
          {rest.save_handler &&
            <button 
              disabled={disable_save}
              className={`save_form_button ${disable_save && 'disabled_input'}`}
              onClick={(e) => { 
                e.preventDefault();
                rest.save_handler(e)
              }}
              type='button'
              title='Сохранить' >
              <MdDone style={{ margin: "3px 0 0 0" }} />
            </button>}
        </div>
        <ul className="settings_list">
          {rest.children}
        </ul>
      </form>
    </div>
  )
  
}

export default SettingsBlockWrap;