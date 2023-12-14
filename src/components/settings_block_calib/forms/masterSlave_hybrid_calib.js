import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';
import { PulseLoader } from 'react-spinners';
import { cloneDeep } from 'lodash';
import { MdNetworkCheck } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { reducers as core_reducers } from '../../../store/reducers/core_store_reducers';

const baudrate_arr = [
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
]

export default function Modbus_hybrid_calib(props) {
  const calibMasterSlave_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_modbus)

  const [modbusState, setModbusState] = React.useState({
    modbus_mode: 1, 
    modbus_form_availiable: 1,
    slave_address: 0,
    slave_baudrate: 0,
    slave_order_num: 0,
    master_address: 0,
    master_baudrate: 0,
    master_req_period: '',
    master_timeout: '',
  })

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!calibMasterSlave_store) {
      return
    }

    if (Object.keys(calibMasterSlave_store).length != 0 || calibMasterSlave_store != undefined) {
      let calib_state_copy = modbusState

      for (const key in calibMasterSlave_store) {
        calib_state_copy[key] = calibMasterSlave_store[key]
      }

      setModbusState(calib_state_copy)

    }
  }, [calibMasterSlave_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setModbusState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = modbusState[name],
          modbus_type = name.split('_')[0]


    const request_obj = {
      address: `calib_modbus_${modbus_type}.cgi`,
      data: `${name}$${value}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_modbus: modbusState
      }
    }

    props.clickHandler(request_obj);

  }

  const handleClick_saveBaud = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = baudrate_arr[modbusState[name]],
          modbus_type = name.split('_')[0]

    const request_obj = {
      address: `calib_modbus_${modbus_type}.cgi`,
      data: `${name}$${value}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_modbus: modbusState
      }
    }

    props.clickHandler(request_obj);

  }

  const handleClick_saveSelectArrs = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = Number(modbusState[name]) + 1,
      modbus_type = name.split('_')[0]

    const request_obj = {
      address: `calib_modbus_${modbus_type}.cgi`,
      data: `${name}$${value}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_modbus: modbusState
      }
    }

    props.clickHandler(request_obj);

  }

  const handleClick_saveModbusType = (event) => {
    const target = event.target,
          name = target.name,
          value = name.replace('modbus_mode_', '')

    const request_obj = {
      address: 'calib_modbus.cgi',
      data: `modbus_mode$${value}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_modbus: {
          modbus_mode: value,
        }
      }
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib
      header={`modbus`}
      // disabled={!modbusState.slave_form_availiable}
      // disableHandler={handleFormDisable}
      settings_type={`genera_modbus_slave_calib`} >
      <li
        key='modbus_mode_calib'
        id='modbus_mode_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`modbus_mode_input`}
            className="settings_itemLabel">
            Режим Modbus
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`slave_mode_save`}
            name={`modbus_mode_0`}
            class={`modbus_mode_button ${modbusState.modbus_mode == 0 ? 'mode_active' : ''}`}
            clickHandler={handleClick_saveModbusType}
            label='Slave'
            title='Выбрать режим Slave'
            type="button" />
          <FormInput
            id={`master_mode_save`}
            name={`modbus_mode_1`}
            class={`modbus_mode_button ${modbusState.modbus_mode == 1 ? 'mode_active' : ''}`}
            clickHandler={handleClick_saveModbusType}
            label='Master'
            title='Выбрать режим Master'
            type="button" />
        </div>
      </li>
      <li className="group_divider"></li>
      {modbusState.modbus_mode == 0 &&
        <>
        <li
          key='slave_address_calib'
          id='slave_address_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`slave_address_input`}
              className="settings_itemLabel">
              Адрес устройства
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`slave_address_calib_input`}
              name={`slave_address_calib`}
              disabled={!modbusState.modbus_form_availiable}
              class="calib_input"
              changeHandler={handleChange}
              input_value={modbusState.slave_address}
              type="select"
              variants={[...Array(10).keys()].map(i => i + 1)} />
            <FormInput
              id={`slave_address_save`}
              name={`slave_address`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_saveSelectArrs}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        <li
          key='slave_order_num_calib'
          id='slave_order_num_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`slave_order_num_input`}
              className="settings_itemLabel">
              Номер блока
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`slave_order_num_calib_input`}
              name={`slave_order_num_calib`}
              disabled={!modbusState.modbus_form_availiable}
              class="calib_input"
              changeHandler={handleChange}
              input_value={modbusState.slave_order_num}
              type="select"
              variants={[...Array(4).keys()].map(i => i + 1)} />
            <FormInput
              id={`slave_order_num_save`}
              name={`slave_order_num`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_saveSelectArrs}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        <li
          key='slave_baudrate_calib'
          id='slave_baudrate_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`slave_baudrate_input`}
              className="settings_itemLabel">
              Скорость передачи
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`slave_baudrate_input`}
              name={`slave_baudrate`}
              class="calib_input"
              disabled={!modbusState.modbus_form_availiable}
              changeHandler={handleChange}
              input_value={modbusState.slave_baudrate}
              type="select"
              variants={baudrate_arr}/>
            <FormInput
              id={`slave_baudrate_save`}
              name={`slave_baudrate`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_saveBaud}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        </>
      }
      {modbusState.modbus_mode == 1 && 
        <>
        <li
          key='master_baudrate_calib'
          id='master_baudrate_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`master_baudrate_input`}
              className="settings_itemLabel">
              Скорость передачи
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`master_baudrate_input`}
              name={`master_baudrate`}
              class="calib_input"
              disabled={!modbusState.modbus_form_availiable}
              changeHandler={handleChange}
              input_value={modbusState.master_baudrate}
              type="select"
              variants={baudrate_arr} />
            <FormInput
              id={`master_baudrate_save`}
              name={`master_baudrate`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_saveBaud}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        <li
          key='master_req_period_calib'
          id='master_req_period_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`master_req_period_input`}
              className="settings_itemLabel">
              Период запросов
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`master_req_period_input`}
              name={`master_req_period`}
              disabled={!modbusState.modbus_form_availiable}
              class="calib_input"
              changeHandler={handleChange}
              input_value={modbusState.master_req_period}
              type="text" />
            <FormInput
              id={`master_req_period_save`}
              name={`master_req_period`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        <li
          key='master_timeout_calib'
          id='master_timeout_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`master_timeout_input`}
              className="settings_itemLabel">
              Таймаут
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`master_timeout_input`}
              name={`master_timeout`}
              class="calib_input"
              disabled={!modbusState.modbus_form_availiable}
              changeHandler={handleChange}
              input_value={modbusState.master_timeout}
              type="text" />
            <FormInput
              id={`master_timeout_save`}
              name={`master_timeout`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        <li
          key='master_address_calib'
          id='master_address_calib'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`master_address_input`}
              className="settings_itemLabel">
              Адрес возбудителя
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`master_address_calib_input`}
              name={`master_address_calib`}
              disabled={!modbusState.modbus_form_availiable}
              class="calib_input"
              changeHandler={handleChange}
              input_value={modbusState.master_address}
              type="select"
              variants={[...Array(10).keys()].map(i => i + 1)} />
            <FormInput
              id={`master_address_save`}
              name={`master_address`}
              disabled={!modbusState.modbus_form_availiable}
              clickHandler={handleClick_saveSelectArrs}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        </>
      }

    </Settings_block_calib>
  )
}

