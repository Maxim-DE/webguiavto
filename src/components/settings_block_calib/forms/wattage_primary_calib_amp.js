import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function PowerCalibSettings_AMP(props) {
  const calibPower_store = useSelector((store) => {
      if (deepKeyExists(store, 'calib_power')) {
        return store.globalStore.global_data.calib_state.data.calib_power
      } else return ''
    }),
    info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info),
    adcPower_store = useSelector((store) => {
      if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'power_calib')) {
        return store.globalStore.global_data.status_data.calib_adc?.power_calib
      } else return ''
    })

  const [powerCalibState, setPowerCalibState] = React.useState({
    dac_value: '',
    output_power: '',
    output_power_threshold: '',
    coupling_coeff: '',
    diss_power_threshold: ''
  })

  const device_type = info_section_data?.info_general?.model !== undefined ? info_section_data.info_general.model : 0

  React.useEffect(() => {
    if (!calibPower_store) return

    if (Object.keys(calibPower_store).length != 0) {
      let calib_state_copy = {}

      for (const key in calibPower_store) {
        const divident = calibPower_store[key][0],
          divider = calibPower_store[key][1] == 0 ? 1 : calibPower_store[key][1],
          digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setPowerCalibState(calib_state_copy)
    }
  }, [calibPower_store])

  const handleChange = (event) => {
    const target = event.target;
    let value = target.type == 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '');

    // Валидация для output_power_threshold: только цифры и диапазон 0-4095
    if (name === 'output_power_threshold') {
      // Разрешаем пустое значение
      if (value === '') {
        setPowerCalibState(prevState => ({
          ...prevState,
          [name]: value
        }));
        return;
      }

      // Удаляем все символы, кроме цифр
      value = value.replace(/[^\d]/g, '');

      // Преобразуем в число
      let num = parseInt(value, 10);

      // Проверяем, что получилось число
      if (!isNaN(num)) {
        // Ограничиваем диапазон от 0 до 4095
        num = Math.min(Math.max(num, 0), 4095);
        value = num.toString();
      } else {
        value = '0';
      }
    }

    setPowerCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = powerCalibState[name],
      multipier = calibPower_store ? calibPower_store[name][1] : 10

    let state_obj = { [name]: value },
      converted_state = calib_state_conversion(state_obj, calibPower_store)

    const request_obj = {
      address: 'calib_power.cgi',
      data: `${name}$${value * multipier}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_power: converted_state
      }
    }

    props.clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {

    const request_obj = {
      address: 'calib_output_power_zeros.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);

  }

  const handleClick_powerThresholdStep = () => {
    const request_obj = {
      address: 'calib_power.cgi',
      data: `output_power_threshold_step$1`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib
      header={`калибровка мощности`}
      settings_type={`power_calib`}
      save_handler={handleClick_save}>
      <li
        key='output_power_calib'
        id='output_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`output_power_calib_input`}
            className="settings_itemLabel">
            Калибровка вых. мощности
          </label>
          <FormInput
            id={`output_power_zero_calib_input`}
            name={`output_power_zero_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcPower_store?.output_power}
          </span>
          <FormInput
            id={`output_power_calib_input`}
            name={`output_power_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.output_power}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`output_power_calib_save`}
            name={`output_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        {/* </div> */}
      {/* </li>
      <li
        key='refected_power_calib'
        id='refected_power_calib'
        className="settings_item"> */}
        {/* <div className='item_header'> */}
          <label
            htmlFor={`refected_power_calib_input`}
            className="settings_itemLabel"
            style={{ fontWeight: '400' }}>
            АЦП <sub>отр. мощ.</sub>: {adcPower_store?.refected_power}
          </label>
        </div>
      </li>
      {device_type < 3 &&
        <>
          <li className="group_divider"></li>
          <li
            key='output_power_threshold_step_calib'
            id='output_power_threshold_step_calib'
            className="settings_item">
            <div className='item_header'>
              <label
                htmlFor={`output_power_threshold_step_calib_input`}
                className="settings_itemLabel">
                Ограничение P<sub>вых</sub> по шагам
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`output_power_threshold_step_calib_save`}
                name={`output_power_threshold_step_calib`}
                clickHandler={handleClick_powerThresholdStep}
                label='Установить'
                type="button" />
            </div>
          </li>
          <li
            key='output_power_threshold_calib'
            id='output_power_threshold_calib'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`output_power_threshold_calib_input`}
                className="settings_itemLabel">
                Ограничение P<sub>вых</sub> по мощности
              </label>
            </div>
            <div className='item_input'>
              <span className='item_adc_value'>
                ЦАП: {adcPower_store?.output_power_threshold}
              </span>
              <FormInput
                type="button_arrow"
                direction="down"
                label='▼'
                name={`output_power_threshold_calib_down`}
                clickHandler={() => {
                  let currentValue = parseInt(powerCalibState.output_power_threshold) || 0;
                  let newValue = Math.max(currentValue - 10, 0);
                  setPowerCalibState(prev => ({
                    ...prev,
                    output_power_threshold: newValue.toString()
                  }));
                }}
              />
              <FormInput
                id={`output_power_threshold_calib_input`}
                name={`output_power_threshold_calib`}
                changeHandler={handleChange}
                input_value={powerCalibState.output_power_threshold}
                style={{ margin: '0', maxWidth: '57px', textAlign: 'center' }}
                type="text"
                max_length={4}
              />
              <FormInput
                type="button_arrow"
                direction="up"
                label='▲'
                name={`output_power_threshold_calib_up`}
                clickHandler={() => {
                  let currentValue = parseInt(powerCalibState.output_power_threshold) || 0;
                  let newValue = Math.min(currentValue + 10, 4095);
                  setPowerCalibState(prev => ({
                    ...prev,
                    output_power_threshold: newValue.toString()
                  }));
                }}
              />
              <FormInput
                id={`output_power_threshold_calib_save`}
                name={`output_power_threshold_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </div>
          </li>
        </>
      }
      <li className="group_divider"></li>
      <li
        key='сoupling_coeff_calib'
        id='сoupling_coeff_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`сoupling_coeff_calib_input`}
            className="settings_itemLabel">
            Коэфициент связи P<sub>отр</sub>
          </label>
        </div>
        <div className='item_input'>
          <span
            className='item_adc_value'
            title='АЦП(отр) -x%*АЦП(вых)'>
            АЦП<sub>отр. после комп.</sub>: {adcPower_store?.coupling_coeff}
          </span>
          <FormInput
            id={`сoupling_coeff_calib_input`}
            name={`coupling_coeff_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.coupling_coeff}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`сoupling_coeff_calib_save`}
            name={`coupling_coeff_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='diss_power_threshold_calib'
        id='diss_power_threshold_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`diss_power_threshold_calib_input`}
            className="settings_itemLabel">
            Макс. рассеиваемая мощность
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`diss_power_threshold_calib_input`}
            name={`diss_power_threshold_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.diss_power_threshold}
            style={{ margin: '0', maxWidth: '57px' }}
            placeholder='Вт'
            type="text" />
          <FormInput
            id={`diss_power_threshold_calib_save`}
            name={`diss_power_threshold_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default PowerCalibSettings_AMP