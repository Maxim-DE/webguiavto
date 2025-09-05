import React from 'react'

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import SettingsBlockWrap from '../../settings_block_wrap';
import { diff } from 'deep-object-diff';
import { dataArray_to_string } from '../../../logic/request_logic';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';
import { isInNumRange } from '../../../logic/validation/validators';

export default function SlaveGeneralCalib_AVR({ calib_state, clickHandler, ...props }) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    frequency: 0,
    input_power: 0,
    input_signal_type: 0,
    channel_coef_type: 2,
    coef_l: 0,
    coef_r: 0,
    coef_mpx: 0,
    coef_aes: 0,
    resistance_type: 0,
    deviation: 0,
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
        } else {
          calib_state_copy[key] = calib_state[key]
        }
      }

      setGeneralCalibState(calib_state_copy)

      state_prev_copy.current = calib_state_copy
    }

  }, [calib_state])

  React.useEffect(() => {
    props.rdsHandler(generalCalibState.rds_enable)
  }, [generalCalibState.rds_enable])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setGeneralCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const state_diff = diff(state_prev_copy.current, generalCalibState),
          req_data_str = dataArray_to_string(state_diff, (value, key) => {
            if (calib_state != undefined && calib_state[key] != undefined) {
              if (Array.isArray(calib_state[key])) {
                if (typeof calib_state[key][1] == 'number' &&
                    calib_state[key][1] > 0)
                return value * calib_state[key][1]
      } else {
                return typeof value == "boolean" ? Number(value) : value;
      }
    } else {
              return typeof value == "boolean" ? Number(value) : value;
    }
          })

    const request_obj = {
      address: 'calib_signal.cgi',
      data: req_data_str,
      reducer: reducers.calibration_form,
      update_data: generalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        slave_general: state_diff
      }
    }

    clickHandler(request_obj);

  }

  return (
    <SettingsBlockWrap 
      header={`общие настройки`}
      settings_type={`slave_general`}
      section_name={props.section_name}
      save_handler={handleClick_save}
      disable_save={!isFormValid} >
      <li
        key='frequency_calib'
        id='frequency_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`frequency_calib_input`}
            className="settings_itemLabel">
            Установка нес. частоты
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
          {/* <FormInput
            id={`frequency_calib_save`}
            name={`frequency_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' /> */}
        </div>
      </li>
      <li
        key='input_power_calib'
        id='input_power_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`input_pwr_calib_input`}
            className="settings_itemLabel">
            Выходная мощность
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`input_power_calib_input`}
            name={`input_power_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.input_power}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='Вт'
            type="text" />
          {/* <FormInput
            id={`input_power_calib_save`}
            name={`input_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
          type='button' /> */}
        </div>
      </li>
      <li className="group_divider"></li>
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
          {/* <FormInput
            id={`input_signal_type_calib_save`}
            name={`input_signal_type_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' /> */}
        </div>
      </li>
      <li
        key='channel_coef_calib'
        id='channel_coef_calib'
        className={`settings_item ${generalCalibState.input_signal_type == 0 && 'calib'}`}>
        <div className='item_header'>
          <label
            htmlFor={`channel_coef_type_calib_input`}
            className="settings_itemLabel">
            Коэффициент передачи
          </label>
          {/* <FormInput
            id={`channel_coef_type_calib_input`}
            name={`channel_coef_type_calib`}
            type='select'
            input_value={generalCalibState.channel_coef_type}
            title='Канал'
            variants={[
              'Stereo',
              'L',
              'R',
              'КСС'
            ]}
            changeHandler={handleChange} /> */}
        </div>
        <div className='item_input'>
          {generalCalibState.input_signal_type == 1 &&
            <>
              
              <FormInput
                id={`coef_l_calib_input`}
                name={`coef_l`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_l}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              {/* <FormInput
                id={`coef_l_calib_save`}
                name={`coef_l_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" /> */}
            </>
          }
          {generalCalibState.input_signal_type == 2 &&
            <>
              <FormInput
                id={`coef_r_calib_input`}
                name={`coef_r`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_r}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              {/* <FormInput
                id={`coef_r_calib_save`}
                name={`coef_r_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" /> */}
            </>
          }
          {generalCalibState.input_signal_type == 3 &&
            <>
              <FormInput
                id={`coef_mpx_calib_input`}
                name={`coef_mpx`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_mpx}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              {/* <FormInput
                id={`coef_mpx_calib_save`}
                name={`coef_mpx_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" /> */}
            </>
          }
          {generalCalibState.input_signal_type == 4 &&
            <>
              <FormInput
                id={`coef_mpx_calib_input`}
                name={`coef_aes`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_aes}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              {/* <FormInput
                id={`coef_mpx_calib_save`}
                name={`coef_mpx_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" /> */}
            </>
          }
          {generalCalibState.input_signal_type == 0 && 
            <>
              L
              <FormInput
                id={`coef_l_calib_input`}
                name={`coef_l`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_l}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              <div className="vertical_li_divider"></div>
              R
              <FormInput
                id={`coef_r_calib_input`}
                name={`coef_r`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_r}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              {/* <FormInput
                id={`coef_r_calib_save`}
                name={`coef_r_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" /> */}
            </>
          }
        </div>
      </li>
      {/* {generalCalibState.input_signal_type == 0 &&
        <>
          <li
            key='coef_l_calib'
            id='coef_l_calib'
            className="settings_item nested_item">
            <div className='item_header'>
              <label
                htmlFor={`coef_l_calib_input`}
                className="settings_itemLabel">
                Левый канал
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`coef_l_calib_input`}
                name={`coef_l`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_l}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              <FormInput
                id={`coef_l_calib_save`}
                name={`coef_l_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type='button' />
            </div>
          </li>
          <li
            key='coef_r_calib'
            id='coef_r_calib'
            className="settings_item nested_item">
            <div className='item_header'>
              <label
                htmlFor={`coef_r_calib_input`}
                className="settings_itemLabel">
                Правый канал
              </label>
            </div>
            <div className='item_input'>
              <FormInput
                id={`coef_r_calib_input`}
                name={`coef_r`}
                changeHandler={handleChange}
                input_value={generalCalibState.coef_r}
                style={{ margin: '0', maxWidth: '75px' }}
                placeholder='Вт'
                type="text_buttons"
                statusHandler={setGeneralCalibState}
                max={'6'}
                min={'-6'}
                step={0.1} />
              <FormInput
                id={`coef_r_calib_save`}
                name={`coef_r_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type='button' />
            </div>
          </li>
        </>
      } */}
      <li className="group_divider"></li>
      <li
        key='resistance_type_calib'
        id='resistance_type_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`resistance_type_calib_input`}
            className="settings_itemLabel">
            Вх. сопротивление (L/R)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`resistance_type_calib_input`}
            name={`resistance_type_calib`}
            type='select'
            input_value={generalCalibState.resistance_type}
            title='Тип сигнала'
            variants={[
              '600 Ом',
              '10 кОм',
            ]}
            changeHandler={handleChange} />
          {/* <FormInput
            id={`resistance_type_calib_save`}
            name={`resistance_type_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' /> */}
        </div>
      </li>
      <li
        key='deviation_calib'
        id='deviation_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`deviation_calib_input`}
            className="settings_itemLabel">
            Девиация
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`deviation_calib_input`}
            name={`deviation`}
            changeHandler={handleChange}
            input_value={generalCalibState.deviation}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='Вт'
            type="text_buttons"
            statusHandler={setGeneralCalibState}
            max={'30'}
            min={'-30'}
            step={1} />
          {/* <FormInput
            id={`deviation_calib_save`}
            name={`deviation_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' /> */}
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
            Время вкл. уст-ва в сеть
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
          {/* <FormInput
            id={`frequency_calib_save`}
            name={`frequency_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' /> */}
        </div>
      </li>
      { /*<li className="group_divider"></li>
       <li
        key='radio_label_calib'
        id='radio_label_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`radio_label_calib_input`}
            className="settings_itemLabel">
            Радиостанция (подпись)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`radio_label_calib_input`}
            name={`radio_label_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.radio_label}
            style={{ margin: '0', maxWidth: '150px' }}
            type="text" />
          <FormInput
            id={`radio_label_calib_save`}
            name={`radio_label_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li
        key='rds_enable_calib'
        id='rds_enable_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`rds_enable_calib_input`}
            className="settings_itemLabel">
            Параметры RDS
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`rds_enable_calib_input`}
            name={`rds_enable_calib`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            input_value={generalCalibState.rds_enable}
            type="switch" />
        </div>
      </li> */}
    </SettingsBlockWrap>
  )
}
