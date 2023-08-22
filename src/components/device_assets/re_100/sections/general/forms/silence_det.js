import React from "react"

import SettingsBlockWrap from "../../../../../settings_block_wrap"
import FormInput from "../../../../../form_input"

import Silence_det_settings from "../../../../../custom_groups/silence_det_settings"

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import clone from "lodash/clone"
import { reducers } from "../../../../../../core_store_reducers"
import { useSelector } from "react-redux"

export default function Silence_det_form(props) {
  const silenceDet_store = useSelector((store) => store.globalStore.global_data.section_data.settings.silence_det)

  const [silenceDetState, setSilenceDetState] = React.useState({})

  React.useEffect(() => {
    console.log(silenceDet_store);

    if (silenceDet_store != 'null' && silenceDet_store != undefined) {
      let settings_state_copy = silenceDetState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = silenceDet_store[key]
      }

      setSilenceDetState(settings_state_copy)
    }
  }, [silenceDet_store])

  const state_handler = (state) => {
    let target_state_clone = clone(silenceDetState)

    for (const key in state) {
      target_state_clone[key] = state[key]
    }

    setSilenceDetState(target_state_clone)
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setSilenceDetState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(silenceDetState)

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.section_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        time_settings: silenceDetState
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap header={'детектор тишины'}
      settings_type={'silence_det'}
      section_name={props.section_name}
      save_handler={handleClick_save}>
      <Silence_det_settings
        parent_state={silenceDetState}
        state_handler={state_handler} />
    </SettingsBlockWrap>
  )
}