import React from "react"

import SettingsBlockWrap from "../../../../../settings_block_wrap"
import FormInput from "../../../../../form_input"

import Time_schedule_settings from "../../../../../custom_groups/time_schedule_settings"

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import clone from "lodash/clone"

export default function Time_schedule_form(props) {
  const [timeScheduleState, setTimeScheduleState] = React.useState({})

  React.useEffect(() => {
    console.log(props.settings_data);

    if (props.settings_data != 'null' && props.settings_data != undefined) {
      let settings_state_copy = timeScheduleState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = props.settings_data[key]
      }

      setTimeScheduleState(settings_state_copy)
    }
  }, [props.settings_data])

  const state_handler = (state) => {
    let target_state_clone = clone(timeScheduleState)

    for (const key in state) {
      target_state_clone[key] = state[key]
    }

    setTimeScheduleState(target_state_clone)
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setTimeScheduleState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(timeScheduleState)

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        time_settings: timeScheduleState
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap header={'расписание работы'}
      settings_type={'time_schedule_settings'}
      section_name={props.section_name}
      save_handler={handleClick_save}>
      <Time_schedule_settings
        parent_state={timeScheduleState}
        state_handler={state_handler} />

    </SettingsBlockWrap>
  )
}