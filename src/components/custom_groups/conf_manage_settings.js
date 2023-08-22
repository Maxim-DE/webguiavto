import React from 'react'

import { PulseLoader } from 'react-spinners'
import { MdInfoOutline } from 'react-icons/md'

import clone from 'lodash/clone'
import { dec2hexString } from '../../logic/utilites'

import FormInput from '../form_input'
import ModalCalib from '../calib_modal';
import _ from 'lodash'
import { reducers } from './store_reducers'

function Conf_manage_settings({parent_state, state_handler, ...rest}) {

  const [confManageState, setConfManageState] = React.useState({
    active_conf: 0,
    conf_list: []
  })

  const [isInfoOpen, setIsInfoOpen] = React.useState(false)

  const [saveConfState, setSaveConfState] = React.useState({
    isOpen: false,
    new_conf_name: ''
  })

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    const state_clone = {
      conf_manage: clone(confManageState)
    }

    state_handler(state_clone)
  }, [])

  React.useEffect(() => {
    if (!parent_state) return

    if (!Object.hasOwn(parent_state, 'conf_manage')) return

    if (_.isEqual(parent_state.conf_manage, confManageState)) return

    setConfManageState(
      parent_state.conf_manage
    )
  }, [parent_state])

  React.useEffect(() => {
    const state_clone = {
      silence_det: clone(confManageState)
    }

    state_handler(state_clone)
  }, [confManageState])

  const changeHandler = (event) => {
    const target = event.target,
          name = target.name,
          value = target.type === 'checkbox' ? target.checked : target.value

    setConfManageState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const newConf_changeHandler = (event) => {
    const target = event.target,
      name = target.name,
      value = target.type === 'checkbox' ? target.checked : target.value

    setSaveConfState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const applyConfHandler = () => {
    const conf_index = confManageState.active_conf,
          conf_name = confManageState.conf_list[conf_index]

    const request_obj = {
      address: 'apply_conf.cgi',
      data: `name$${conf_name}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    rest.update_handler(request_obj)
  }

  const getConfInfo = () => {
    const conf_index = confManageState.active_conf,
          conf_name = confManageState.conf_list[conf_index]

    const request_obj = {
      address: 'get_conf_info.cgi',
      data: `name$${conf_name}`,
      reducer: reducers.get_conf_info,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    rest.update_handler(request_obj)
  }

  const infoConfApply_handler = () => {
    applyConfHandler()
    setIsInfoOpen(false)
  }

  const saveConfHandler = () => {
    const request_obj = {
      address: 'save_new_conf.cgi',
      data: `name$${saveConfState.new_conf_name}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    rest.update_handler(request_obj)

    saveConf_modalHandler(false)
  }

  const saveConf_modalHandler = (bool) => {
    setSaveConfState(prevState => ({
      ...prevState,
      isOpen: bool
    }))
  }
  
  const deleteConfHandler = () => {
    const conf_index = confManageState.active_conf,
          conf_name = confManageState.conf_list[conf_index]

    const request_obj = {
      address: 'delete_conf.cgi',
      data: `name$${conf_name}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }
    
    rest.update_handler(request_obj)
    
    setIsDeleteOpen(false)
  }
  
  const deleteConf_modalHandler = (bool) => {
    setIsDeleteOpen(bool)
  }
  
  const conf_labels_to_arr = (conf_arr) => {
    let label_arr = []
    
    for (let index = 0; index < conf_arr.length; index++) {
      const conf_data = conf_arr[index];
      label_arr.push(conf_data.name)
    }
    
    return label_arr
  }
  
  return (
    <>
      <li
        key='conf_manage_settings'
        id='conf_manage_settings'
        className="settings_item group_divider">
        <label
          htmlFor={`time_sync_input`}
          className="settings_itemLabel">
          Управление конфигурациями
        </label>
      </li>
      <li
        key='conf_list'
        id='conf_list'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_list_input`}
            className="settings_itemLabel">
            Список конф.
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`conf_list_input`}
            name={`conf_list`}
            type="select"
            changeHandler={changeHandler}
            input_value={confManageState.active_conf}
            variants={[]} />
          <button
            className='button_input'
            onClick={(e) => {
              setIsInfoOpen(true)
              getConfInfo
            }}
            type='button'
            title='Данные о конф.' >
            <MdInfoOutline />
          </button>
        </div>
      </li>
      <li
        key='conf_list_actions'
        id='conf_list_actions'
        className="settings_item nested_item"
        style={{
          flexWrap: 'wrap',
          height: 'auto',
          justifyContent: 'flex-end',
          gap: '10px',
          padding: '15px 0'
        }}>
        {/* <div className='item_header'>
          <label
            htmlFor={`conf_list_input`}
            className="settings_itemLabel" />
        </div> */}
          <FormInput
            id={`conf_list_apply_input`}
            name={`conf_list_apply`}
            clickHandler={applyConfHandler}
            label='Применить'
            type="button" />
          <FormInput
            id={`conf_list_delete_input`}
            name={`conf_list_delete`}
            clickHandler={(e) => {deleteConf_modalHandler(true)}}
            label='Удалить'
            type="button" />
          {/* <FormInput
            id={`conf_list_save_input`}
            name={`conf_list_save`}
            clickHandler={(e) => { saveConf_modalHandler(true) }}
            label='Сохр. в нов. файл'
            type="button"
            style={{maxWidth: '200px'}} /> */}
          <FormInput
            id={`conf_list_save_input`}
            name={`conf_list_save`}
            clickHandler={(e) => {saveConf_modalHandler(true)}}
            label='Сохранить тек. конф. в новый файл'
            type="button" />
        <div className='item_input'>
        </div>
      </li>
      <li
        key='conf_list_save'
        id='conf_list_save'
        className="settings_item nested_item">
        <label
          htmlFor={`conf_list_save_input`}
          className="settings_itemLabel">
          {/* Сохранить тек. конф. в новый файл */}
        </label>
      </li>

      {saveConfState.isOpen &&
        <ModalCalib
          header='сохранить конфигурацию'
          setIsOpen={(e) => {saveConf_modalHandler(false)}}
          user_controllable={true}>
          <div className='hex_upload_message_wrap'>
            <span className='hex_upload_upload_message'>Название новой конфигурации:</span>
            <FormInput
              id={`conf_new_name_input`}
              name={`new_conf_name`}
              type={`text`}
              changeHandler={newConf_changeHandler}
              input_value={saveConfState.new_conf_name}
            />
            <div className='action_buttons'>
            <FormInput
              id={`conf_new_name_save_input`}
              name={`new_name_save`}
              clickHandler={saveConfHandler}
              label='Сохранить'
              type="button"
              // style={{ float: 'right' }} 
              />
            <FormInput
              id={`conf_new_name_discard`}
              name={`new_name_discard`}
              clickHandler={(e) => {saveConf_modalHandler(false)}}
              label='Отмена'
              type="button"
              // style={{ float: 'right' }} 
              />
            </div>
          </div>
        </ModalCalib>
      }
      {isDeleteOpen &&
        <ModalCalib
          header='удалить конфигурацю'
          setIsOpen={(e) => {deleteConf_modalHandler(false)}}
          user_controllable={true}
          class='full_log_modal hex_upload_modal'>
          <div className='hex_upload_message_wrap'>
            <span className='hex_upload_upload_message'>
              Вы точно хотите удалить эту конфигурацию?
            </span>
            <div className='action_buttons'>
              <FormInput
                id={`conf_delete_input`}
                name={`conf_delete`}
                clickHandler={deleteConfHandler}
                label='Удалить'
                type="button" />
              <FormInput
                id={`conf_delete_cancel_input`}
                name={`conf_delete_cancel`}
                clickHandler={(e) => {deleteConf_modalHandler(false)}}
                label='Отмена'
                type="button"
                style={{ backgroundColor: '#D6D6D6' }} />
            </div>
          </div>
        </ModalCalib>
      }
      {isInfoOpen &&
        <ModalCalib
          header='данные о профиле'
          setIsOpen={(e) => {setIsInfoOpen(false)}}
          user_controllable={true}
          class='full_log_modal'>
          <div className='hex_upload_message_wrap'>
            <Conf_info_block
              conf_state={confManageState} />
            <div className='action_buttons'>
              <FormInput
                id={`conf_delete_input`}
                name={`conf_delete`}
                clickHandler={infoConfApply_handler}
                label='Применить'
                type="button" />
              <FormInput
                id={`conf_delete_cancel_input`}
                name={`conf_delete_cancel`}
                clickHandler={(e) => {setIsInfoOpen(false)}}
                label='Отмена'
                type="button"
                style={{ backgroundColor: '#D6D6D6' }} />
            </div>
          </div>
        </ModalCalib>
      }
    </>
    
  )
}


const Conf_info_block = ({ conf_state, ...rest }) => {
  
  let req_conf = conf_state.conf_list[conf_state.active_conf],
      state_info = req_conf?.info == undefined ? {} : req_conf.info

  let param_nameTranslate = {
    'nameProfile': 'Имя профиля',
    'Frequency': 'Частота',
    'Pout': 'Вых. мощность',
    'TypeInput': 'Тип ввода',
    'ModeRds': 'Режим RDS',
    'SilenceDet': 'Детектор тишины'
  };

  let param_valueTranslate = {

    'Frequency': function (freq_num) {
      let freq_str = `${freq_num / 100} МГц`;

      return freq_str
    },

    'Pout': function (wattage) {
      let pout_str = `${wattage} Вт`;

      return pout_str
    },

    'TypeInput': function (input_type) {
      let type_massive = [
        'STEREO',
        'AES_EBU',
        'MONO_R',
        'MONO_L',
        'MPX_EXT',
        'INPUT_ETH',
        'USB'
      ];

      return type_massive[input_type]
    },

    'ModeRds': function (mode) {
      let rds_mode_massive = [
        'Внутренний',
        'Выключен',
        'Внешний'
      ];

      return rds_mode_massive[mode]
    },

    'SilenceDet': function (mode) {
      let silence_det_massive = [
        'Выкл.',
        'Вкл.'
      ];

      return silence_det_massive[mode]
    },

    'PI': function (code) {
      let hex_code = dec2hexString(code);

      return hex_code
    },

  }

  function translateParam(dictionary, param_name) {
    let new_param_str;

    for (const param in dictionary) {
      if (param_name == param) {
        new_param_str = dictionary[param_name];
        break;
      } else {
        new_param_str = param_name;
      }
    }

    return new_param_str
  }

  function translateValue(dictionary, param_name, param_value) {
    let new_val_str;

    for (const value in dictionary) {
      if (param_name == value) {
        new_val_str = dictionary[param_name](param_value);
        break;
      } else {
        new_val_str = param_value;
      }
    }

    return new_val_str

  }

  if (state_info.length != 0) {
    let conf_info_str = '';

    for (const param in state_info) {
      let param_str = '';
      let value_str = '';

      let nested_keys = Object.keys(state_info[param]);

      if (typeof state_info[param] == "string") {
        nested_keys.length = 0;
      }

      if (nested_keys.length != 0) {
        let nested_obj = state_info[param];
        let sub_param_str = '';
        let translated_param = translateParam(param_nameTranslate, param);
        param_str = `${translated_param}:\n`;

        for (const key in nested_obj) {
          let translated_sub_str = translateParam(param_nameTranslate, key);

          if (Array.isArray(nested_obj[key])) {
            sub_param_str = `\u00A0\u00A0\u00A0${translated_sub_str}: `;
            for (let index = 0; index < nested_obj[key].length; index++) {
              sub_param_str = sub_param_str + nested_obj[key][index] + ' ';
            }

            sub_param_str = sub_param_str + '\n';

          } else {
            value_str = translateValue(param_valueTranslate, key, nested_obj[key]);

            sub_param_str = `\u00A0\u00A0\u00A0${translated_sub_str}: ${value_str}\n`;
          }
          param_str = param_str + sub_param_str;
        }

      } else {
        let translated_param = translateParam(param_nameTranslate, param);

        value_str = translateValue(param_valueTranslate, param, state_info[param]);

        param_str = `${translated_param}: ${value_str}\n`;
      }

      conf_info_str = conf_info_str + param_str;

    }

    return (
      <div>{conf_info_str}</div>
    )

  } else {
    return (
      <PulseLoader
        color="#bbcacf"
        loading
        margin={9}
        size={13}
        speedMultiplier={0.5}
      />
    )
  }
}

export const add_info_to_conf = (conf_info, conf_data, conf_name) => {
  let req_conf = conf_data.find(conf => conf.name === conf_name),
      conf_pos = 0

  for (let conf = 0; conf < conf_data.length; conf++) {
    if(conf_data[conf].name == conf_name) {
      conf_pos = conf
      break;
    }
  }

  req_conf.info = conf_info.info
  conf_data[conf_pos] = req_conf

  return conf_data
  
}

export default Conf_manage_settings