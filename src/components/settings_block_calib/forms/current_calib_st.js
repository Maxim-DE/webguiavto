import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../store_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function CurrentCalibSettings_ST(props) {
  const calibCurrent_store = useSelector((store) => {
    if (deepKeyExists(store, 'current_value')) {
      return store.globalStore.global_data.calib_state.data?.calib_current?.current_value
    } else return ''
  }),
        auth_store = useSelector((store) => store.authStore.auth_data)

  // store.globalStore.global_data.calib_state.data?.calib_current?.current_value

  const [amperageCalibState, setAmperageCalibState] = React.useState({
    psu_enable: 0,
    I1: '',
    I2: '',
    I3_available: 0,
    I3: '',
    I4_available: 0,
    I4: ''
  })

  React.useEffect(() => {
    if (Object.keys(calibCurrent_store).length != 0 && calibCurrent_store != undefined) {
      console.log(calibCurrent_store);
      let calib_state_copy = cloneDeep(amperageCalibState)

      for (const key in calibCurrent_store) {
        if (typeof calibCurrent_store[key] === 'object') {
          const divident = calibCurrent_store[key]?.value[0],
                divider = calibCurrent_store[key]?.value[1] == 0 ? 1 : calibCurrent_store[key].value[1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)

          if(Object.hasOwn(calibCurrent_store[key], 'availability')) {
            calib_state_copy[`${key}_available`] = calibCurrent_store[key].availability
          }

        } else {
          calib_state_copy[key] = calibCurrent_store[key]
        }

      }
      
      setAmperageCalibState(calib_state_copy)

    }
  }, [calibCurrent_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
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
    
    if (calibCurrent_store === undefined ||
        calibCurrent_store === '') {
      return
    }
    
    const divider = calibCurrent_store[name].value[1] ? calibCurrent_store[name].value[1] : 1

    let coverted_state = {
      [name]: {
        value: [],
        availability: 0
      }
    }

    coverted_state[name].value[0] = value * divider
    coverted_state[name].value[1] = divider
    
    if (amperageCalibState[`${name}_available`]) {
      coverted_state[name].availability = amperageCalibState[`${name}_available`]
    }

    // let state_obj = { [name]: value },
    //     converted_state = calib_state_conversion(state_obj, calibCurrent_store)

    // state_obj[name] = {}

    // state_obj[name].value = converted_state[name]

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
          current_value: coverted_state
        }
      }
    }

    props.clickHandler(request_obj);
    
  }

  const handleAvaliablility_save = (event) => {
    const target = event.target,

          target_name = target.name.replace('_calib', ''),
          target_value = Number(target.checked),

          current_name = target_name.replace('_available', ''),
          current_value = amperageCalibState[current_name]

    const divider = calibCurrent_store[current_name].value[1] ? calibCurrent_store[current_name].value[1] : 1

    let converted_state = {
      [current_name]: {
        value: [],
        availability: 0
      }
    }

    converted_state[current_name].value[0] = current_value * divider
    converted_state[current_name].value[1] = divider
    converted_state[current_name].availability = target_value


    const request_obj = {
      address: 'calib_current.cgi',
      data: `${target_name}$${target_value}`,
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
        notifications: {
          good: 'default',
          bad: 'default'
        },
        data: `Ix$${value}`
      }
    } else {
      request_obj = {
        address: 'calib_current_zeros.cgi',
        notifications: {
          good: 'default',
          bad: 'default'
        },
        data: `${name}$${value}`
      }
    }
    

    props.clickHandler(request_obj);

  }

  const handleChange_save = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '');

    const request_obj = {
      address: 'calib_current.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_current: {
          current_value: {
            [name]: value
          }
        }
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib header={`калибровка токов`}
                          settings_type={`current_calib`}
                          section_name={props.section_name}>
      <li
        key='psu_enable_calib'
        id='psu_enable_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`psu_enable_calib_input`}
            className="settings_itemLabel">
            Выкл/вкл блок питания
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`psu_enable_calib_input`}
            name={`psu_enable_calib`}
            changeHandler={(e) => {
              handleChange(e)
              handleChange_save(e)
            }}
            input_value={!!amperageCalibState.psu_enable}
            type="switch" />
        </div>
      </li>
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
            АЦП: {props.adc_data.I1}
          </span>
          <FormInput
            id={`I1_calib_input`}
            name={`I1_calib`}
            class="calib_input"
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
            АЦП: {props.adc_data.I2}
          </span>
          <FormInput
            id={`I2_calib_input`}
            name={`I2_calib`}
            class="calib_input"
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
      <li className="group_divider" />
      <li
        key='I3_calib'
        id='I3_calib'
        className="settings_item calib">
        <div className='item_header'>
          {auth_store.auth_access.calib_extend &&
          <FormInput
            id={`I3_available_calib_input`}
            name={`I3_available_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleAvaliablility_save(e)
            }}
            input_value={amperageCalibState.I3_available}
            type="checkbox" />
          }
          <label
            htmlFor={`I3_calib_input`}
            className="settings_itemLabel">
            Калибровка I3
          </label>
          {!!amperageCalibState.I3_available &&
            <FormInput
              id={`I3_zeros_calib_input`}
              name={`I3_zeros_calib`}
              label='Калибровка нуля'
              clickHandler={handleClick_calib_zeros}
              type="button" />
          }
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.I3}
          </span>
          <input
            id={'I3_calib_input'}
            name={'I3_calib'}
            className={`calib_input ${
              amperageCalibState.I3_available ? '' : 'disabled_input'}`}
            type="text"
            disabled={!amperageCalibState.I3_available}
            onChange={handleChange}
            value={amperageCalibState.I3}
            placeholder={'X.XX А'}
            style={props.style}
          />
          <input
            id={`I3_calib_save`}
            name={`I3_calib`}
            className={`button_input ${
              amperageCalibState.I3_available ? '' : 'disabled_input'}`}
            type="button"
            value={'Сохранить'}
            disabled={!amperageCalibState.I3_available}
            onClick={handleClick_save} />
        </div>
      </li>
      <li
        key='I4_calib'
        id='I4_calib'
        className="settings_item calib">
        <div className='item_header'>
          {auth_store.auth_access.calib_extend &&
          <FormInput
            id={`I4_available_calib_input`}
            name={`I4_available_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleAvaliablility_save(e)
            }}
            input_value={amperageCalibState.I4_available}
            type="checkbox" />
          }
          <label
            htmlFor={`I4_calib_input`}
            className="settings_itemLabel">
            Калибровка I4
          </label>
          {!!amperageCalibState.I4_available &&
            <FormInput
              id={`I4_zeros_calib_input`}
              name={`I4_zeros_calib`}
              label='Калибровка нуля'
              clickHandler={handleClick_calib_zeros}
              type="button" />
          }
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.I4}
          </span>
          <input
            id={'I4_calib_input'}
            name={'I4_calib'}
            className={`calib_input ${
              amperageCalibState.I4_available ? '' : 'disabled_input'}`}
            type="text"
            disabled={!amperageCalibState.I4_available}
            onChange={handleChange}
            value={amperageCalibState.I4}
            placeholder={'X.XX А'}
            style={props.style}
          />
          <input
            id={`I4_calib_save`}
            name={`I4_calib`}
            className={`button_input ${
              amperageCalibState.I4_available ? '' : 'disabled_input'}`}
            type="button"
            value={'Сохранить'}
            disabled={!amperageCalibState.I4_available}
            onClick={handleClick_save} />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default CurrentCalibSettings_ST;