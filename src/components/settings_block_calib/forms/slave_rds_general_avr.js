import React from 'react'

import SettingsBlockWrap from '../../settings_block_wrap'
import FormInput from '../../form_input'

import { Alt_station_manage } from '../../custom_groups/alt_station_manage'

import clone from 'lodash/clone'
import { dataArray_to_string } from '../../../logic/request_logic'
import { reducers } from '../../../store/reducers/core_store_reducers'
import { useSelector } from 'react-redux'
import Settings_block_calib from '..'

export default function Slave_Rds_general_({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.section_data.rds.rds_general_settings)

  const [rdsGeneralState, setRdsGeneralState] = React.useState({
    tp: false,
    ta: false,
    pi: '',
    ps_name: '',
    radio_text: ''
  })

  React.useEffect(() => {
    if (calib_state != 'null' && calib_state != undefined) {
      let settings_state_copy = rdsGeneralState

      for (const key in settings_state_copy) {
        settings_state_copy[key] = calib_state[key]
      }

      setRdsGeneralState(settings_state_copy)
    }
  }, [calib_state])

  const state_handler = (state) => {
    let target_state_clone = clone(rdsGeneralState)

    for (const key in state) {
      target_state_clone[key] = state[key]
    }

    setRdsGeneralState(target_state_clone)
  }

  const handleChange = (event) => {
    const target = event.target,
          name = target.name;

    let value

    if (target.classList.contains('split')) {
      let split_value = target.value,
          separator = ' ',
          limit = 8,
          unmask_value = split_value.replace(/[^\d]/g, '')

      let output = [];

      if (unmask_value.length > (limit * 4)) {
        unmask_value = unmask_value.slice(0, (limit * 4))
      }

      for (let i = 0; i < unmask_value.length; i++) {
        if (i !== 0 && i % limit === 0) {
          output.push(separator);
        }

        output.push(unmask_value[i]);
      }

      value = output.join('');

    } else {
      value = target.type === 'checkbox' ? target.checked : target.value; 
    }

    setRdsGeneralState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const req_data_str = dataArray_to_string(rdsGeneralState)

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.section_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        remote_control: rdsGeneralState
      }
    }

    clickHandler(request_obj);
  }

  return (
    <Settings_block_calib
      header={'rds - общее'}
      settings_type={'rds_general_settings'}
      section_name={props.section_name}>
      <li
        key='tp_ta_settings'
        id='tp_ta_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`ta_input`}
            className="settings_itemLabel">
            Коды TP и TA
          </label>
        </div>
        <div className='item_input'>
          <span className='checkbox_wrap'>
            TP
            <FormInput
              id={`tp_input`}
              name={`tp`}
              changeHandler={handleChange}
              input_value={rdsGeneralState.tp}
              type="checkbox" />
          </span>

          <span className='checkbox_wrap'>
            TA
            <FormInput
              id={`ta_input`}
              name={`ta`}
              changeHandler={handleChange}
              input_value={rdsGeneralState.ta}
              type="checkbox" />
          </span>
          <FormInput
            id={``}
            name={``}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='pi_settings'
        id='pi_settings'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`pi_input`}
            className="settings_itemLabel">
            PI
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`pi_input`}
            name={`pi`}
            changeHandler={handleChange}
            input_value={rdsGeneralState.pi}
            type="checkbox" />

          <FormInput
            id={``}
            name={``}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='ps_name_settings'
        id='ps_name_settings'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`ps_name_input`}
            className="settings_itemLabel">
            PS Name	
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`ps_name_input`}
            name={`ps_name`}
            changeHandler={handleChange}
            input_value={rdsGeneralState.ps_name}
            type="text_large_split" />
          <FormInput
            id={``}
            name={``}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='radio_text_settings'
        id='radio_text_settings'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`radio_text_input`}
            className="settings_itemLabel">
            Radio text
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`radio_text_input`}
            name={`radio_text`}
            changeHandler={handleChange}
            input_value={rdsGeneralState.radio_text}
            type="text_large" />
          <FormInput
            id={``}
            name={``}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <Alt_station_manage
        parent_state={rdsGeneralState}
        state_handler={state_handler}
        update_handler={props.clickHandler}
        parent_props={calib_state} />
    </Settings_block_calib>
  )
}