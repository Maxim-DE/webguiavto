import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function TempThresholdCalibSettings(props) {
  const calibTemp_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_temp')) {
      return store.globalStore.global_data.calib_state.data?.calib_temp
    } else return ''
  }),
        auth_store = useSelector((store) => store.authStore.auth_data)

  const [tempThresholdCalibState, setTempThresholdCalibState] = React.useState({
    temp_threshold_on: '',
    temp_threshold_off: '',
    temp_address: ''
  })

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!calibTemp_store) return

    if (Object.keys(calibTemp_store).length != 0) {
      let calib_state_copy = tempThresholdCalibState

      for (const key in calibTemp_store) {

        if (key == 'temp_address') {
          calib_state_copy[key] = calibTemp_store[key]
          continue;
        }
        
        const divident = calibTemp_store[key][0],
              divider = calibTemp_store[key][1] == 0 ? 1 : calibTemp_store[key][1],
              digits = Math.log10(divider)

        // if (divider == 1) {
        //   digits = 0
        // } else {
        //   digits = Math.log10(divider)
        // }

        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setTempThresholdCalibState(calib_state_copy)

    }
  }, [calibTemp_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setTempThresholdCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = tempThresholdCalibState[name],
          multiplier =  Array.isArray(calibTemp_store[name]) ? (calibTemp_store[name][1]) : 1

    let state_obj = {},
        converted_state

    if (Array.isArray(calibTemp_store[name])) {
      state_obj[name] = value
      converted_state = calib_state_conversion(state_obj, calibTemp_store)
    } else {
      converted_state = { [name]: value * multiplier }
    }

    const request_obj = {
      address: 'calib_temp_threshold.cgi',
      data: `${name}$${value * multiplier}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_temp: converted_state
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка защиты по темп.`}
      settings_type={`temp_threshold_calib`}
      save_handler={handleClick_save}>
      <li
        key='temp_threshold_on_calib'
        id='temp_threshold_on_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`temp_threshold_on_calib_input`}
            className="settings_itemLabel">
            Порог вкл. усилителя (рабочий)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`temp_threshold_on_calib_input`}
            name={`temp_threshold_on_calib`}
            changeHandler={handleChange}
            input_value={tempThresholdCalibState.temp_threshold_on}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`temp_threshold_on_calib_save`}
            name={`temp_threshold_on_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='temp_threshold_off_calib'
        id='temp_threshold_off_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`temp_threshold_off_calib_input`}
            className="settings_itemLabel">
            Порог выкл. усилителя (аварийный)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`temp_threshold_off_calib_input`}
            name={`temp_threshold_off_calib`}
            changeHandler={handleChange}
            input_value={tempThresholdCalibState.temp_threshold_off}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`temp_threshold_off_calib_save`}
            name={`temp_threshold_off_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      {auth_store.auth_access.calib_extend &&
      <>
      <li className="group_divider"></li>
      <li
        key='temp_address_calib'
        id='temp_address_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`temp_address_calib_input`}
            className="settings_itemLabel">
            Адрес датчика температуры
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`temp_address_calib_input`}
            name={`temp_address_calib`}
            changeHandler={handleChange}
            input_value={tempThresholdCalibState.temp_address}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`temp_address_calib_save`}
            name={`temp_address_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      </>
      }

    </Settings_block_calib>
  )
}

export default TempThresholdCalibSettings