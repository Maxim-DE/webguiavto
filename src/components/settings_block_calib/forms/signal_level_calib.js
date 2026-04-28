import React from 'react';
import { useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';

import Settings_block_calib from '..';
import FormInput from '../../form_input';
import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/avr_control_reducers';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';
import { maxLength, required } from '../../../logic/validation/validators';

export default function SignalCalibSettings({ 
  calib_state, 
  adc_store, 
  active_device, 
  is_res_ex_available, 
  clickHandler, 
  ...props 
}) {
  // Состояние калибровки сигнала
  const [signalCalibState, setSignalCalibState] = React.useState({
    signal_type: 0,
    signal_type_res: 0,
    signal_0_value: 0,
    signal_1_value: 1,
    signal_2_value: 2,
  });

  const { isFormValid, validStatus_getter, validInputList } = useFormValidation();

  // Загрузка и преобразование калибровочных данных
  React.useEffect(() => {
    if (!calib_state) return;

    if (Object.keys(calib_state).length !== 0) {
      let calib_state_copy = cloneDeep(signalCalibState);

      for (const key in calib_state) {
        if (Array.isArray(calib_state[key])) {
          const divident = calib_state[key][0];
          const divider = calib_state[key][1] === 0 ? 1 : calib_state[key][1];
          const digits = Math.log10(divider);
          calib_state_copy[key] = (divident / divider).toFixed(digits);
        } else {
          calib_state_copy[key] = calib_state[key];
        }
      }

      setSignalCalibState(calib_state_copy);
    }
  }, [calib_state]);

  // Обработчик изменения полей ввода
  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '');

    setSignalCalibState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Сохранение калибровочных значений
  const handleClick_save = (event) => {
    const target = event.target;
    const name = target.name.replace('_calib', '');

    let value, state_to_save;

    if (calib_state !== undefined && calib_state[name] !== undefined) {
      if (Array.isArray(calib_state[name])) {
        if (typeof calib_state[name][1] === 'number' && calib_state[name][1] > 0) {
          value = signalCalibState[name] * calib_state[name][1];
        } else {
          value = signalCalibState[name];
        }
        let state_obj = { [name]: value };
        state_to_save = calib_state_conversion(state_obj, calib_state);
      } else {
        value = signalCalibState[name];
        state_to_save = { [name]: value };
      }
    } else {
      value = signalCalibState[name];
      state_to_save = { [name]: value };
    }

    const request_obj = {
      address: 'calib_signal.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      update_data: signalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_signal: state_to_save
      }
    };

    clickHandler(request_obj);
  };

  // Калибровка выбранного канала
  const handleClick_calib = (event) => {
    let data_str = '';
    if (signalCalibState.signal_type === 0) {
      data_str = 'signal_0_value$0;signal_1_value$0';
    } else {
      data_str = `signal_${signalCalibState.signal_type - 1}_value$0`;
    }

    const request_obj = {
      address: 'calib_signal.cgi',
      data: data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    };

    clickHandler(request_obj);
  };

  // Калибровка резервного канала
  const handleClick_calib_res = (event) => {
    let data_str = '';
    if (signalCalibState.signal_type_res === 0) {
      data_str = 'signal_0_value$0;signal_1_value$0';
    } else {
      data_str = `signal_${signalCalibState.signal_type_res - 1}_value$0`;
    }

    const request_obj = {
      address: 'calib_signal_res.cgi',
      data: data_str,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    };

    clickHandler(request_obj);
  };

  // Калибровка нулей всех каналов
  const handleClick_calib_zeros = (event) => {
    const request_obj = {
      address: 'calib_signal_zero.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    };

    clickHandler(request_obj);
  };

  // Калибровка нулей резервных каналов
  const handleClick_calib_zeros_res = (event) => {
    const request_obj = {
      address: 'calib_signal_zero_res.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    };

    clickHandler(request_obj);
  };

  // Проверка наличия активного устройства и резерва
  if (active_device === 0 && is_res_ex_available === 0) {
    return null;
  }

  return (
    <Settings_block_calib 
      header="калибровка уровня звука"
      settings_type="signal_level_calib"
      section_name={props.section_name}
    >
      {/* Калибровка нулей всех каналов */}
      <li
        key="signal_zero_calib"
        id="signal_zero_calib"
        className="settings_item"
      >
        <div className="item_header">
          <label className="settings_itemLabel">
            Калибровка нулей всех каналов
          </label>
        </div>
        <div className="item_input">
          <FormInput
            id="signal_zero_all_calib_input"
            name="signal_zero_calib"
            label="Калибровать"
            clickHandler={handleClick_calib_zeros}
            type="button"
          />
        </div>
      </li>
      
      <li className="group_divider"></li>

      {/* Основная калибровка уровня звука */}
      <li
        key="signal_type_level_calib"
        id="signal_type_level_calib"
        className="settings_item calib"
      >
        <div className="item_header">
          <label className="settings_itemLabel">
            Калибровка уровня звука
          </label>
          <FormInput
            id="signal_type_calib_input"
            name="signal_type_calib"
            type="select"
            input_value={signalCalibState.signal_type}
            title="Тип устройства"
            variants={['Stereo', 'L', 'R', 'КСС']}
            changeHandler={handleChange}
          />
        </div>
        <div className="item_input">
          {/* Отображение значений АЦП для стерео/моно */}
          {signalCalibState.signal_type < 3 && (
            <>
              <span className="item_adc_value">
                АЦП<sub>L</sub>: {adc_store?.l_signal}
              </span>
              <span className="item_adc_value">
                АЦП<sub>R</sub>: {adc_store?.r_signal}
              </span>
              <div className="vertical_li_divider"></div>
            </>
          )}
          
          {/* Отображение АЦП для КСС */}
          {signalCalibState.signal_type === 3 && (
            <>
              <span className="item_adc_value">
                АЦП<sub>КСС</sub>: {adc_store?.swr_signal}
              </span>
              <div className="vertical_li_divider"></div>
            </>
          )}
          
          {/* Отображение АЦП для AES */}
          {signalCalibState.signal_type === 4 && (
            <>
              <span className="item_adc_value">
                АЦП<sub>AES</sub>: {adc_store?.aes_signal}
              </span>
              <div className="vertical_li_divider"></div>
            </>
          )}
          
          <FormInput
            id="signal_type_level_calib_input"
            name={`signal_${signalCalibState.signal_type}_zero_calib`}
            label="Калибровать"
            clickHandler={handleClick_calib}
            type="button"
          />
        </div>
      </li>
      
      <li className="group_divider"></li>
      
      {/* Калибровка резервного канала (если доступен) */}
      {active_device !== 0 && (
        <>
          <li
            key="signal_type_level_calib_res"
            id="signal_type_level_calib_res"
            className="settings_item calib"
          >
            <div className="item_header">
              <label className="settings_itemLabel">
                Калибровка уровня звука (резерв)
              </label>
              <FormInput
                id="signal_type_res_calib_input"
                name="signal_type_res_calib"
                type="select"
                input_value={signalCalibState.signal_type_res}
                title="Тип устройства"
                variants={['Stereo', 'L', 'R', 'КСС', 'AES']}
                changeHandler={handleChange}
              />
            </div>
            <div className="item_input">
              {/* Отображение АЦП резервных каналов */}
              {signalCalibState.signal_type_res < 3 && (
                <>
                  <span className="item_adc_value">
                    АЦП<sub>L</sub>: {adc_store?.l_res_signal}
                  </span>
                  <span className="item_adc_value">
                    АЦП<sub>R</sub>: {adc_store?.r_res_signal}
                  </span>
                  <div className="vertical_li_divider"></div>
                </>
              )}
              
              {signalCalibState.signal_type_res === 3 && (
                <>
                  <span className="item_adc_value">
                    АЦП<sub>КСС</sub>: {adc_store?.swr_res_signal}
                  </span>
                  <div className="vertical_li_divider"></div>
                </>
              )}
              
              {signalCalibState.signal_type_res === 4 && (
                <>
                  <span className="item_adc_value">
                    АЦП<sub>AES</sub>: {adc_store?.aes_res_signal}
                  </span>
                  <div className="vertical_li_divider"></div>
                </>
              )}
              
              <FormInput
                id="signal_zero_res_calib_input"
                name={`signal_${signalCalibState.signal_type}_zero_res_calib`}
                label="Калибровать"
                clickHandler={handleClick_calib_res}
                type="button"
              />
            </div>
          </li>
        </>
      )}
    </Settings_block_calib>
  );
}