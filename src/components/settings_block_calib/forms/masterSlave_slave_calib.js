import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';
import { PulseLoader } from 'react-spinners';
import { cloneDeep } from 'lodash';
import { MdNetworkCheck } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/calib_forms_reducers';

const baudrate_arr = [
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
]

export default function Modbus_slave_calib(props) {
  const calibMasterSlave_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_masterSlave)

  const [masterSlaveCalibState, setMasterSlaveCalibState] = React.useState({ 
    slave_form_availiable: 1,
    slave_address: '',
    slave_baudrate: 0,
    slave_order_num: ''
  })

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!calibMasterSlave_store) {
      return
    }

    if (Object.keys(calibMasterSlave_store).length != 0 || calibMasterSlave_store != undefined) {
      let calib_state_copy = masterSlaveCalibState

      for (const key in calibMasterSlave_store) {
        calib_state_copy[key] = calibMasterSlave_store[key]
      }

      setMasterSlaveCalibState(calib_state_copy)

    }
  }, [calibMasterSlave_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value

    if (name === 'slave_baudrate') {
      value = baudrate_arr[masterSlaveCalibState[name]]
    } else {
      value = masterSlaveCalibState[name]
    }

    const request_obj = {
      address: 'calib_modbus_slave.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_masterSlave: masterSlaveCalibState
      }
    }

    props.clickHandler(request_obj);

  }

  const handleFormDisable = (event) => {
    const target = event.target,
          value = target.type === 'checkbox' ? target.checked : target.value

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      master_form_availiable: value
    }))

    const req_obj = {
      address: 'calib_modbus_slave.cgi',
      data: `slave_form_availiable$${value}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_masterSlave: masterSlaveCalibState
      }
    }

    props.clickHandler(req_obj)
  }

  return (
    <Settings_block_calib
      header={`modbus - slave`}
      // disabled={!masterSlaveCalibState.slave_form_availiable}
      // disableHandler={handleFormDisable}
      settings_type={`genera_modbus_slave_calib`} >
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
            disabled={!masterSlaveCalibState.slave_form_availiable}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.slave_address}
            type="select"
            variants={[...Array(10).keys()].map(i => i + 1)} />
          <FormInput
            id={`slave_address_save`}
            name={`slave_address`}
            disabled={!masterSlaveCalibState.slave_form_availiable}
            clickHandler={handleClick_save}
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
            disabled={!masterSlaveCalibState.slave_form_availiable}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.slave_order_num}
            type="select"
            variants={[...Array(4).keys()].map(i => i + 1)} />
          <FormInput
            id={`slave_order_num_save`}
            name={`slave_order_num`}
            disabled={!masterSlaveCalibState.slave_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='master_connection_speed_calib'
        id='master_connection_speed_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`slave_connection_speed_input`}
            className="settings_itemLabel">
            Скорость передачи
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`slave_baudrate_input`}
            name={`slave_baudrate`}
            class="calib_input"
            disabled={!masterSlaveCalibState.slave_form_availiable}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.slave_baudrate}
            type="select"
            variants={baudrate_arr}/>
          <FormInput
            id={`slave_baudrate_save`}
            name={`slave_baudrate`}
            disabled={!masterSlaveCalibState.slave_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

