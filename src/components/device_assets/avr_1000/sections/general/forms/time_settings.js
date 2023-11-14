import React from 'react'

import SettingsBlockWrap from '../../../../../settings_block_wrap'
import FormInput from '../../../../../form_input'

import Time_server_sync_settings from '../../../../../custom_groups/time_server_sync_settings'

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import cloneDeep from 'lodash/cloneDeep'
import { reducers } from '../../../../../../store/reducers/core_store_reducers'
import { useSelector } from 'react-redux'

export default function Time_settings(props) {

  const timeSettings_store = useSelector((store) => store.globalStore.global_data.section_data.settings?.time_settings)

  const [timeSettingsState, setTimeSettingsState] = React.useState({
    date: '',
    time: ''
  })

  React.useEffect(() => {
    console.log(timeSettings_store);

    if (timeSettings_store != 'null' && timeSettings_store != undefined) {
      let settings_state_copy = timeSettingsState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = timeSettings_store[key]
      }

      setTimeSettingsState(settings_state_copy)
    }
  }, [timeSettings_store])

  React.useEffect(() => {
    console.log(timeSettingsState);
  }, [timeSettingsState])

    const state_handler = (state) => {
    let target_state_clone = cloneDeep(timeSettingsState)

    for (const key in state) {
      target_state_clone[key] = state[key]
    }

    setTimeSettingsState(target_state_clone)
  }

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
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.section_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        time_settings: timeSettingsState
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
        key='date'
        id='date'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`date_input`}
            className="settings_itemLabel">
            Дата
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`date_input`}
            name={`date`}
            changeHandler={handleChange}
            input_value={timeSettingsState.date}
            type="text" />
        </div>
      </li>
      <li
        key='time'
        id='time'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`time_input`}
            className="settings_itemLabel">
            Время
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`time_input`}
            name={`time`}
            changeHandler={handleChange}
            input_value={timeSettingsState.time}
            type="text" />
        </div>
      </li>
      <Time_server_sync_settings
        parent_state={timeSettings_store}
        state_handler={state_handler}
        clickHandler={props.clickHandler} />
    </SettingsBlockWrap>
  )
}
