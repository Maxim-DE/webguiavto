import React from "react";

import SettingsBlockWrap from "../../../../../settings_block_wrap"
import FormInput from "../../../../../form_input"

import Conf_manage_settings from "../../../../../custom_groups/conf_manage_settings";

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import cloneDeep from "lodash/cloneDeep"
import { reducers } from "../../../../../../store/reducers/core_store_reducers";
import { useSelector } from "react-redux";

export default function Misc_settings(props) {
  const miscSettings_store = useSelector((store) => store.globalStore.global_data.section_data.settings.misc_settings)

  const [miscSettingsState, setMiscSettingsState] = React.useState({
    request_period: ''
  })

  React.useEffect(() => {
    console.log(miscSettings_store);

    if (miscSettings_store != 'null' && miscSettings_store != undefined) {
      let settings_state_copy = miscSettingsState

      for (const key in settings_state_copy) {
        if (miscSettings_store[key] == undefined) continue

        settings_state_copy[key] = miscSettings_store[key]
      }

      setMiscSettingsState(settings_state_copy)
    }
  }, [miscSettings_store])

  const state_handler = (state) => {
    let target_state_clone = cloneDeep(miscSettingsState)

    for (const key in state) {
      target_state_clone[key] = state[key]
    }

    setMiscSettingsState(target_state_clone)
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setMiscSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(miscSettingsState)

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.section_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        time_settings: miscSettingsState
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap header={'прочие настройки'}
      settings_type={'misc_settings'}
      section_name={props.section_name}
      save_handler={handleClick_save}>

      <li
        key='request_period'
        id='request_period_setting'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`request_period_input`}
            className="settings_itemLabel">
            Период запросов, мс
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`request_period_input`}
            name={`request_period`}
            changeHandler={handleChange}
            input_value={miscSettingsState.request_period}
            type="text" />
        </div>
      </li>
      <Conf_manage_settings
        parent_state={miscSettingsState}
        state_handler={state_handler}
        update_handler={props.clickHandler} />

    </SettingsBlockWrap>
  )

}