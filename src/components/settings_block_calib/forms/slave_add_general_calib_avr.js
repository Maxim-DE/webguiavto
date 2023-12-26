import React from 'react'

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/avr_control_reducers';

export default function SlaveAddGeneralCalib_AVR({ calib_state, clickHandler, ...props }) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    radio_label: '',
    rds_enable: 0
  })

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
    const target = event.target,
      name = target.name.replace('_calib', '')

    let value, state_to_save

    if (calib_state != undefined && calib_state[name] != undefined) {
      if (Array.isArray(calib_state[name])) {
        value = generalCalibState[name] * 10
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = target.type == 'checkbox' ? Number(target.checked) : generalCalibState[name]
        state_to_save = { [name]: value }
      }
    } else {
      value = target.type == 'checkbox' ? Number(target.checked) : generalCalibState[name]
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_add_general.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      update_data: generalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_signal: state_to_save
      }
    }

    clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`дополнительно`}
      settings_type={`slave_add_general`}
      section_name={props.section_name}>
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
      </li>
      {/* <li
        key='input_power_calib'
        id='input_power_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`input_pwr_calib_input`}
            className="settings_itemLabel">
            Входная мощность
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`input_power_calib_input`}
            name={`input_pwr_calib`}
            changeHandler={handleChange}
            input_value={generalCalibState.input_power}
            style={{ margin: '0', maxWidth: '75px' }}
            placeholder='Вт'
            type="text" />
          <FormInput
            id={`input_power_calib_save`}
            name={`input_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='channel_coef_calib'
        id='channel_coef_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`channel_coef_type_calib_input`}
            className="settings_itemLabel">
            Коэффициент передачи
          </label>
          <FormInput
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
            changeHandler={handleChange} />
        </div>
        <div className='item_input'>
          {generalCalibState.channel_coef_type == 1 &&
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
            <FormInput
              id={`coef_l_calib_save`}
              name={`coef_l_calib`}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
            </>
          }
          {generalCalibState.channel_coef_type == 2 &&
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
              <FormInput
                id={`coef_r_calib_save`}
                name={`coef_r_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </>
          }
          {generalCalibState.channel_coef_type == 3 &&
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
              <FormInput
                id={`coef_mpx_calib_save`}
                name={`coef_mpx_calib`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            </>
          }
        </div>
      </li>
      {generalCalibState.channel_coef_type == 0 &&
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
      }
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
          <FormInput
            id={`resistance_type_calib_save`}
            name={`resistance_type_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
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
          <FormInput
            id={`deviation_calib_save`}
            name={`deviation_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type='button' />
        </div>
      </li> */}
    </Settings_block_calib>
  )
}
