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

  // Refs для управления интервалами автоповтора
  const incrementIntervalRef = React.useRef(null);
  const decrementIntervalRef = React.useRef(null);
  const incrementTimeoutRef = React.useRef(null);
  const decrementTimeoutRef = React.useRef(null);

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

  // Очистка интервалов при размонтировании
  React.useEffect(() => {
    return () => {
      if (incrementIntervalRef.current) clearInterval(incrementIntervalRef.current);
      if (decrementIntervalRef.current) clearInterval(decrementIntervalRef.current);
      if (incrementTimeoutRef.current) clearTimeout(incrementTimeoutRef.current);
      if (decrementTimeoutRef.current) clearTimeout(decrementTimeoutRef.current);
    };
  }, []);

  const handleChange = (event) => {
    const target = event.target;
    let value = target.type == 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '');

    // Валидация для dac_admin_value: только цифры и диапазон 0-4095
    if (name === 'dac_admin_value') {
      value = value.replace(/[^\d]/g, '');
      let num = parseInt(value, 10);
      if (!isNaN(num)) {
        num = Math.min(Math.max(num, 0), 4095);
        value = num.toString();
      }
    }

    setVoltageCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // Функция увеличения значения на 10
  const incrementByTen = () => {
    setVoltageCalibState(prevState => {
      const currentValue = parseInt(prevState.dac_admin_value, 10) || 0;
      const newValue = Math.min(currentValue + 10, 4095);
      return {
        ...prevState,
        dac_admin_value: newValue.toString()
      };
    });
  };

  // Функция уменьшения значения на 10
  const decrementByTen = () => {
    setVoltageCalibState(prevState => {
      const currentValue = parseInt(prevState.dac_admin_value, 10) || 0;
      const newValue = Math.max(currentValue - 10, 0);
      return {
        ...prevState,
        dac_admin_value: newValue.toString()
      };
    });
  };

  // Обработчик начала зажатия кнопки увеличения
  const startIncrement = () => {
    // Первое мгновенное изменение
    incrementByTen();
    
    // Таймаут перед началом автоповтора (500ms)
    incrementTimeoutRef.current = setTimeout(() => {
      // Запускаем интервал с частотой ~10 раз в секунду
      incrementIntervalRef.current = setInterval(() => {
        incrementByTen();
      }, 100);
    }, 500);
  };

  // Обработчик начала зажатия кнопки уменьшения
  const startDecrement = () => {
    // Первое мгновенное изменение
    decrementByTen();
    
    // Таймаут перед началом автоповтора (500ms)
    decrementTimeoutRef.current = setTimeout(() => {
      // Запускаем интервал с частотой ~10 раз в секунду
      decrementIntervalRef.current = setInterval(() => {
        decrementByTen();
      }, 100);
    }, 500);
  };

  // Обработчик отпускания кнопок (останавливает все)
  const stopChange = () => {
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
    if (incrementTimeoutRef.current) {
      clearTimeout(incrementTimeoutRef.current);
      incrementTimeoutRef.current = null;
    }
    if (decrementTimeoutRef.current) {
      clearTimeout(decrementTimeoutRef.current);
      decrementTimeoutRef.current = null;
    }
  };

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

  // Стили для кнопок +10/-10
  const buttonStyle = {
    width: '24px',
    height: '24px',
    background: '#e0e7eb',
    color: '#2F323A',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    userSelect: 'none',
    transition: 'background 0.1s'
  };

  // const buttonHoverStyle = {
  //   ...buttonStyle,
  //   background: '#2b2be6'
  // };

  // const buttonActiveStyle = {
  //   ...buttonStyle,
  //   background: '#2929cc'
  // };

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
                <span className='item_adc_value'>
                  ЦАП<sub>БП</sub>: {adcVoltage_store?.dac}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onMouseDown={startDecrement}
                    onMouseUp={stopChange}
                    onMouseLeave={stopChange}
                    onTouchStart={startDecrement}
                    onTouchEnd={stopChange}
                    style={buttonStyle}
                    title="Уменьшить на 10 (зажмите для ускорения)"
                  >
                    ▼
                  </button>
                  <FormInput
                    type="text"
                    id={`dac_admin_value_calib_input`}
                    name={`dac_admin_value_calib`}
                    class="text_range"
                    style={{ margin: '0', maxWidth: '60px', textAlign: 'center' }}
                    max_length={4}
                    input_value={voltageCalibState.dac_admin_value}
                    changeHandler={handleChange}
                  />
                  <button
                    type="button"
                    onMouseDown={startIncrement}
                    onMouseUp={stopChange}
                    onMouseLeave={stopChange}
                    onTouchStart={startIncrement}
                    onTouchEnd={stopChange}
                    style={buttonStyle}
                    title="Увеличить на 10 (зажмите для ускорения)"
                  >
                    ▲
                  </button>
                </div>
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
    </Settings_block_calib>
  )
}

export default VoltageCalibSettings_URE