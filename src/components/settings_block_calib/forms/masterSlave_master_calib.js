import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';
import { PulseLoader } from 'react-spinners';
import { cloneDeep } from 'lodash';
import { MdNetworkCheck } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/calib_forms_reducers';

export default function Modbus_master_calib(props) {
  const calibMasterSlave_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_masterSlave)

  const [masterSlaveCalibState, setMasterSlaveCalibState] = React.useState({
    master_form_availiable: 1,
    master_connection_speed: '',
    master_req_period: '',
    master_timeout: '',
    device_list: {
      saved_list: [
        { id: '12', type: 'УРЦ-100/300', order_number: 1, firm_ver: 'DigitalExciter_v1.5.14', protocol_ver: '3', address: '254', editable: false }
      ],
      active_edit_device: {

      }
    }
  })

  const [isOpen, setIsOpen] = React.useState(false);
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
      name = target.name.replace('_calib', ''),
      value = masterSlaveCalibState[name]

    const request_obj = {
      address: 'calib_modbus_master.cgi',
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

    props.updateHandler(request_obj);

  }

  const changeHandler = (event) => {
    if (Object.keys(masterSlaveCalibState.device_list.active_edit_device).length === 0) return

    const target = event.target,
      name = target.name,
      value = target.type === 'checkbox' ? target.checked : target.value

    const change_params = name.split('_'),
      // id = change_params[0],
      change_type = change_params[0]

    switch (change_type) {
      case 'available':
        setMasterSlaveCalibState(prevState => ({
          ...prevState,
          device_list: {
            ...prevState.device_list,
            active_edit_device: {
              ...prevState.device_list.active_edit_device,
              available: value
            }
          }
        }))
        break;

      case 'type':
        setMasterSlaveCalibState(prevState => ({
          ...prevState,
          device_list: {
            ...prevState.device_list,
            active_edit_device: {
              ...prevState.device_list.active_edit_device,
              type: value
            }
          }
        }))
        break;

      case 'address':
        setMasterSlaveCalibState(prevState => ({
          ...prevState,
          device_list: {
            ...prevState.device_list,
            active_edit_device: {
              ...prevState.device_list.active_edit_device,
              address: value
            }
          }
        }))
        break;

      default:
        break;
    }
  }

  const handleFormDisable = (event) => {
    const target = event.target,
      value = target.type === 'checkbox' ? target.checked : target.value

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      master_form_availiable: value
    }))

    const req_obj = {
      address: 'calib_modbus_master.cgi',
      data: `master_form_availiable$${value}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_masterSlave: masterSlaveCalibState
      }
    }

    props.updateHandler(req_obj)
  }

  const toggleEditableDevice = ({ id, index, boolean } = {}) => {

    let device_list_clone = cloneDeep(masterSlaveCalibState.device_list.saved_list)

    if (device_list_clone[index] === undefined) {
      return
    }

    device_list_clone.forEach((device) => {
      device.editable = false
    })

    device_list_clone[index].editable = boolean

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      device_list: {
        ...prevState.device_list,
        saved_list: device_list_clone
      }
    }))
  }

  const createDeviceInBuffer = () => {
    const acc_template = {
      id: 'none',
      available: true,
      type: '0',
      address: '',
      editable: true
    }

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      device_list: {
        ...prevState.device_list,
        active_edit_device: acc_template
      }
    }))
  }

  const copyDeviceToBuffer = ({ id, index, boolean } = {}) => {
    let device_to_edit = masterSlaveCalibState.device_list.saved_list[index]

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      device_list: {
        ...prevState.device_list,
        active_edit_device: device_to_edit
      }
    }))
  }

  const copyBuffertoList = ({ id, index, boolean } = {}) => {
    let index_to_copy = masterSlaveCalibState.device_list.saved_list.findIndex(device => device.id === id),
      device_to_copy = masterSlaveCalibState.device_list.active_edit_device

    if (index_to_copy === -1) {
      doRegisterAccReq({
        type: device_to_copy.type,
        address: device_to_copy.address
      })
    } else {
      doSaveAccReq({
        id: device_to_copy.id,
        type: device_to_copy.type,
        address: device_to_copy.address
      })
    }

    // setAccountState(prevState => ({
    //   ...prevState,
    //   user_list: list_to_copy
    // }))
  }

  const cleanBuffer = () => {
    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      device_list: {
        ...prevState.device_list,
        active_edit_device: {}
      }
    }))
  }

  const deleteEditingAcc = ({ id, index_to_delete, boolean } = {}) => {
    let filtered_list = masterSlaveCalibState.device_list.saved_list.filter(function (user, index) {
      return index_to_delete != index
    })

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      device_list: {
        ...prevState.device_list,
        saved_list: filtered_list
      }
    }))
  }

  const setAccEditOn = ({ id, index, boolean } = {}) => {
    toggleEditableDevice({
      index: index,
      boolean: true
    });

    copyDeviceToBuffer({
      index: index,
      boolean: true
    });
  }

  const setAccEditSave = ({ id, index, boolean } = {}) => {
    copyBuffertoList({
      id: id
    })

    toggleEditableDevice({
      index: index,
      boolean: false
    })

    cleanBuffer()

  }

  const setAccEditDelete = ({ id, index, boolean } = {}) => {
    toggleEditableDevice({
      index: index,
      boolean: false
    })

    cleanBuffer()

    // deleteEditingAcc({
    //   index_to_delete: index
    // })
    doDeleteAccReq({
      id: id
    })
  }

  const setAccEditCancel = ({ id, index, boolean } = {}) => {
    cleanBuffer()

    toggleEditableDevice({
      index: index,
      boolean: false
    })
  }

  const doGetDeviceList = () => {
    const req_obj = {
      address: 'modbus_get_device_list.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)
    console.log('acc get list')

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doSaveAccReq = ({ id, type, address } = {}) => {
    const new_type = type,
      new_address = address.length > 0 ? address : 'NULL'

    const req_obj = {
      address: 'modbus_edit_device.cgi',
      data: `id$${id};type$${new_type};address$${new_address}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doDeleteAccReq = ({ id } = {}) => {
    const req_obj = {
      address: 'modbus_delete_device.cgi',
      data: `id$${id}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doRegisterAccReq = ({ type, address } = {}) => {
    const new_type = type,
      new_address = address.length > 0 ? address : 'NULL'

    const req_obj = {
      address: 'modbus_register_device.cgi',
      data: `type$${new_type};address$${new_address}`,
      notifications: {
        good: 'Зарегистрировано',
        bad: 'default'
      },
    }

    console.log(req_obj)

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doCheckDeviceConnection = ({ id }) => {
    const req_obj = {
      address: 'check_device.cgi',
      data: `id$${id}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    props.updateHandler(req_obj)
  }

  return (
    <Settings_block_calib
      header={`modbus - master`}
      disabled={!masterSlaveCalibState.master_form_availiable}
      disableHandler={handleFormDisable}
      settings_type={`genera_modbus_slave_calib`} >
      <li
        key='master_connection_speed_calib'
        id='master_connection_speed_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`master_connection_speed_input`}
            className="settings_itemLabel">
            Скорость передачи
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`master_connection_speed_input`}
            name={`master_connection_speed`}
            class="calib_input"
            disabled={!masterSlaveCalibState.master_form_availiable}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_connection_speed}
            type="select"
            variants={[
              '9600',
              '19200',
              '38400',
              '57600',
              '115200'
            ]} />
          <FormInput
            id={`master_connection_speed_save`}
            name={`master_connection_speed`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={handleClick_save}
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
            disabled={!masterSlaveCalibState.master_form_availiable}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_req_period}
            type="text" />
          <FormInput
            id={`master_req_period_save`}
            name={`master_req_period`}
            disabled={!masterSlaveCalibState.master_form_availiable}
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
            disabled={!masterSlaveCalibState.master_form_availiable}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_timeout}
            type="text" />
          <FormInput
            id={`master_timeout_save`}
            name={`master_timeout`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='sys_logs_calib'
        id='sys_logs_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`account_manage_calib_input`}
            className="settings_itemLabel">
            Управление списком slave-устройств
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`account_manage_calib_input`}
            name={`account_manage_calib`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={(e) => {
              setIsOpen(true);
              doGetDeviceList()
              // setIsLoading(true)
            }}
            label='Открыть'
            type="button" />
        </div>
      </li>
      {isOpen &&
        <ModalCalib
          header='управление списком устройств'
          setIsOpen={(e) => {
            setIsOpen(false)
          }}
          user_controllable={true}
          class='acc_manage_modal'>
          {isLoading ?
            <>
              <div className='hex_upload_message_wrap'>
                <PulseLoader
                  color="#bbcacf"
                  loading
                  margin={9}
                  size={13}
                  speedMultiplier={0.5}
                />
                <span className='hex_upload_upload_message'>
                  Идет получение списка устройств...
                </span>
              </div>
            </> :
            <>
              <table className="log_list_table">
                <thead className="logs_header">
                  <tr>
                    <td>тип</td>
                    <td>адрес</td>
                    <td>№</td>
                    <td>ver. прошивки</td>
                    <td>ver. протокола</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody className="user_log log_list">
                  {masterSlaveCalibState.device_list.saved_list.map((device, index) => (
                    <tr
                      key={device.id}
                      id={`user_${device.id}`}
                      className={`acc_item`}>
                      <td className='acc_login'>
                        {device.type}
                        {/* <FormInput
                          type='select'
                          disabled={!device.editable}
                          name='type'
                          input_value={device.editable ?
                            masterSlaveCalibState.device_list.active_edit_device.type :
                            device.type
                          }
                          changeHandler={changeHandler}
                          variants={[
                            'УРЦ-100/300',
                            'УРЦ-500',
                            'УРЦ-1000',
                            'УРЦ-2000',
                            'УСТ-050/100',
                            'УСТ-250',
                            'УСТ-500',
                            'РЦ-ХХХ',
                            'СТ-100',
                            'СТ-250',
                          ]}
                        /> */}
                      </td>
                      <td className='acc_password'>
                        {device.address}
                      </td>
                      <td>{device?.order_number}</td>
                      <td>{device.firm_ver}</td>
                      <td>{device.protocol_ver}</td>
                      <td className="acc_actions">
                        <FormInput
                          id={`sys_logs_calib_input`}
                          name={`sys_logs_calib`}
                          title='Проверить связь'
                          clickHandler={(e) => {
                            doCheckDeviceConnection({
                              id: device.id
                            })
                          }}
                          label={<MdNetworkCheck style={{ margin: "3px 0px 0" }} />}
                          type="button" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="acc_list_actions_wrap">
                <FormInput
                  id={`calib_password_save`}
                  name={`calib_password`}
                  clickHandler={(e) => {
                    doGetDeviceList()
                  }}
                  class='log_refresh'
                  label='Обновить список устройств'
                  type="button"
                />
                {/* {masterSlaveCalibState.device_list.saved_list.length < 6 &&
                  <FormInput
                    id={`calib_password_save`}
                    name={`calib_password`}
                    clickHandler={(e) => {
                      createDeviceInBuffer()
                    }}
                    class='log_refresh'
                    label='Добавить нов. устройство'
                    type="button"
                  />
                } */}
              </div>
            </>
          }
        </ModalCalib>
      }
    </Settings_block_calib>
  )
}



