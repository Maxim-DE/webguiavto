import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import { dataArray_to_string } from '../../../../../../logic/request_logic'

export default function Time_settings(props) {

  const [timeSettingsState, setTimeSettingsState] = React.useState({
    date_settings: '',
    time_settings: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.settings_data).length != 0) {
      let settings_state_copy = timeSettingsState

      for (const key in props.settings_data) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setTimeSettingsState(settings_state_copy)
    }
  }, [props.settings_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setTimeSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(timeSettingsState)

    const request_obj = {
      address: 'set_general_settings.cgi',
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap header={'задание времени'}
                       settings_type={'time_settings'}
                       section_name={props.section_name}
                       save_handler={handleClick_save}>
      
      <li
        key='date_settings'
        id='date_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`date_settings_input`}
            className="settings_itemLabel">
            Дата
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`date_settings`}
            name={`date_settings`}
            changeHandler={handleChange}
            input_value={timeSettingsState.date_settings}
            type="text" />
        </div>
      </li>
      <li
        key='time_settings'
        id='time_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`time_settings_input`}
            className="settings_itemLabel">
            Время
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`time_settings`}
            name={`time_settings`}
            changeHandler={handleChange}
            input_value={timeSettingsState.time_settings}
            type="text" />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}
