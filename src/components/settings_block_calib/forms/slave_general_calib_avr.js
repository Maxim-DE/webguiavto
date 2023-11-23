import React from 'react'

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/calib_forms_reducers';

export default function SlaveGeneralCalib_AVR({ calib_state, clickHandler, ...props }) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    frequency: 0,
    input_signal_type: 0,
    radio_label: '',
    rds_enable: 0
  })

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
    }

  }, [calib_state])

  React.useEffect(() => {
    props.rdsHandler(generalCalibState.rds_enable)
  }, [generalCalibState.rds_enable])

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
    const target = event.target,
      name = target.name.replace('_calib', '')

    let value, state_to_save

    if (calib_state != undefined && calib_state[name] != undefined) {
      if (Array.isArray(calib_state[name])) {
        value = generalCalibState[name] * 10
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = target.type === 'checkbox' ? Number(target.checked) : generalCalibState[name]; 
        state_to_save = { [name]: value }
      }
    } else {
      value = target.type === 'checkbox' ? Number(target.checked) : generalCalibState[name]; 
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_signal.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      update_data: generalCalibState,
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

  return (
    <Settings_block_calib header={`общие настройки`}
      settings_type={`slave_general`}
      section_name={props.section_name}>
      <li
        key='frequency_calib'
        id='frequency_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`frequency_calib_input`}
            className="settings_itemLabel">
            Установка нес. частоты
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`frequency_calib_input`}
            name={`frequency_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.frequency}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`frequency_calib_save`}
            name={`frequency_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='input_signal_type_calib'
        id='input_signal_type_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`input_signal_type_calib_input`}
            className="settings_itemLabel">
            Тип вход. сигнала
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`input_signal_type_calib_input`}
            name={`input_signal_type_calib`}
            type='select'
            input_value={generalCalibState.input_signal_type}
            title='Тип сигнала'
            variants={[
              'Stereo',
              'L',
              'R',
              'КСС'
            ]}
            changeHandler={handleChange} />
          <FormInput
            id={`input_signal_type_calib_save`}
            name={`input_signal_type_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
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
            type="text" />
          <FormInput
            id={`radio_label_calib_save`}
            name={`radio_label_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='rds_enable_calib'
        id='rds_enable_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`rds_enable_calib_input`}
            className="settings_itemLabel">
            Параметры RDS
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`rds_enable_calib_input`}
            name={`rds_enable_calib`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            input_value={generalCalibState.rds_enable}
            type="switch" />
        </div>
      </li>
    </Settings_block_calib>
  )
}
