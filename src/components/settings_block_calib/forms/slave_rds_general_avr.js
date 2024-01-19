import React from 'react'

import SettingsBlockWrap from '../../settings_block_wrap'
import FormInput from '../../form_input'

// import { Alt_station_manage } from '../../custom_groups/alt_station_manage'

import clone from 'lodash/clone'
import { dataArray_to_string } from '../../../logic/request_logic'
import { useSelector } from 'react-redux'
import Settings_block_calib from '..'
import { cloneDeep, merge } from 'lodash'
import { reducers } from '../../../store/reducers/avr_control_reducers'
import { diff } from 'deep-object-diff'
import { hasCyrillicSymbols, isHexNumber, isInNumRange } from '../../../logic/validation/validators'
import { useFormValidation } from '../../../logic/validation/formValidation_hook'

const transTypesArray = ["(none)", "News", "Affairs", "Info", "Sport", "Educate", "Drama", "Culture", "Science", "Varied", "Pop M", "Rock M", "Easy M", "Light M", "Classics", "Other M", "Weather", "Finance", "Children", "Social", "Religion", "Phone In", "Travel", "Leisure", "Jazz", "Country", "Nation M", "Oldies", "Folk M", "Document", "TEST", "Alarm!"];

export default function Slave_Rds_general_AVR({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.section_data.rds.rds_general_settings)

  const [rdsGeneralState, setRdsGeneralState] = React.useState({
    tp: false,
    ta: false,
    pi: '',
    ps_name: '',
    trans_genre: 0,
    trans_type: 0,
    radio_text: ''
  })

  const {isFormValid, validStatus_getter} = useFormValidation()

  const state_prev_copy = React.useRef(null)

  React.useEffect(() => {
    if (calib_state != 'null' && calib_state != undefined) {
      let settings_state_copy = rdsGeneralState

      for (const key in calib_state) {
        settings_state_copy[key] = calib_state[key]
      }

      setRdsGeneralState(settings_state_copy)

      state_prev_copy.current = settings_state_copy
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
          unmask_value = split_value.replace(/\s/g, '')

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

  const handleClick_save = (event, payload) => {
    const state_diff = diff(state_prev_copy.current, rdsGeneralState),
          req_data_str = dataArray_to_string(state_diff, (value, key) => {
        if (calib_state != undefined && calib_state[key] != undefined) {
          if (Array.isArray(calib_state[key])) {
            if (typeof calib_state[key][1] == 'number' &&
              calib_state[key][1] > 0)
              return value * calib_state[key][1]
          } else {
            return typeof value == "boolean" ? Number(value) : value;
          }
        } else {
          return typeof value == "boolean" ? Number(value) : value;
        }
      })

    // const target = event.target,
    //       name = target.name,
    //       value = target.type === 'checkbox' ? Number(target.checked) : rdsGeneralState[name]

    // let state_clone = cloneDeep(rdsGeneralState)

    // if (payload) {
    //   state_clone = merge(state_clone, payload)
    // } else {
    //   state_clone[name] = value
    // }

    const request_obj = {
      address: `set_${props.section_name}.cgi`,
      data: req_data_str,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        slave_rds: state_diff
      }
    }

    clickHandler(request_obj);
  }

  return (
    <SettingsBlockWrap 
      header={'rds - общее'}
      settings_type={'rds_general_settings'}
      section_name={props.section_name}
      save_handler={handleClick_save}
      disable_save={!isFormValid} >
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
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" 
            validators={[
              isHexNumber(),
              isInNumRange('0x0000', '0xFFFF')
            ]}
            formValidHandler={validStatus_getter} />
        </div>
      </li>
      <li
        key='ps_name_settings'
        id='ps_name_settings'
        className="settings_item">
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
            type="text_large_split"
            validators={[
              hasCyrillicSymbols()
            ]}
            formValidHandler={validStatus_getter} />
        </div>
      </li>
      <li
        key='trans_genre_calib'
        id='trans_genre_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`trans_genre_calib_input`}
            className="settings_itemLabel">
            Тип передачи
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`input_signal_type_calib_input`}
            name={`trans_genre`}
            type='select'
            input_value={rdsGeneralState.trans_genre}
            title='Тип передачи'
            variants={transTypesArray}
            changeHandler={handleChange} />
        </div>
      </li>
      <li
        key='trans_type_calib'
        id='trans_type_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`trans_type_calib_input`}
            className="settings_itemLabel">
            Музыка/Речь
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`input_signal_type_calib_input`}
            name={`trans_type`}
            type='select'
            input_value={rdsGeneralState.trans_type}
            title='Тип передачи'
            variants={[
              'Речь',
              'Музыка'
            ]}
            changeHandler={handleChange} />
        </div>
      </li>
      <li
        key='radio_text_settings'
        id='radio_text_settings'
        className="settings_item">
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
            max_length={64}
            type="text_large"
            validators={[
              hasCyrillicSymbols()
            ]}
            formValidHandler={validStatus_getter} />
        </div>
      </li>
      {/* <Alt_station_manage
        parent_state={rdsGeneralState}
        state_handler={state_handler}
        update_handler={props.clickHandler}
        save_handler={handleClick_save}
        parent_props={calib_state} /> */}
    </SettingsBlockWrap>
  )
}