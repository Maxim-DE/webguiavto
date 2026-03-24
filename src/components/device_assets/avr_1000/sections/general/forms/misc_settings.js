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
  const auth_level = useSelector((store) => store.authStore.auth_data.auth_level)
  const IsModeManual = useSelector((store) => store.globalStore.global_data.status_data.status_info.active_control_mode)
  
  // const status_store = useSelector((store) => store.globalStore.global_data.section_data)

  const [miscSettingsState, setMiscSettingsState] = React.useState({
    res_device_1: 0,
    res_device_2: 0,
    res_device_3: 0,
    afu_protect_enable: 0,
    IsExistBlockAfu:0
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


  const handleChange_save = (event) => {
    let target = event.target;
    let value = target.type === 'checkbox' ? Number(target.checked) : target.value
    let name = target.name.replace('_calib', '');
    // let name = target.name

    setMiscSettingsState(prevState => ({
      ...prevState,
      [name]: value
    }))

    value = typeof value === 'boolean' ? Number(value) : value

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      // address: 'calib_general.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
  
      save_data: {
        calib_general: {
          [name]: value
        }
      }
    }
  
    props.clickHandler(request_obj);
  }


  return 
    // <SettingsBlockWrap header={'прочие настройки'}
    //   settings_type={'misc_settings'}
    //   section_name={props.section_name}
    //   save_handler={handleClick_save}
    //   disable_save={!isFormValid} >
    //   <li
    //     key='reserved_devices'
    //     id='reserved_devices'
    //     className="settings_item">
    //     <div className='item_header'>
    //       <label
    //         htmlFor={`res_device_1_input`}
    //         className="settings_itemLabel">
    //         Резервируемые устр-ва
    //       </label>
    //     </div>
    //     <div className='item_input'>
    //       <span className='checkbox_wrap'>
    //         1
    //         <FormInput
    //           id={`res_device_1_input`}
    //           name={`res_device_1`}
    //           changeHandler={handleChange}
    //           input_value={miscSettingsState.res_device_1}
    //           disabled={(IsModeManual==1)?false:true}
    //           type="checkbox" />
    //       </span>

    //       <span className='checkbox_wrap'>
    //         2
    //         <FormInput
    //           id={`res_device_2_input`}
    //           name={`res_device_2`}
    //           changeHandler={handleChange}
    //           input_value={miscSettingsState.res_device_2}
    //           disabled={(IsModeManual==1)?false:true}
    //           type="checkbox" />
    //       </span>

    //       <span className='checkbox_wrap'>
    //         3
    //         <FormInput
    //           id={`res_device_3_input`}
    //           name={`res_device_3`}
    //           changeHandler={handleChange}
    //           input_value={miscSettingsState.res_device_3}
    //           disabled={(IsModeManual==1)?false:true}
    //           type="checkbox" />
    //       </span>
    //     </div>
    //   </li>

      {/* Резервное АФУ */}
      
     
      {/* {miscSettingsState.IsExistBlockAfu == 1 && auth_level >= 2 &&
        <li
          key='input_protect_afu_enable_calib'
          id='input_protect_afu_enable_calib'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`input_protect_afu_enable_calibb_input`}
              className="settings_itemLabel">
              Резервное АФУ
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`input_protect_afu_enable_calib_input`}
              name={`afu_protect_enable_calib`}
              changeHandler={handleChange_save}
              input_value={miscSettingsState.afu_protect_enable}
              // input_value={generalCalibState.input_test_pic_enable}
              disabled={(IsModeManual==1)?false:true}
              type="switch" />
          </div>
        </li>
      } */}
  //   </SettingsBlockWrap>
  // )

}