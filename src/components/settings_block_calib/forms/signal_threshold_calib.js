import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/avr_control_reducers';

export default function SignalThresholdSettings({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_signal)

  const [signalThresholdCalibState, setSignalThresholdCalibState] = React.useState({
    signal_type_reserved: 0,
    signal_0_reserved_value: 0,
    signal_1_reserved_value: 1,
    signal_2_reserved_value: 2,
    signal_3_reserved_value: 2,
    signal_4_reserved_value: 2,
    reserved_threshold_timeout: 1000,
    signal_type_recovery: 0,
    signal_0_recovery_value: 0,
    signal_1_recovery_value: 1,
    signal_2_recovery_value: 2,
    signal_3_recovery_value: 2,
    signal_4_recovery_value: 2,
    recovery_threshold_timeout: 1000,
  })

  React.useEffect(() => {
    if (!calib_state) {
      return
    }

    if (Object.keys(calib_state).length != 0) {
      let calib_state_copy = cloneDeep(signalThresholdCalibState)

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

      setSignalThresholdCalibState(calib_state_copy)
    }

  }, [calib_state])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setSignalThresholdCalibState(prevState => ({
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
          value = signalThresholdCalibState[name] * calib_state[name][1]
        } else {
          value = signalThresholdCalibState[name]
        }
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = signalThresholdCalibState[name]
        state_to_save = { [name]: value }
      }
    } else {
      value = signalThresholdCalibState[name]
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_signal_threshold.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      update_data: signalThresholdCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_signal_threshold: state_to_save
      }
    }

    clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`установка порогов звука`}
      settings_type={`network_calib`}
      section_name={props.section_name}>
      <li
        key='signal_reserved_threshold_calib'
        id='signal_reserved_threshold_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`signal_type_reserved_calib`}
            className="settings_itemLabel">
            Порог переключения на резерв, дБ
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`signal_type_reserved_calib`}
            name={`signal_type_reserved_calib`}
            type='select'
            input_value={signalThresholdCalibState.signal_type_reserved}
            title='Тип сигнала'
            variants={[
              'L',
              'R',
              'AES_L',
              'AES_R',
              'КСС'
            ]}
            changeHandler={handleChange} />
          <FormInput
            id={`signal_reserved_threshold_calib_input`}
            name={`signal_${signalThresholdCalibState.signal_type_reserved}_reserved_value_calib`}
            changeHandler={handleChange}
            input_value={signalThresholdCalibState[`signal_${signalThresholdCalibState.signal_type_reserved}_reserved_value`]}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='дБ'
            type="text" />
          <FormInput
            id={`signal_reserved_threshold_calib_save`}
            name={`signal_${signalThresholdCalibState.signal_type_reserved}_reserved_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='reserved_threshold_timeout_calib'
        id='reserved_threshold_timeout_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`reserved_threshold_timeout_calib_input`}
            className="settings_itemLabel">
            Тайм-аут перехода на резерв, с
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`reserved_threshold_timeout_calib_input`}
            name={`reserved_threshold_timeout_calib`}
            changeHandler={handleChange}
            input_value={signalThresholdCalibState.reserved_threshold_timeout}
            style={{ margin: '0', maxWidth: '75px' }}
            
            type="text" />
          <FormInput
            id={`reserved_threshold_timeout_calib_save`}
            name={`reserved_threshold_timeout_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='signal_recovery_threshold_calib'
        id='signal_recovery_threshold_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`signal_type_recovery_calib`}
            className="settings_itemLabel">
            Порог восстановления сигнала, дБ
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`signal_type_recovery_calib`}
            name={`signal_type_recovery_calib`}
            type='select'
            input_value={signalThresholdCalibState.signal_type_recovery}
            title='Тип сигнала'
            variants={[
              'L',
              'R',
              'AES_L',
              'AES_R',
              'КСС'
            ]}
            changeHandler={handleChange} />
          <FormInput
            id={`signal_recovery_threshold_calib_input`}
            name={`signal_${signalThresholdCalibState.signal_type_recovery}_recovery_value_calib`}
            changeHandler={handleChange}
            input_value={signalThresholdCalibState[`signal_${signalThresholdCalibState.signal_type_recovery}_recovery_value`]}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='дБ'
            type="text" />
          <FormInput
            id={`signal_recovery_threshold_calib_save`}
            name={`signal_${signalThresholdCalibState.signal_type_recovery}_recovery_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='recovery_threshold_timeout_calib'
        id='recovery_threshold_timeout_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`recovery_threshold_timeout_calib_input`}
            className="settings_itemLabel">
            Тайм-аут на восстановление звука, с
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`recovery_threshold_timeout_calib_input`}
            name={`recovery_threshold_timeout_calib`}
            changeHandler={handleChange}
            input_value={signalThresholdCalibState.recovery_threshold_timeout}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`recovery_threshold_timeout_calib_save`}
            name={`recovery_threshold_timeout_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )

}