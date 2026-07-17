import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

import cloneDeep from 'lodash/cloneDeep';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { deepKeyExists, filter_obj } from '../../../logic/utilites';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

function WattageAdditionalCalibSettings_BC(props) {
  const calibWattageAdditional_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_additional_power')) {
      return store.globalStore.global_data.calib_state.data?.calib_additional_power
    } else return ''
  }),
    adcVoltage_store = useSelector((store) => {
      if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'power_additional_calib')) {
        return store.globalStore.global_data.status_data.calib_adc?.power_additional_calib
      } else return ''
    }),
        auth_store = useSelector((store) => store.authStore.auth_data)

  const [wattageAdditionalCalibState, setWattageAdditionalCalibState] = React.useState({
    input_power: '',
    ballast_1_avaliable: 0,
    ballast_1: '',
    ballast_1_threshold_low: '',
    ballast_1_threshold_high: '',
    ballast_1_Limit: ''  // Добавлено новое поле
  })

  // store.globalStore.global_data.calib_state.data.calib_additional_power

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (calibWattageAdditional_store != undefined && 
        Object.keys(calibWattageAdditional_store).length != 0) {
      let calib_state_copy = cloneDeep(wattageAdditionalCalibState)

      for (const key in calibWattageAdditional_store) {
        if (Array.isArray(calibWattageAdditional_store[key])) {
          const divident = calibWattageAdditional_store[key][0],
                divider = calibWattageAdditional_store[key][1] == 0 ? 1 : calibWattageAdditional_store[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calibWattageAdditional_store[key]
        }
      }

      setWattageAdditionalCalibState(calib_state_copy)
    }

  }, [calibWattageAdditional_store])

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
          multipier = calibWattageAdditional_store?.[name] ? calibWattageAdditional_store[name][1] : 10

    const converted_state = {
      [name]: [
        value * multipier,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_input_power.cgi',
      data: `${name}$${value * multipier}`,
      reducer: reducers.calibration_form,
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
          multipier = calibWattageAdditional_store?.[name] ? calibWattageAdditional_store[name][1] : 10

    const converted_state = {
      [name]: [
        value * multipier,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value * multipier}`,
      reducer: reducers.calibration_form,
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

  // Новый обработчик для сохранения коррекции АЧХ балласта
  const handleClick_ballast_limit = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = wattageAdditionalCalibState[name],
          multipier = calibWattageAdditional_store?.[name] ? calibWattageAdditional_store[name][1] : 10

    const converted_state = {
      [name]: [
        value * multipier,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value * multipier}`,
      reducer: reducers.calibration_form,
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
      reducer: reducers.calibration_form,
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

  const handleClick_threshold_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          threshold_data = filter_obj(wattageAdditionalCalibState, (key, value) => key.includes(name))

    let data_string = '',
        save_obj = {}

    for (const key in threshold_data) {
      const multipier = calibWattageAdditional_store?.[key] ? calibWattageAdditional_store[key][1] : 10,
            value = wattageAdditionalCalibState[key] * multipier

      data_string += `${key}$${value};`
      save_obj[key] = [
        value,
        multipier
      ]
    }

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: data_string,
      reducer: reducers.calibration_form,
      update_data: wattageAdditionalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_additional_power: save_obj
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
      {/* <li
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
            АЦП: {adcVoltage_store.input_power}
          </span>
          <FormInput
            id={`input_power_calib_input`}
            name={`input_power_calib`}
            class="calib_input"
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
      <li className="group_divider" /> */}
      <li
        key='ballast_1_calib'
        id='ballast_1_calib'
        className="settings_item calib">
        <div className='item_header'>
          {auth_store.auth_access.calib_extend &&
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
            Балласт 1, Вт
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
            АЦП: {adcVoltage_store?.ballast_1}
          </span>
          <FormInput
            id={'ballast_1_calib_input'}
            name={'ballast_1_calib'}
            class={`calib_input`}
            type="text"
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            changeHandler={handleChange}
            input_value={wattageAdditionalCalibState.ballast_1}
            placeholder={'X.XX кВт'}
          />
          <FormInput
            id={`ballast_1_calib_save`}
            name={`ballast_1_calib`}
            type="button"
            label='Сохранить'
            value={'Сохранить'}
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            clickHandler={handleClick_ballast} />
        </div>
      </li>
      <li
      key='I3_threshold'
      id='I3_threshold'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`I3_threshold_input`}
          className="settings_itemLabel">
          Порог балласта 1, Вт
        </label>
      </div>
      <div className='item_input'>
        {/* <span className='item_adc_value'>
          АЦП: {adcVoltage_store.ballast_1_threshold}
        </span> */}
        <div
          className="text_range_container"
          id={`ballast_1_threshold_low_input`}
          name={`ballast_1_threshold_low`}>
          от
          <FormInput
            type="text"
            class={`text_range`}
            name={`ballast_1_threshold_low`}
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            input_value={wattageAdditionalCalibState.ballast_1_threshold_low}
            changeHandler={handleChange}
          />
          <span>до</span>
          <FormInput
            type="text"
            class={`text_range`}
            name={`ballast_1_threshold_high`}
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            input_value={wattageAdditionalCalibState.ballast_1_threshold_high}
            changeHandler={handleChange}
          />
        </div>
        <FormInput
          id={`ballast_1_threshold_save_calib`}
          name={`ballast_1_threshold_calib`}
          type="button"
          label='Сохранить'
          value={'Сохранить'}
          disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
          clickHandler={handleClick_threshold_save} />
      </div>
    </li>
      <li
        key='ballast_1_Limit_calib'
        id='ballast_1_Limit_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`ballast_1_Limit_calib_input`}
            className="settings_itemLabel">
            Порог регулировки балласта
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={'ballast_1_Limit_calib_input'}
            name={'ballast_1_Limit_calib'}
            class={`calib_input`}
            type="text"
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            changeHandler={handleChange}
            input_value={wattageAdditionalCalibState.ballast_1_Limit}
          />
          <FormInput
            id={`ballast_1_Limit_calib_save`}
            name={`ballast_1_Limit_calib`}
            type="button"
            label='Сохранить'
            value={'Сохранить'}
            disabled={!wattageAdditionalCalibState.ballast_1_avaliable}
            clickHandler={handleClick_ballast_limit} />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default WattageAdditionalCalibSettings_BC