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
      hour: 21,   // часы
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




    const handleRadioChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = parseInt(target.value, 10); // Преобразуем строку в число
    
    console.log('Radio changed:', { name, value }); // Для отладки
    
      setSchedulerBlocksState(prevState => ({
        ...prevState,
        [name]: value
      }));
    };


    const handleClick_save = (event) => {
      event.preventDefault();
      
      // Получаем данные из радио-кнопки
      const target = event.target;
      const name = target.name; // "type"
      const value = parseInt(target.value, 10); // 0 или 1
      
      console.log('Saving radio value:', { name, value });
      
      // Создаем diff с измененным значением
      const state_diff = { [name]: value };
      
      // Форматируем значение для отправки (если нужно умножение)
      let formattedValue = value;
      
      if (calib_state && calib_state[name] !== undefined) {
        if (Array.isArray(calib_state[name])) {
          const multiplier = calib_state[name][1];
          if (typeof multiplier === 'number' && multiplier > 0) {
            formattedValue = value * multiplier;
          }
        }
      }
      
      // Формируем строку запроса
      const req_data_str = `${name}$${formattedValue}`;
      
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
      };
      
      clickHandler(request_obj);
    };


    // // Для сохранения всех изменений (кнопка "Сохранить")
    // const saveAllChanges = (event) => {
    //   event.preventDefault();
      
    //   const state_diff = diff(state_prev_copy.current, schedulerBlocksState);
      
    //   if (Object.keys(state_diff).length === 0) {
    //     console.log('No changes to save');
    //     return;
    //   }
      
    //   const req_data_str = dataArray_to_string(state_diff, (value, key) => {
    //     if (calib_state != undefined && calib_state[key] != undefined) {
    //       if (Array.isArray(calib_state[key])) {
    //         if (typeof calib_state[key][1] == 'number' && calib_state[key][1] > 0) {
    //           return value * calib_state[key][1];
    //         }
    //       } else {
    //         return typeof value == "boolean" ? Number(value) : value;
    //       }
    //     } else {
    //       return typeof value == "boolean" ? Number(value) : value;
    //     }
    //   });
      
    //   const request_obj = {
    //     address: 'calib_add_general.cgi',
    //     data: req_data_str,
    //     reducer: reducers.save_avr_device_data,
    //     notifications: { good: 'default', bad: 'default' },
    //     save_data: { slave_add_general: state_diff }
    //   };
      
    //   clickHandler(request_obj);
    // };

    // const saveAllChanges = (event) => {
    //   event.preventDefault();
      
    //   // Собираем все значения в плоском формате
    //   const allValues = {
    //     type: schedulerBlocksState.type,
    //     ...(schedulerBlocksState.power_on && {
    //       on_day: schedulerBlocksState.power_on.day,
    //       on_hour: schedulerBlocksState.power_on.hour,
    //       on_min: schedulerBlocksState.power_on.min
    //     }),
    //     ...(schedulerBlocksState.power_off && {
    //       off_day: schedulerBlocksState.power_off.day,
    //       off_hour: schedulerBlocksState.power_off.hour,
    //       off_min: schedulerBlocksState.power_off.min
    //     })
    //   };
      
    //   // Формируем запрос
    //   const req_data_str = dataArray_to_string(allValues, (value, key) => {
    //     const calibValue = calib_state?.[key];
        
    //     if (Array.isArray(calibValue) && typeof calibValue[1] === 'number' && calibValue[1] > 0) {
    //       return value * calibValue[1];
    //     }
        
    //     return typeof value === "boolean" ? Number(value) : value;
    //   });
      
    //   const request_obj = {
    //     address: 'calib_add_general.cgi',
    //     data: req_data_str,
    //     reducer: reducers.save_avr_device_data,
    //     notifications: { good: 'default', bad: 'default' },
    //     save_data: { slave_add_general: allValues }
    //   };
      
    //   clickHandler(request_obj);
    // };    


  const saveAllChanges = (event) => {
    event.preventDefault();
    
    const { type, power_on, power_off } = schedulerBlocksState;
    
    // Основной объект с значениями
    const allValues = {
      type,
      on_hour: power_on?.hour,
      on_min: power_on?.min,
      off_hour: power_off?.hour,
      off_min: power_off?.min
    };
    
    
    if (type !== 1) {
      if (power_on?.day !== undefined) allValues.on_day = power_on.day;
      if (power_off?.day !== undefined) allValues.off_day = power_off.day;
    }
    
    // Формируем запрос
    const req_data_str = dataArray_to_string(allValues, (value, key) => {
      const calibValue = calib_state?.[key];
      
      if (Array.isArray(calibValue) && typeof calibValue[1] === 'number' && calibValue[1] > 0) {
        return value * calibValue[1];
      }
      
      return typeof value === "boolean" ? Number(value) : value;
    });
    
    const request_obj = {
      address: 'calib_add_general.cgi',
      data: req_data_str,
      reducer: reducers.save_avr_device_data,
      notifications: { good: 'default', bad: 'default' },
      save_data: { slave_add_general: allValues }
    };
    
    clickHandler(request_obj);
  };

  return (

    // Тут правильно бы создать один компонент который 
    // Будет использоваться для включение и для выключения 
    // В принципе это полезно для понимание работы 
    // Основной из вопросов его запихивать в отдельный файл
    // slave_scheduler_block_general_avr.js   так вроде понятно что он относится к расписанию 
    // Внутри компонента уже SettingsBlockWrap  не надо. 

    <SettingsBlockWrap 
      header={'Планировщик'}
      settings_type={'rds_general_settings'}
      section_name={props.section_name}
      save_handler={saveAllChanges}
      disable_save={!isFormValid} >

       <li
        key='Type_scheduler'
        id='Type_scheduler_0'
        className="settings_item"
        >
        <div className="scheduler_item">
        {/* <div className="radio-day"> */}

        <div className="radio-day">
        <input
          id={`Type_scheduler_input_0`}
          name="type"
          type="radio"
          value={0} // 0, 1, 2, ..., 6
          checked={schedulerBlocksState.type === 0} // ← важно!
          onChange={(e) => {
            handleRadioChange(e);
            handleClick_save(e);
          }}
        />
        </div>

        <label htmlFor={`type_scheduler_0`} className="radio-day-label">
        По расписанию
        </label>
        </div>
        
        <div className="scheduler_item">
        <div className="radio-day">
          <input
            id={`Type_scheduler_input_1`}
            name="type"
            type="radio"
            value={1} // 0, 1, 2, ..., 6
            checked={schedulerBlocksState.type === 1} // ← важно!
            onChange={(e) => {
              handleRadioChange(e);
              handleClick_save(e);
            }}
          />        
         </div>
          <label htmlFor={`type_scheduler_1`} className="radio-day-label">
          Ежедневно
          </label> 
          </div>
      </li>




      {/* Передаем состояние и функцию обновления в дочерние компоненты */}
      <Slave_scheduler_block 
        header="ВКЛЮЧЕНИЕ"
        blockType="power_on"
        state={schedulerBlocksState.power_on}
        updateState={(updates) => updateBlockState('power_on', updates)}
        isDisabled={schedulerBlocksState.type === 0}
        type={schedulerBlocksState.type === 0}
        // isDisabled={false}
        // type={true}
      />
      
      <Slave_scheduler_block 
        header="ВЫКЛЮЧЕНИЕ"
        blockType="power_off"
        state={schedulerBlocksState.power_off}
        updateState={(updates) => updateBlockState('power_off', updates)}
        isDisabled={schedulerBlocksState.type === 0}
        // isDisabled={false}
        // type={false}
        type={schedulerBlocksState.type === 0}
      />
    
    </SettingsBlockWrap>
  )
}