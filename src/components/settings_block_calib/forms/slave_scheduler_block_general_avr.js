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


export default function Slave_scheduler_block_general_AVR({ 
  calib_state, 
  clickHandler,
  blockType = "power_on",  // изменено с "on" на "power_on"
  state = {},              // state это {day, hour, min}
  updateState, 
  ...props 
}) {
  
  const ScheduleBlock = { 
    days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    showTime: true
  };

  // Получаем префикс для id из blockType
  const prefix = blockType === "power_on" ? "on" : "off";
  
  // Преобразуем день из формата 1-7 в индекс массива 0-6
  const dayNumberToIndex = (dayNumber) => {
    if (dayNumber === 0) return -1;
    return dayNumber >= 1 && dayNumber <= 7 ? dayNumber - 1 : dayNumber;
  };

  // Преобразуем индекс массива 0-6 в формат 1-7
  const indexToDayNumber = (index) => {
    return index + 1;
  };

  const handleDayChange = (event) => {
    // if (props.isDisabled) return; // ← блокируем при disabled
    const selectedIndex = parseInt(event.target.value, 10); // 0, 1, 2, ..., 6
    const dayNumber = indexToDayNumber(selectedIndex); // 1, 2, 3, ..., 7
    
    // Обновляем только день
    updateState({
      day: dayNumber
    });
  };  

  const handleTimeChange = (event) => {
    const [hour, minute] = event.target.value.split(':');
    
    // Обновляем час и минуту
    updateState({
      hour: parseInt(hour, 10),
      min: parseInt(minute, 10)
    });
  };

  // Получаем текущий выбранный день (от 0 до 6 для радио-кнопок)
  const currentDayIndex = dayNumberToIndex(state.day);
  
  // Формируем время в формате "HH:MM" из hour и min
  const currentTime = `${String(state.hour || 0).padStart(2, '0')}:${String(state.min || 0).padStart(2, '0')}`;





  return (
    <div className="schedule-block">
      <div className="block-title">{props.header}</div>


 
      {props.type == 1 &&(
      <div className="days-row">
        {ScheduleBlock.days.map((day, index) => (
          <span key={`day-${index}`} className="day-label">
            {day}
          </span>
        ))}
      </div>
      )}
      
      {props.type == 1 &&(
      <div className="radio-days-row">
        {ScheduleBlock.days.map((dayLabel, index) => (
          <div key={`${prefix}_day_${index}`} className="radio-day">
            <input
              id={`${prefix}_day_${index}_radio`}
              name={`${prefix}_day_radio`}
              type="radio"
              value={index} // 0, 1, 2, ..., 6
              checked={currentDayIndex !== -1 && currentDayIndex === index}
              onChange={handleDayChange}
            //   disabled={props.isDisabled}
            />

          </div>
        ))}
      </div>
      )}
      
      
      {ScheduleBlock.showTime && (
        <div className="time-input">
          <label>Время:</label>
          <input 
            type="time" 
            value={currentTime}
            onChange={handleTimeChange}
          />
        </div>
      )}
    </div>
  )
}


// export default function Slave_scheduler_block_general_AVR({ calib_state, clickHandler,blockType = "on",state = {},updateState, ...props }) {
  
//     const ScheduleBlock = { 
//         // title: title,
//         days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
//         checkedDays: [], // массив индексов отмеченных дней [0, 2, 4]
//         timeValue: "00:00",
//         showTime: true
//     };


// //   const {isFormValid, validStatus_getter} = useFormValidation()
//     const state_prev_copy = React.useRef(null)
//     const prefix = blockType; // "on" или "off"

//     // Преобразуем день из формата 1-7 в индекс массива 0-6
//     const dayNumberToIndex = (dayNumber) => {
//         // Если день приходит как 1-7, преобразуем в 0-6
//         // Если 0-6, оставляем как есть
//         return dayNumber >= 1 && dayNumber <= 7 ? dayNumber - 1 : dayNumber;
//     };

//     // Преобразуем индекс массива 0-6 в формат 1-7
//     const indexToDayNumber = (index) => {
//         // Преобразуем 0-6 в 1-7
//         return index + 1;
//     };

//     const handleDayChange = (event) => {
//         const selectedIndex = parseInt(event.target.value, 10); // 0, 1, 2, ..., 6
//         const dayNumber = indexToDayNumber(selectedIndex); // 1, 2, 3, ..., 7
        
//         updateState({
//         [`${prefix}_day`]: dayNumber
//         });
//     };  

//     const handleTimeChange = (event) => {
//         const value = event.target.value;
//         updateState({
//         [`${prefix}_time`]: value
//         });
//     };

// // Получаем текущий выбранный день (от 0 до 6 для радио-кнопок)
//   const currentDayIndex = dayNumberToIndex(state[`${prefix}_day`] || 1);

//   return (
//     <div className="schedule-block">
//       <div className="block-title">{props.header}</div>

//       {/* Формируем подпись ПН. ВТ. ... */}
//       <div className="days-row">
//         {ScheduleBlock.days.map((day, index) => (
//           <span key={`day-${index}`} className="day-label">
//             {day}
//           </span>
//         ))}
//       </div>

//       {/* Радио-кнопки для выбора дня недели */}
//       <div className="radio-days-row">
//         {ScheduleBlock.days.map((dayLabel, index) => (
//           <div key={`${prefix}_day_${index}`} className="radio-day">
//             {/* Используем нативный input, т.к. FormInput не поддерживает radio */}
//             <input
//               id={`${prefix}_day_${index}_radio`}
//               name={`${prefix}_day_radio`}
//               type="radio"
//               value={index} // 0, 1, 2, ..., 6
//               checked={currentDayIndex === index}
//               onChange={handleDayChange}
//             />
//             {/* Опционально: подпись под радио-кнопкой */}
//             <label 
//               htmlFor={`${prefix}_day_${index}_radio`} 
//               className="radio-day-label"
//               title={dayLabel}
//             >
//               {/* {dayLabel.substring(0, 1)} */}
//             </label>
//           </div>
//         ))}
//       </div>
      
//       {ScheduleBlock.showTime && (
//         <div className="time-input">
//           <label>Время:</label>
//           <input 
//             type="time" 
//             value={state[`${prefix}_time`] || "00:00"}
//             onChange={handleTimeChange}
//           />
//         </div>
//       )}
//     </div>
//   )
// }   