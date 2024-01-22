import React from "react";

import SettingsBlockWrap from "../../../../../settings_block_wrap"
import FormInput from "../../../../../form_input"

import Conf_manage_settings from "../../../../../custom_groups/conf_manage_settings";

import { dataArray_to_string } from '../../../../../../logic/request_logic'
import cloneDeep from "lodash/cloneDeep"
import { reducers } from "../../../../../../store/reducers/core_store_reducers";
import { useSelector } from "react-redux";
import { useFormValidation } from "../../../../../../logic/validation/formValidation_hook";
import { isInNumRange } from "../../../../../../logic/validation/validators";

export default function Misc_settings(props) {
  const miscSettings_store = useSelector((store) => store.globalStore.global_data.section_data.settings.misc_settings)

  const [miscSettingsState, setMiscSettingsState] = React.useState({
    res_device_1: 0,
    res_device_2: 0,
    res_device_3: 0,
  })

  const { isFormValid, validStatus_getter } = useFormValidation()

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
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
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
      save_handler={handleClick_save}
      disable_save={!isFormValid} >
      <li
        key='reserved_devices'
        id='reserved_devices'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`res_device_1_input`}
            className="settings_itemLabel">
            Резервируемые устр-ва
          </label>
        </div>
        <div className='item_input'>
          <span className='checkbox_wrap'>
            1
            <FormInput
              id={`res_device_1_input`}
              name={`res_device_1`}
              changeHandler={handleChange}
              input_value={miscSettingsState.res_device_1}
              type="checkbox" />
          </span>

          <span className='checkbox_wrap'>
            2
            <FormInput
              id={`res_device_2_input`}
              name={`res_device_2`}
              changeHandler={handleChange}
              input_value={miscSettingsState.res_device_2}
              type="checkbox" />
          </span>

          <span className='checkbox_wrap'>
            3
            <FormInput
              id={`res_device_3_input`}
              name={`res_device_3`}
              changeHandler={handleChange}
              input_value={miscSettingsState.res_device_3}
              type="checkbox" />
          </span>
          {/* <FormInput
            id={`reserved_devices_num_input`}
            name={`reserved_devices_num`}
            changeHandler={handleChange}
            input_value={miscSettingsState.reserved_devices_num}
            validators={[
              isInNumRange(0, 3)
            ]}
            formValidHandler={validStatus_getter}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" /> */}
        </div>
      </li>
    </SettingsBlockWrap>
  )

}