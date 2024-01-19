import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/avr_control_reducers';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';
import { maxLength, required } from '../../../logic/validation/validators';

export default function SignalCalibSettings({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_signal)

  const [signalCalibState, setSignalCalibState] = React.useState({
    signal_type: 0,
    signal_0_value: 0,
    signal_1_value: 1,
    signal_2_value: 2
  })

  const { isFormValid, validStatus_getter, validInputList } = useFormValidation()

  React.useEffect(() => {
    if (!calib_state) {
      return
    }

    if (Object.keys(calib_state).length != 0) {
      let calib_state_copy = cloneDeep(signalCalibState)

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

      setSignalCalibState(calib_state_copy)
    }

  }, [calib_state])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setSignalCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', '')

    let value, state_to_save

    if (calib_state != undefined && calib_state[name] != undefined) {
      if (Array.isArray(calib_state[name])) {
        if (typeof calib_state[name][1] == 'number' &&
          calib_state[name][1] > 0) {
          value = signalCalibState[name] * calib_state[name][1]
        } else {
          value = signalCalibState[name]
        }
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = signalCalibState[name]
        state_to_save = { [name]: value }
      }
    }  else {
      value = signalCalibState[name]
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_signal.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      update_data: signalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_signal: state_to_save
      }
    }

    clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {
    const request_obj = {
      address: 'calib_signal_zero.cgi',
      // data: `signal$${signalCalibState.signal_type}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка уровня звука`}
      settings_type={`signal_level_calib`}
      section_name={props.section_name}>
      <li
        key='signal_type_level_calib'
        id='signal_type_level_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`signal_type_calib_input`}
            className="settings_itemLabel">
            Калибровка уровня звука
          </label>
          <FormInput
            id={`signal_type_calib_input`}
            name={`signal_type_calib`}
            type='select'
            input_value={signalCalibState.signal_type}
            title='Тип устройства'
            variants={[
              'L',
              'R',
              'КСС'
            ]}
            changeHandler={handleChange} />
        </div>
        <div className='item_input'>
          <FormInput
            id={`signal_value_calib_input`}
            name={`signal_${signalCalibState.signal_type}_value_calib`}
            changeHandler={handleChange}
            input_value={signalCalibState[`signal_${signalCalibState.signal_type}_value`]}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='дБ'
            validators={[
              required()
            ]}
            formValidHandler={validStatus_getter}
            type="text" />
          <FormInput
            id={`signal_value_calib_save`}
            name={`signal_${signalCalibState.signal_type}_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            disabled={!validInputList[`signal_${signalCalibState.signal_type}_value_calib`]}
            type="button" />
          {/* <div className="vertical_li_divider"></div>
          <FormInput
            id={`signal_zero_calib_input`}
            name={`signal_${signalCalibState.signal_type}_zero_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" /> */}
        </div>
      </li>
      <li
        key='signal_zero_calib'
        id='signal_zero_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`signal_zero_calib_input`}
            className="settings_itemLabel">
            Калибровка всех нулей каналов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`signal_zero_calib_input`}
            name={`signal_zero_calib`}
            label='Калибровать'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}