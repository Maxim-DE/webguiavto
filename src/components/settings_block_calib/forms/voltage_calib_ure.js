import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function VoltageCalibSettings_URE(props) {
  const calibVoltage_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_voltage')) {
      return store.globalStore.global_data.calib_state.data?.calib_voltage
    } else return ''
  }),
  info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info),
  adcVoltage_store = useSelector((store) => {
    if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'voltage_calib')) {
      return store.globalStore.global_data.status_data.calib_adc?.voltage_calib
    } else return ''
  }),
  auth_store = useSelector((store) => store.authStore.auth_data),
  adcPower_store = useSelector((store) => {
    if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'power_calib')) {
      return store.globalStore.global_data.status_data.calib_adc?.power_calib
    } else return ''
  })
  
  const [voltageCalibState, setVoltageCalibState] = React.useState({
    U1: '',
    U2: '',
    U2_available: 0,
    dac_value: '',
    dac_admin_value: '',
    dac_threshold: '',
  })
  
  const device_type = info_section_data?.info_general?.model !== undefined ? info_section_data.info_general.model : 0

  React.useEffect(() => {
    if (calibVoltage_store != undefined && Object.keys(calibVoltage_store).length != 0) {
      let calib_state_copy = {}

      for (const key in calibVoltage_store) {
        const divident = calibVoltage_store[key][0],
              divider = calibVoltage_store[key][1] == 0 ? 1 : calibVoltage_store[key][1]
        calib_state_copy[key] = (divident / divider).toFixed(Math.log10(divider))

        if (Object.prototype.hasOwnProperty.call(voltageCalibState[key], 'availability')) {
          calib_state_copy[`${key}_available`] = voltageCalibState[key].availability
        }
      }

      setVoltageCalibState(calib_state_copy)

    }
  }, [calibVoltage_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type == 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '');

    setVoltageCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = voltageCalibState[name]

    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, calibVoltage_store)

    const request_obj = {
      address: 'calib_voltage.cgi',
      data: `${name}$${converted_state[name][0]}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_voltage: converted_state
      }
    }

    props.clickHandler(request_obj);

  }

  const handleDACAdmin_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = voltageCalibState[name]

    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, calibVoltage_store)
    // converted_state = state_obj

    const request_obj = {
      address: 'calib_dac_admin.cgi',
      data: `${name}$${converted_state[name][0]}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_voltage: converted_state
      }
    }

    props.clickHandler(request_obj);

  }

  const handleAvaliablility_save = (event) => {
    const target = event.target,

      target_name = target.name.replace('_calib', ''),
      target_value = Number(target.checked),

      current_name = target_name.replace('_available', ''),
      current_value = voltageCalibState[current_name]

    const divider = voltageCalibState[current_name]?.value[1] ? voltageCalibState[current_name].value[1] : 1

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
      address: 'calib_voltage.cgi',
      data: `${target_name}$${target_value}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_voltage: converted_state
      }
    }

    // props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка напряжений`}
      settings_type={`voltage_primary_calib`}>
      <li
        key='U1_calib'
        id='U1_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`U1_calib_input`}
            className="settings_itemLabel">
            Калибровка U1
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcVoltage_store?.U1}
          </span>
          <FormInput
            id={`U1_calib_input`}
            name={`U1_calib`}
            class="calib_input"
            placeholder={'X.X В'}
            changeHandler={handleChange}
            input_value={voltageCalibState.U1}
            type="text" />
          <FormInput
            id={`U1_calib_save`}
            name={`U1_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      {device_type < 3 &&
      <>
        <li className="group_divider"></li>
        {auth_store.auth_access.calib_extend ?
        <>
            <li
              key='dac_admin_value_calib'
              id='dac_admin_value_calib'
              className="settings_item calib">
              <div className='item_header'>
                <label
                  htmlFor={`dac_admin_value_calib_input`}
                  className="settings_itemLabel">
                  Регулировочное значение ЦАП (админ.)
                </label>
              </div>
              <div className='item_input'>
                {/* <span className='item_adc_value'>
              АЦП<sub>АРУ</sub>: {
                adcPower_store ? adcPower_store.dac_value[0] : ''
              }
            </span> */}
                <span className='item_adc_value'>
                  ЦАП<sub>БП</sub>: {adcVoltage_store?.dac}
                </span>
                <FormInput
                  type="text"
                  id={`dac_admin_value_calib_input`}
                  name={`dac_admin_value_calib`}
                  class="text_range"
                  style={{ margin: '0', maxWidth: '54px' }}
                  max_length={4}
                  input_value={voltageCalibState.dac_admin_value}
                  clickHandler={handleChange}
                />
                <FormInput
                  id={`dac_admin_value_calib_save`}
                  name={`dac_admin_value_calib`}
                  clickHandler={handleDACAdmin_save}
                  label='Установить'
                  type="button" />
              </div>
            </li>
            <li
              key='dac_threshold_calib'
              id='dac_threshold_calib'
              className="settings_item calib">
              <div className='item_header'>
                <label
                  htmlFor={`dac_threshold_calib_input`}
                  className="settings_itemLabel">
                  Порог ограничения БП по ЦАП
                </label>
              </div>
              <div className='item_input'>
                <FormInput
                  type="text"
                  id={`dac_threshold_calib_input`}
                  name={`dac_threshold_calib`}
                  class="text_range"
                  max_length={4}
                  style={{ margin: '0', maxWidth: '54px' }}
                  input_value={voltageCalibState.dac_threshold}
                  changeHandler={handleChange}
                />
                <FormInput
                  id={`dac_threshold_calib_save`}
                  name={`dac_threshold_calib`}
                  clickHandler={handleDACAdmin_save}
                  label='Установить'
                  type="button" />
              </div>
            </li>
        </> 
         :
        <li
          key='dac_value_calib'
          id='dac_value_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`dac_value_calib_input`}
              className="settings_itemLabel">
              Значение ЦАП
            </label>
          </div>
          <div className='item_input'>
            <span className='item_adc_value'>
              ЦАП<sub>БП</sub>: {adcVoltage_store?.dac}
            </span>
            <FormInput
              type="text"
              id={`dac_value_calib_input`}
              name={`dac_value_calib`}
              class="text_range"
              max_length={4}
              style={{ margin: '0', maxWidth: '54px' }}
              input_value={voltageCalibState.dac_value}
              changeHandler={handleChange}
            />
            <FormInput
              id={`dac_value_calib_save`}
              name={`dac_value_calib`}
              clickHandler={handleClick_save}
              label='Установить'
              type="button" />
          </div>
        </li>
        }
      </>
      }
      {/* <li
        key='U2_calib'
        id='U2_calib'
        className="settings_item calib">
        <div className='item_header'>
          <FormInput
            id={`U2_available_calib_input`}
            name={`U2_available_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleAvaliablility_save(e)
            }}
            input_value={voltageCalibState.U2_available}
            type="checkbox" />
          <label
            htmlFor={`U2_calib_input`}
            className="settings_itemLabel">
            Калибровка U2
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcVoltage_store?.U2}
          </span>
          <FormInput
            id={`U2_calib_input`}
            name={`U2_calib`}
            class="calib_input"
            changeHandler={handleChange}
            placeholder={'X.X В'}
            disabled={!voltageCalibState.U2_available}
            input_value={voltageCalibState.U2}
            type="text" />
          <FormInput
            id={`U2_calib_save`}
            name={`U2_calib`}
            disabled={!voltageCalibState.U2_available}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li> */}
    </Settings_block_calib>
  )
}

export default VoltageCalibSettings_URE