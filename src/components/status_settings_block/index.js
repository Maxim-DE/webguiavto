import React from 'react';

import './index.css'
import FormInput from '../form_input';

import Settings_block_calib from '../settings_block_calib';

function Status_settings(props) {
  const [statusSettingsState, setStatusSettingsState] = React.useState({
    supply_on_setting: false,
    power_setting: ''
  })

  React.useEffect(() => {
    if (props.settings_data != undefined &&
        Object.keys(props.settings_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        calib_state_copy[key] = props.settings_data[key]
      }

      setStatusSettingsState(calib_state_copy)

    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setStatusSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))

    const request_obj = {
      address: 'transmitter.cgi',
      data: `${name}$${value}`
    }

    props.updateHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`настройки`}
      settings_type={`status_calib`}
      section_name={props.section_name}>
      <li
        key='supply_on_setting'
        id='supply_on_setting'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`supply_on_setting_input`}
            className="settings_itemLabel">
            Выкл./вкл. питание устройства
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`supply_on_setting_input`}
            name={`supply_on_setting`}
            changeHandler={handleChange}
            input_value={statusSettingsState.supply_on_setting}
            type="switch" />
        </div>
      </li>
      <li
        key='power_setting'
        id='power_setting'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`power_setting_input`}
            className="settings_itemLabel">
            Изменение мощности
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`power_setting_input`}
            name={`power_setting`}
            changeHandler={handleChange}
            input_value={statusSettingsState.power_setting}
            statusHandler={setStatusSettingsState}
            type="text_buttons" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default Status_settings;
