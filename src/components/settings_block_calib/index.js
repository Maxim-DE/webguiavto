import React from 'react';

import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'

import '../settings_block/index.css'
import FormInput from '../form_input';

function Settings_block_calib({ settings_type, className = "", disabled, disableHandler, ...rest }) {

  return (

    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <form className="settings_container">
        <div className="settings_block_header">
          {disabled != undefined &&
            <FormInput
              type='checkbox'
              changeHandler={disableHandler}
              input_value={!disabled} />
          }
          <h3>{rest.header}</h3>
          {/* <button 
            className='save_form_button'
            onClick={handleClick}
            title='Сохранить' >
            <MdDone style={{ margin: "3px 0 0 0" }} />
          </button> */}
        </div>
        <ul className="settings_list">
          {rest.children}
        </ul>
      </form>
    </div>
  )
  
}

export default Settings_block_calib;