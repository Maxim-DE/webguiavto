import React from 'react'

import SettingsBlockWrap from '../../settings_block_wrap'
import FormInput from '../../form_input'

// import { Alt_station_manage } from '../../custom_groups/alt_station_manage'

import clone from 'lodash/clone'
import { dataArray_to_string } from '../../../logic/request_logic'
import { useSelector } from 'react-redux'
import Settings_block_calib from '..'
import { cloneDeep, merge } from 'lodash'
import { reducers } from '../../../store/reducers/avr_control_reducers'
import { diff } from 'deep-object-diff'
import { hasCyrillicSymbols, isHexNumber, isInNumRange } from '../../../logic/validation/validators'
import { useFormValidation } from '../../../logic/validation/formValidation_hook'

import Slave_scheduler_block from './slave_scheduler_block_general_avr';

// const transTypesArray = ["(none)", "News", "Affairs", "Info", "Sport", "Educate", "Drama", "Culture", "Science", "Varied", "Pop M", "Rock M", "Easy M", "Light M", "Classics", "Other M", "Weather", "Finance", "Children", "Social", "Religion", "Phone In", "Travel", "Leisure", "Jazz", "Country", "Nation M", "Oldies", "Folk M", "Document", "TEST", "Alarm!"];






export default function Slave_scheduler_general_AVR({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.section_data.rds.rds_general_settings)

  // Новая структура под сервер
    // Более чистая структура
  const [schedulerBlocksState, setSchedulerBlocksState] = React.useState({
    type: 1,      // 0 - ежедневно 1 - по расписанию  
    power_on: {
      day: 2,     // 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб, 7=Вс
      hour: 21,    // часы
      min: 9      // минуты
    },
    power_off: {
      day: 0,
      hour: 9,
      min: 10
    }
  });


  // Функция для обновления состояния конкретного блока
  const updateBlockState = (blockType, updates) => {
    setSchedulerBlocksState(prev => {
      const newState = {
        ...prev,
        [blockType]: {
          ...prev[blockType],
          ...updates
        }
      };
      
      // работает ! 
      // console.log('Previous state:', prev);   
      // console.log('New state:', newState);
     
      return newState;
    });
  };


  const {isFormValid, validStatus_getter} = useFormValidation()

  const state_prev_copy = React.useRef(null)

  // Данный хук вызывается при изменения состояния calib_state
  // А именно, когда поступают новые данные по json
  // Преобразование данных из формата сервера в формат компонента


  React.useEffect(() => {
    if (calib_state != 'null' && calib_state != undefined) {
      let settings_state_copy = schedulerBlocksState

      for (const key in calib_state) {
        settings_state_copy[key] = calib_state[key]
      }

      setSchedulerBlocksState(settings_state_copy)

      state_prev_copy.current = settings_state_copy
    }
  }, [calib_state])



    // React.useEffect(() => {
    //   console.log('scheduler_enable changed:', schedulerBlocksState.type);

    //   setSchedulerBlocksState(schedulerBlocksState.type);
    // }, [schedulerBlocksState.type]);

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    
    // Если это switch, то значение в target.checked
    if (target.type === 'checkbox' || target.className.includes('switch')) {
      const value = target.checked;
      
      setSchedulerBlocksState(prevState => ({
        ...prevState,
        [name]: value ? 1 : 0  // Преобразуем boolean в 0/1
      }));
    } else {
      const value = target.value;
      
      setSchedulerBlocksState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  }

  // const handleChange = (event) => {
  //     const target = event.target;
  //     const value = target.type === 'checkbox' ? target.checked : target.value;
  //     // const name = target.name.replace('_calib', '')

  //     console.log("11111111111111111:",value)
  //     // console.log(vlue)
      
  //     setSchedulerBlocksState(prevState => ({
  //       ...prevState,
  //       [name]: value
  //     }))
  //   }  


  // const handleClick_save = (event, payload) => {
  //   const state_diff = diff(state_prev_copy.current, schedulerBlocksState),
  //         req_data_str = dataArray_to_string(state_diff, (value, key) => {
  //       if (calib_state != undefined && calib_state[key] != undefined) {
  //         if (Array.isArray(calib_state[key])) {
  //           if (typeof calib_state[key][1] == 'number' &&
  //             calib_state[key][1] > 0)
  //             return value * calib_state[key][1]
  //         } else {
  //           return typeof value == "boolean" ? Number(value) : value;
  //         }
  //       } else {
  //         return typeof value == "boolean" ? Number(value) : value;
  //       }
  //     })

  //   const request_obj = {
  //     address: `set_${props.section_name}.cgi`,
  //     data: req_data_str,
  //     reducer: reducers.save_avr_device_data,
  //     notifications: {
  //       good: 'default',
  //       bad: 'default'
  //     },
  //     save_data: {
  //       slave_rds: state_diff
  //     }
  //   }

  //   clickHandler(request_obj);
  // }


  
    const handleClick_save = (event) => {
      event.preventDefault()
  
      const target = event.currentTarget,name = target.name
  
      const state_diff = target.type === 'checkbox' ? { [name]: schedulerBlocksState[name] } : 
                                                            diff(state_prev_copy.current, schedulerBlocksState),
  
            req_data_str = target.type === 'checkbox' ? `${name}$${Number(event.target.checked)}` : 
                                                              dataArray_to_string(state_diff, (value, key) => {
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
        address: 'calib_add_general.cgi',
        data: req_data_str,
        reducer: reducers.save_avr_device_data,
        notifications: {
          good: 'default',
          bad: 'default'
        },
  
        save_data: {
          slave_add_general: state_diff
        }
      }
  
      clickHandler(request_obj);
  
    }


  return (

    // Тут правильно бы создать один компонент который 
    // Будет использоваться для включение и для выключения 
    // В принципе это полезно для понимание работы 
    // Основной из вопросов его запихивать в отдельный файл
    // slave_scheduler_block_general_avr.js   так вроде понятно что он относится к расписанию 
    // Внутри компонента уже SettingsBlockWrap  не надо. 

    <SettingsBlockWrap 
      header={'Расписание'}
      settings_type={'rds_general_settings'}
      section_name={props.section_name}
      save_handler={handleClick_save}
      disable_save={!isFormValid} >


      <li
        key='Type_scheduler'
        id='Type_scheduler_0'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`Type_scheduler_input`}
            className="settings_itemLabel">
            Режим работы, по расписание
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`scheduler_enable_input`}
            name={`type`}
            changeHandler={(e) => {
              handleChange(e)
              // handleClick_Type(e)
              handleClick_save(e)
            }}
            input_value={schedulerBlocksState.type}
            // input_value={schedulerBlocksState.type === 1}  // ← преобразуем 0/1 в boolean
            type="switch" />
        </div>
      </li>

      {/* Передаем состояние и функцию обновления в дочерние компоненты */}
      <Slave_scheduler_block 
        header="ВКЛЮЧЕНИЕ"
        blockType="power_on"
        state={schedulerBlocksState.power_on}
        updateState={(updates) => updateBlockState('power_on', updates)}
        isDisabled={schedulerBlocksState.type === 0}
        // isDisabled={false}
      />
      
      <Slave_scheduler_block 
        header="ВЫКЛЮЧЕНИЕ"
        blockType="power_off"
        state={schedulerBlocksState.power_off}
        updateState={(updates) => updateBlockState('power_off', updates)}
        isDisabled={schedulerBlocksState.type === 0}
        // isDisabled={false}
      />
    
    </SettingsBlockWrap>
  )
}