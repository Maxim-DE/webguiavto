import React from 'react'

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/avr_control_reducers';
import { diff } from 'deep-object-diff';
import { dataArray_to_string } from '../../../logic/request_logic';
import SettingsBlockWrap from '../../settings_block_wrap';
import { hasCyrillicSymbols } from '../../../logic/validation/validators';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';

export default function SlaveAddGeneralCalib_AVR({ calib_state, clickHandler, ...props }) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    radio_label: '',
    rds_enable: 0,
    scheduler_enable:0
  })

  const state_prev_copy = React.useRef(null)

  React.useEffect(() => {
    if (!calib_state) {
      return
    }

    if (Object.keys(calib_state).length != 0) {
      let calib_state_copy = cloneDeep(generalCalibState)

      for (const key in calib_state) {
        if (Array.isArray(calib_state[key])) {
          const divident = calib_state[key][0],
            divider = calib_state[key][1] == 0 ? 1 : calib_state[key][1],
            digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calib_state[key]
        }
      }

      setGeneralCalibState(calib_state_copy)

      state_prev_copy.current = calib_state_copy
    }

  }, [calib_state])

  React.useEffect(() => {
    props.rdsHandler(generalCalibState.rds_enable);
  }, [generalCalibState.rds_enable]);

  React.useEffect(() => {
    props.schedulerHandler?.(generalCalibState.scheduler_enable);
  }, [generalCalibState.scheduler_enable]);

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setGeneralCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    event.preventDefault()

    const target = event.currentTarget,
          name = target.name.replace('_calib', '')

    const state_diff = target.type === 'checkbox' ? { [name]: generalCalibState[name] } : 
                                                          diff(state_prev_copy.current, generalCalibState),

          req_data_str = target.type === 'checkbox' ? `${name}$${Number(event.target.checked)}` : 
                                                            dataArray_to_string(state_diff, (value, key) => {
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

    const request_obj = {
      address: 'calib_add_general.cgi',
      data: req_data_str,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        slave_add_general: state_diff
      }
    }

    clickHandler(request_obj);

  }

  return (
    <SettingsBlockWrap
      header={`дополнительно`}
      settings_type={`slave_add_general`}
      section_name={props.section_name}
      save_handler={handleClick_save}>

      {/* Радиостанция (подпись) */}   
      <li
        key='radio_label_calib'
        id='radio_label_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`radio_label_calib_input`}
            className="settings_itemLabel">
            Радиостанция (подпись)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`radio_label_calib_input`}
            name={`radio_label_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.radio_label}
            style={{ margin: '0', maxWidth: '150px' }}
            max_length={32}
            type="text" />
        </div>
      </li>

      {/* Работа по расписанию */}
      <li
        key='scheduler_enable'
        id='scheduler_enable'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`scheduler_enable_input`}
            className="settings_itemLabel">
            Работа по расписанию
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`scheduler_enable_input`}
            name={`scheduler_enable`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            input_value={generalCalibState.scheduler_enable}
            type="switch" />
        </div>
      </li>
      
      <li
        key='reserve_enable'
        id='reserve_enable'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`reserve_enable_input`}
            className="settings_itemLabel">
            Резервирование мощностии
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`reserve_enable_input`}
            name={`reserve_enable`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            type="switch"
            input_value={generalCalibState.reserve_enable} />
        </div>
      </li>

      {/* Резервирование звука */}
      <li
        key='reserve_sound_enable'
        id='reserve_sound_enable'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`reserve_sound_enable_input`}
            className="settings_itemLabel">
            Резервирование звука
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`reserve_sound_enable_input`}
            name={`reserve_sound_enable`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            type="switch"
            input_value={generalCalibState.reserve_sound_enable} />
        </div>
      </li>

    </SettingsBlockWrap>
  )
}
