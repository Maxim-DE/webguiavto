import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

function EmulationCalibSettings(props) {

  const calibEmulation_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_emulation)

  const [emulationCalibState, setEmulationCalibState] = React.useState({
    param_emulation_switch: 0,
    emul_param: 0,
    emul_param_value: 0,
    led_emulation_switch: 0,
    led_brightness: 0,
    led_rev: 0,
  })

  const param_emul_table = [
    'POUT',
    'PBAL',
    'PREF',
    'I1',
    'I2',
    'I3',
    'U1',
    'U2',
    'U3',
    '+U12',
    '-U12',
    'Девиация'
  ]

  React.useEffect(() => {
    if (!calibEmulation_store) {
      return
    } 

    if (Object.keys(calibEmulation_store).length != 0 ||
        calibEmulation_store != undefined) {
      let calib_state_copy = emulationCalibState

      for (const key in calibEmulation_store) {
        calib_state_copy[key] = calibEmulation_store[key]
      }

      setEmulationCalibState(calib_state_copy)

    }
  }, [calibEmulation_store])

  const device_type_handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value

    let state_array = emulationCalibState.device_type

    if (/series/gi.test(name)) {
      state_array[0] = Number(value)
    } else {
      state_array[1] = Number(value)
    }

    setEmulationCalibState(prevState => ({
      ...prevState,
      'device_type': state_array
    }))

  }

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value

    setEmulationCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // const handleChange_defence = (event) => {
  //   const target = event.target;
  //   const value = target.checked;
  //   const name = target.name.replace('_calib', '');

  //   setEmulationCalibState(prevState => ({
  //     ...prevState,
  //     [name]: + value
  //   }))

  //   const request_obj = {
  //     address: 'calib_emulation.cgi',
  //     data: `${name}$${+ value}`,
  //     notifications: {
  //       good: 'default',
  //       bad: 'default'
  //     },

  //     save_data: {
  //       calib_emulation: {
  //         [name]: value
  //       }
  //     }
  //   }

  //   props.clickHandler(request_obj);
  // }

  const handleSubmit = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value

    const request_obj = {
      address: 'calib_emulation.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_emulation: {
          [name]: value
        }
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`эмуляция`}
      settings_type={`emulation_calib`}>
      <li
        key='emulation_calib'
        id='emulation_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`param_emulation_switch_input`}
            className="settings_itemLabel">
            Эмуляция параметра
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`param_emulation_switch_input`}
            name={`param_emulation_switch`}
            changeHandler={(e)=> {
              handleChange(e);
              handleSubmit(e)
            }}
            input_value={!!emulationCalibState.param_emulation_switch}
            type="switch" />
        </div>
      </li>
      {!!emulationCalibState.param_emulation_switch &&
        <>
        <li
          key='emulation_param_calib'
          id='emulation_param_calib'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`emul_param_input`}
              className="settings_itemLabel">
              Параметр
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`emul_param_input`}
              name={`emul_param`}
              changeHandler={(e) => {
                handleChange(e);
                handleSubmit(e)
              }}
              input_value={emulationCalibState.emul_param}
              type="select"
              variants={param_emul_table} />
          </div>
        </li>
        <li
          key='emulation_param_value_calib'
          id='emulation_param_value_calib'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`emul_param_value_input`}
              className="settings_itemLabel">
              Эмул. значение (АЦП)
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`emul_param_value_input`}
              name={`emul_param_value`}
              changeHandler={handleChange}
              mouseupHandler={handleSubmit}
              input_value={emulationCalibState.emul_param_value}
              type="slider"
              min={0}
              max={4095} />
          </div>
        </li>
        <li
          key='emulation_current_value'
          id='emulation_current_value'
          className="settings_item">
          <div className='item_header'>
            <label
              className="settings_itemLabel">
            </label>
          </div>
          <div className='item_input'>
            <span className='item_adc_value'>
              Текущее значение параметра:{props.adc_data?.emulation_param_value}
            </span>
          </div>
        </li>
        </>
       }
      <li
        key='led_emulation_calib'
        id='led_emulation_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`led_emulation_switch_input`}
            className="settings_itemLabel">
            Эмуляция светодиода
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`led_emulation_switch_input`}
            name={`led_emulation_switch`}
            changeHandler={(e) => {
              handleChange(e);
              handleSubmit(e)
            }}
            input_value={!!emulationCalibState.led_emulation_switch}
            type="switch" />
        </div>
      </li>
      <li
        key='led_rev_calib'
        id='led_rev_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`led_rev_calib_input`}
            className="settings_itemLabel">
            Партия светодиодов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`led_rev_calib_input`}
            name={`led_rev`}
            changeHandler={(e) => {
              handleChange(e);
              handleSubmit(e)
            }}
            input_value={emulationCalibState.led_rev}
            type="select"
            variants={[
              'Старые',
              'Новые'
            ]} />
        </div>
      </li>
      <li
        key='led_brightness_calib'
        id='led_brightness_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`led_brightness_input`}
            className="settings_itemLabel">
            Яркость светодиодов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`led_brightness_input`}
            name={`led_brightness`}
            changeHandler={handleChange}
            mouseupHandler={handleSubmit}
            input_value={emulationCalibState.led_brightness}
            type="slider"
            min={1}
            max={8}
            step={1} />
        </div>
      </li>

    </Settings_block_calib>
  )
}

export default EmulationCalibSettings