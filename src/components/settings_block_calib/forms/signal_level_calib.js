import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

export default function SignalCalibSettings(props) {
  const calibSignal_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_signal)

  const [signalCalibState, setSignalCalibState] = React.useState({
    signal_type: 0,
    signal_0_value: 0,
    signal_1_value: 1,
    signal_2_value: 2
  })

  React.useEffect(() => {
    if (!calibSignal_store) {
      return
    }

    if (Object.keys(calibSignal_store).length != 0) {
      let calib_state_copy = cloneDeep(signalCalibState)

      for (const key in calibSignal_store) {
        if (Array.isArray(calibSignal_store[key])) {
          const divident = calibSignal_store[key][0],
            divider = calibSignal_store[key][1] == 0 ? 1 : calibSignal_store[key][1],
            digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calibSignal_store[key]
        }
      }

      setSignalCalibState(calib_state_copy)
    }

  }, [calibSignal_store])

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

    if (calibSignal_store != undefined && calibSignal_store[name] != undefined) {
      if (Array.isArray(calibSignal_store[name])) {
        value = signalCalibState[name] * 10
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calibSignal_store)
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
      reducer: reducers.calibration_form,
      update_data: signalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_signal: state_to_save
      }
    }

    props.clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {
    const request_obj = {
      address: 'calib_signal_zero.cgi',
      data: `signal$${signalCalibState.signal_type}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);

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
            type="text" />
          <FormInput
            id={`signal_value_calib_save`}
            name={`signal_${signalCalibState.signal_type}_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
          <div className="vertical_li_divider"></div>
          <FormInput
            id={`signal_zero_calib_input`}
            name={`signal_${signalCalibState.signal_type}_zero_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
      </li>

    </Settings_block_calib>
  )

}