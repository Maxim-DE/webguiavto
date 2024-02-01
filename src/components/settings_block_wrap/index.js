import React from 'react';

import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'

import './index.css'

function SettingsBlockWrap({ settings_type, className = "", disable_save = false, type, screen_fit, height, ...rest }) {
  const block_type = type ? type.toLowerCase() : 'form'

  return (
    <div
    className={`settings_block ${type ? type : ""} ${screen_fit && "screen_fit"}`} >
      {block_type == "form" &&
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
      }
      {block_type == "blank" && rest.children}
    </div>
  )
  
}

export default SettingsBlockWrap;