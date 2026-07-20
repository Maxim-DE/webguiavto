import React from 'react'
import FormInput from '../../form_input';
import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import SettingsBlockWrap from '../../settings_block_wrap';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';
import { isInNumRange } from '../../../logic/validation/validators';

export default function SlaveGeneralCalib_AVR({ calib_state, clickHandler, ...props }) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    frequency: 0,
    input_signal_type: 0,
    turn_on_timeout: 0
  })

  const { isFormValid, validStatus_getter } = useFormValidation()

  const state_prev_copy = React.useRef(null)

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
          calib_state_copy[key].replace(',', '.')
        } else {
          calib_state_copy[key] = calib_state[key]
        }
      }

      setGeneralCalibState(calib_state_copy)

      state_prev_copy.current = calib_state_copy
    }

  }, [calib_state])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setGeneralCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

 const handleClick_save = (fieldName, event) => {
  // Получаем текущее значение поля
  const currentValue = generalCalibState[fieldName];
  
  // Преобразуем значение в нужный формат
  let formattedValue = currentValue;
  if (calib_state != undefined && calib_state[fieldName] != undefined) {
    if (Array.isArray(calib_state[fieldName])) {
      if (typeof calib_state[fieldName][1] == 'number' &&
          calib_state[fieldName][1] > 0) {
        const converted_val = isNaN(parseFloat(currentValue)) ?
                              1 :
                              parseFloat(currentValue).toFixed(Math.log10(calib_state[fieldName][1]));
        formattedValue = converted_val * calib_state[fieldName][1];
      }
    } else {
      formattedValue = typeof currentValue == "boolean" ? Number(currentValue) : currentValue;
    }
  } else {
    formattedValue = typeof currentValue == "boolean" ? Number(currentValue) : currentValue;
  }
  
  // Формируем строку запроса всегда с текущим значением
  const req_data_str = `${fieldName}$${formattedValue}`;

  const request_obj = {
    address: 'calib_signal.cgi',
    data: req_data_str,
    reducer: reducers.calibration_form,
    update_data: { [fieldName]: currentValue },
    notifications: {
      good: 'default',
      bad: 'default'
    },
    save_data: {
      slave_general: { [fieldName]: currentValue }
    }
  }

  clickHandler(request_obj);
}

  return (
    <SettingsBlockWrap 
      header={`общие настройки сар`}
      settings_type={`slave_general`}>
      <li
        key='frequency_calib'
        id='frequency_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`frequency_calib_input`}
            className="settings_itemLabel">
            Установка нес. частоты, МГц
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`frequency_calib_input`}
            name={`frequency_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.frequency}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text"
            validators={[
              isInNumRange(87.5, 108)
            ]}
            formValidHandler={validStatus_getter} />
          <FormInput
            id={`frequency_calib_save`}
            name={`frequency_calib`}
            clickHandler={(event) => handleClick_save('frequency', event)}
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
              'КСС',
              'AES'
            ]}
            changeHandler={handleChange} />
          <FormInput
            id={`input_signal_type_calib_save`}
            name={`input_signal_type_calib`}
            clickHandler={(event) => handleClick_save('input_signal_type', event)}
            label='Сохранить'
            type='button' />
        </div>
      </li>      
      <li
        key='turn_on_timeout_calib'
        id='turn_on_timeout_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`turn_on_timeout_calib_input`}
            className="settings_itemLabel">
            Время вкл. уст-ва в сеть, сек
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`turn_on_timeout_calib_input`}
            name={`turn_on_timeout_calib`}
            changeHandler={handleChange}
            placeholder='мсек'
            input_value={generalCalibState.turn_on_timeout}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`turn_on_timeout_save`}
            name={`turn_on_timeout`}
            clickHandler={(event) => handleClick_save('turn_on_timeout', event)}
            label='Сохранить'
            type='button' />
        </div>
      </li>
    </SettingsBlockWrap>
  )
}