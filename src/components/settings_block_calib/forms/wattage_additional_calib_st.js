import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

import cloneDeep from 'lodash/cloneDeep';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

function WattageAdditionalCalibSettings_ST(props) {
  const [wattageAdditionalCalibState, setWattageAdditionalCalibState] = React.useState({
    input_power: '',
    ballast_1_avaliable: 0,
    ballast_1: ''
  })

  const [authGlobalState, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = cloneDeep(wattageAdditionalCalibState)

      for (const key in props.calib_data) {
        if (Array.isArray(props.calib_data[key])) {
          const divident = props.calib_data[key][0],
                divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = props.calib_data[key]
        }
      }

      setWattageAdditionalCalibState(calib_state_copy)
    }

  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value
    const name = target.name.replace('_calib', '');

    setWattageAdditionalCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = wattageAdditionalCalibState[name],
          multipier = props.calib_data?.[name] ? props.calib_data[name][1] : 10

    // let state_obj = { [name]: value },
    //     converted_state = calib_state_conversion(state_obj, props.calib_data)

    const converted_state = {
      [name]: [
        value * multipier,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_input_power.cgi',
      data: `${name}$${value * multipier}`,
      update_data: wattageAdditionalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_additional_power: converted_state
      } 
    }

    props.clickHandler(request_obj);

  }

  const handleClick_ballast = (event) => {
        const target = event.target,
          name = target.name.replace('_calib', ''),
          value = wattageAdditionalCalibState[name],
          multipier = props.calib_data?.[name] ? props.calib_data[name][1] : 10

    // let state_obj = { [name]: value },
    //     converted_state = calib_state_conversion(state_obj, props.calib_data)

    const converted_state = {
      [name]: [
        value * multipier,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value * multipier}`,
      update_data: wattageAdditionalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_additional_power: converted_state
      } 
    }

    props.clickHandler(request_obj);
  }

  const handleChange_ballast_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = target.type === 'checkbox' ? Number(target.checked) : target.value

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value}`,
      update_data: wattageAdditionalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_additional_power: { [name]: value }
      } 
    }

    props.clickHandler(request_obj);
    
  }

  const handleClick_calib_zeros = (event) => {
    const target = event.target,
      name = target.name.replace('_zeros_calib', ''),
      value = 1

    let request_obj = {
      address: `calib_${name}_zero.cgi`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  const handleClick_calib_ballast_zeros = (event) => {
    const target = event.target,
      name = target.name.replace('_zeros_calib', ''),
      value = 1

    let request_obj = {
      address: `calib_ballast.cgi?${name}_zero$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }
  

  return (
    <Settings_block_calib header={`калибровка мощности (доп.)`}
      settings_type={`power_additional_calib`}>
      <li
        key='input_power_calib'
        id='input_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`input_power_calib_input`}
            className="settings_itemLabel">
            Калибровка вход. мощности
          </label>
          <FormInput
            id={`input_power_zeros_calib_input`}
            name={`input_power_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.input_power}
          </span>
          <FormInput
            id={`input_power_calib_input`}
            name={`input_power_calib`}
            changeHandler={handleChange}
            input_value={wattageAdditionalCalibState.input_power}
            type="text" />
          <FormInput
            id={`input_power_calib_save`}
            name={`input_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li className="group_divider" />
      <li
        key='ballast_1_calib'
        id='ballast_1_calib'
        className="settings_item calib">
        <div className='item_header'>
          {authGlobalState.auth_access.calib_extend &&
          <FormInput
            id={`ballast_1_avaliable_calib_input`}
            name={`ballast_1_avaliable_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleChange_ballast_save(e)
            }}
            input_value={wattageAdditionalCalibState.ballast_1_avaliable}
            type="checkbox" />
          }
          <label
            htmlFor={`ballast_1_calib_input`}
            className="settings_itemLabel">
            Балласт 1, X.XX кВт
          </label>
          {!!wattageAdditionalCalibState.ballast_1_avaliable &&
            <FormInput
              id={`ballast_1_zeros_calib_input`}
              name={`ballast_1_zeros_calib`}
              label='Калибровка нуля'
              clickHandler={handleClick_calib_ballast_zeros}
              type="button" />
          }
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data?.ballast_1}
          </span>
          <input
            id={'ballast_1_calib_input'}
            name={'ballast_1_calib'}
            className={`${
              wattageAdditionalCalibState.ballast_1_avaliable ? '' : 'disabled_input'}`}
            type="text"
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            onChange={handleChange}
            value={wattageAdditionalCalibState.ballast_1}
            placeholder={'X.XX кВт'}
          />
          <input
            id={`ballast_1_calib_save`}
            name={`ballast_1_calib`}
            className={`button_input ${
              wattageAdditionalCalibState.ballast_1_avaliable ? '' : 'disabled_input'}`}
            type="button"
            value={'Сохранить'}
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            onClick={handleClick_ballast} />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default WattageAdditionalCalibSettings_ST
