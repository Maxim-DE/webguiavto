import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function CurrentCalibSettings(props) {
  const calibCurrent_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_current?.current_value),
        adcCurrent_store = useSelector((store) => {
          if (deepKeyExists(store, 'current_calib')) {
            return store.globalStore.global_data.status_data.calib_adc?.current_calib
          } else return ''
        })

  const [amperageCalibState, setAmperageCalibState] = React.useState({
    I1: '',
    I2: '',
    I3: '',
    I4: ''
  })

  React.useEffect(() => {
    if (!calibCurrent_store) return

    if (Object.keys(calibCurrent_store).length != 0) {
      let calib_state_copy = {}

      for (const key in calibCurrent_store) {
        const divident = calibCurrent_store[key][0],
              divider = calibCurrent_store[key][1] == 0 ? 1 : calibCurrent_store[key][1],
              digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }
      
      setAmperageCalibState(calib_state_copy)

    }
  }, [calibCurrent_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    
    

    setAmperageCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  
  const handleClick_save = (event) => {
    const target = event.target,
    name = target.name.replace('_calib', ''),
    value = amperageCalibState[name]
    
    
    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, calibCurrent_store)

    const request_obj = {
      address: 'calib_current.cgi',
      data: `${name}$${value*10}`,
      reducer: reducers.calibration_form,
      update_data: amperageCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_current: {
          current_value: converted_state
        }
      }
    }

    props.clickHandler(request_obj);
    
  }

  const handleClick_calib_zeros = (event) => {
    const target = event.target,
          name = target.name.replace('_zeros_calib', ''),
          value = 1

    let request_obj

    if (/all/gi.test(name)) {
      request_obj = {
        address: 'calib_current_zeros.cgi',
        data: `Ix$${value}`
      }
    } else {
      request_obj = {
        address: 'calib_current_zeros.cgi',
        data: `${name}$${value}`
      }
    }
    

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка токов`}
                          settings_type={`current_calib`}
                          section_name={props.section_name}>
      <li
        key='I_zeros_calib'
        id='I_zeros_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`I_zeros_calib_input`}
            className="settings_itemLabel">
            Калибровка нулей токов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`I_all_zeros_calib_input`}
            name={`I_all_zeros_calib`}
            label='Калибровка нулей'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
      </li>
      <li
        key='I1_calib'
        id='I1_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`I1_calib_input`}
            className="settings_itemLabel">
            Калибровка I1
          </label>
          <FormInput
            id={`I1_zeros_calib_input`}
            name={`I1_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcCurrent_store.I1}
          </span>
          <FormInput
            id={`I1_calib_input`}
            name={`I1_calib`}
            changeHandler={handleChange}
            input_value={amperageCalibState.I1}
            type="text" />
          <FormInput
            id={`I1_calib_save`}
            name={`I1_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='I2_calib'
        id='I2_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`I2_calib_input`}
            className="settings_itemLabel">
            Калибровка I2
          </label>
          <FormInput
            id={`I2_zeros_calib_input`}
            name={`I2_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcCurrent_store.I2}
          </span>
          <FormInput
            id={`I2_calib_input`}
            name={`I2_calib`}
            changeHandler={handleChange}
            input_value={amperageCalibState.I2}
            type="text" />
          <FormInput
            id={`I2_calib_save`}
            name={`I2_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='I3_calib'
        id='I3_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`I3_calib_input`}
            className="settings_itemLabel">
            Калибровка I3
          </label>
          <FormInput
            id={`I3_zeros_calib_input`}
            name={`I3_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcCurrent_store.I3}
          </span>
          <FormInput
            id={`I3_calib_input`}
            name={`I3_calib`}
            changeHandler={handleChange}
            input_value={amperageCalibState.I3}
            type="text" />
          <FormInput
            id={`I3_calib_save`}
            name={`I3_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='I4_calib'
        id='I4_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`I4_calib_input`}
            className="settings_itemLabel">
            Калибровка I4
          </label>
          <FormInput
            id={`I4_zeros_calib_input`}
            name={`I4_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcCurrent_store.I4}
          </span>
          <FormInput
            id={`I4_calib_input`}
            name={`I4_calib`}
            changeHandler={handleChange}
            input_value={amperageCalibState.I4}
            type="text" />
          <FormInput
            id={`I4_calib_save`}
            name={`I4_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default CurrentCalibSettings;