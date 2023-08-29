import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import cloneDeep from 'lodash/cloneDeep';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import useGlobalStore from '../../../logic/auth_store';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

function ConsoleOutputCalibSettings(props) {
  const calibConsoleOutput_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_console_output)

  const [consoleOutputCalibState, setConsoleOutputCalibState] = React.useState({
    console_output_switch: 1,
    ip_address: '',
    output_type: 0,
    out_port: '',
    in_port: '',
    err_port: ''
  })

  const [authGlobalState, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!calibConsoleOutput_store) {
      return
    } 

    if (Object.keys(calibConsoleOutput_store).length != 0) {
      let calib_state_copy = cloneDeep(consoleOutputCalibState)

      for (const key in calibConsoleOutput_store) {
        if (Array.isArray(calibConsoleOutput_store[key])) {
          const divident = calibConsoleOutput_store[key][0],
            divider = calibConsoleOutput_store[key][1] == 0 ? 1 : calibConsoleOutput_store[key][1],
            digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calibConsoleOutput_store[key]
        }
      }

      setConsoleOutputCalibState(calib_state_copy)

    }
  }, [calibConsoleOutput_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '')

    setConsoleOutputCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    // console.log(consoleOutputCalibState);
    const target = event.target,
          name = target.name

    let value, state_to_save

    if (Array.isArray(calibConsoleOutput_store[name])) {
      value = consoleOutputCalibState[name] * 10
      let state_obj = { [name]: value }
      state_to_save = calib_state_conversion(state_obj, calibConsoleOutput_store)
    } else {
      value = consoleOutputCalibState[name]
      state_to_save = { [name]: value }
    }


    const request_obj = {
      address: 'calib_console_output.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      save_data: {
        calib_console_output: state_to_save
      }
    }

    props.clickHandler(request_obj);

  }

  const handleChange_save = (event) => {
    const target = event.target,
          name = target.name

    let value, state_to_save
      
    if (Array.isArray(calibConsoleOutput_store[name])) {
      value = consoleOutputCalibState[name] * 10
      let state_obj = { [name]: value }
      state_to_save = calib_state_conversion(state_obj, calibConsoleOutput_store)
    } else {
      value = target.type === 'checkbox' ? target.checked : consoleOutputCalibState[name] * 10
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_fan.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      save_data: {
        calib_console_output: {
          [name]: value
        }
      }
    }

    props.clickHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`вывод в консоль`}
      settings_type={`console_output_calib`}
      save_handler={handleClick_save}>
        <li
          key='console_output_switch'
          id='console_output_switch'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`console_output_switch_input`}
              className="settings_itemLabel">
              Вывод данных в консоль
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`console_output_switch_input`}
              name={`console_output_switch`}
              changeHandler={(e) => {
                handleChange(e);
                handleClick_save(e)
              }}
              input_value={!!consoleOutputCalibState.console_output_switch}
              type="switch" />
          </div>
        </li>
        {!!consoleOutputCalibState.console_output_switch &&
         <>
          <li
            key='ip_address'
            id='ip_address'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`ip_address_input`}
                className="settings_itemLabel">
                IP-адрес
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`ip_address_input`}
                name={`ip_address`}
                class="calib_input"
                changeHandler={handleChange}
                input_value={consoleOutputCalibState.ip_address}
                type="text" />
              <FormInput
                id={`ip_address_save`}
                name={`ip_address`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </div>
          </li>
          <li
            key='output_type'
            id='output_type'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`output_type_input`}
                className="settings_itemLabel">
                Тип вывода
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`output_type_input`}
                name={`output_type`}
                changeHandler={handleChange}
                input_value={consoleOutputCalibState.output_type}
                type="select"
                variants={[
                  'Вход',
                  'Выход',
                  'Ошибка'
                ]} />
              <FormInput
                id={`output_type_save`}
                name={`output_type`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </div>
          </li>
          
          <li
            key='out_port'
            id='out_port'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`out_port_input`}
                className="settings_itemLabel">
                Порт вывода (выход)
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`out_port_input`}
                name={`out_port`}
                changeHandler={handleChange}
                class="calib_input"
                input_value={consoleOutputCalibState.out_port}
                type="text" />
              <FormInput
                id={`out_port_save`}
                name={`out_port`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </div>
          </li>
          <li
            key='in_port'
            id='in_port'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`in_port_input`}
                className="settings_itemLabel">
                Порт вывода (вход)
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`in_port_input`}
                name={`in_port`}
                class="calib_input"
                changeHandler={handleChange}
                input_value={consoleOutputCalibState.in_port}
                type="text" />
              <FormInput
                id={`in_port_save`}
                name={`in_port`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </div>
          </li>
          <li
            key='err_port'
            id='err_port'
            className="settings_item calib">
            <div className='item_header'>
              <label
                htmlFor={`err_port_input`}
                className="settings_itemLabel">
                Порт вывода (ошибка)
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`err_port_input`}
                name={`err_port`}
                class="calib_input"
                changeHandler={handleChange}
                input_value={consoleOutputCalibState.err_port}
                type="text" />
              <FormInput
                id={`err_port_save`}
                name={`err_port`}
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

export default ConsoleOutputCalibSettings