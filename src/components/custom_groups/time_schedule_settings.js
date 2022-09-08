import React from 'react';

import FormInput from '../form_input';
import '../form_input/index.css';

function time_schedule_settings(form_handler, block_state, group_id, group_name) {

  const work_days = [
    {day: 'mon', trans: 'Пн.'},
    {day: 'tue', trans: 'Вт.'},
    {day: 'wed', trans: 'Ср.'},
    {day: 'thu', trans: 'Чт.'},
    {day: 'fri', trans: 'Пт.'},
    {day: 'sat', trans: 'Сб.'},
    {day: 'sun', trans: 'Вс.'}
]

  return (
    <>
      <li 
        key={group_id}
        id={group_id}
        className="settings_item group_divider">
        <label
          htmlFor={`${group_id}_input`}
          className="settings_itemLabel">
          {group_name}
        </label>
        <FormInput
          id={`${group_id}_input`}
          name={`${group_id}_switch`}
          input_value={
            block_state ?
            block_state.supply_schedule_switch :
            false
          }
          type="switch"
          changeHandler={form_handler} />
      </li>
      {block_state.supply_schedule_switch == true &&
      <>
        <li
          key='time_schedule_repetition'
          id='time_schedule_repetition'
          className="settings_item">
          <label
            htmlFor={`time_schedule_repetition_input`}
            className="settings_itemLabel">
            Повтор
          </label>
          <FormInput
            id={`time_schedule_repetition_input`}
            name={`time_schedule_repetition`}
            type="select"
            changeHandler={form_handler}
            input_value={block_state.time_schedule_repetition}
            variants={[
              'Ежедневно',
              'Выбрать дни...'
            ]} />
        </li>
        {block_state.time_schedule_repetition == 1 &&
          <li
            key='time_schedule_work_days'
            id='time_schedule_work_days'
            className="settings_item">
            {work_days.map(item => {
              return (
                <div
                  className='work_day_checkbox_container'>
                  <FormInput
                    id={`time_schedule_${item.day}_on_input`}
                    name={`time_schedule_${item.day}_on`}
                    type="checkbox"
                    input_value={
                      block_state[`time_schedule_${item.day}_on`] ?
                      block_state[`time_schedule_${item.day}_on`] :
                      false
                    }
                    changeHandler={form_handler} />
                    <span className='work_day_span'>{item.trans}</span>
                </div>
              )
            })}
          </li>
        }
      </>
      }
    </>
  )
}

export default time_schedule_settings;