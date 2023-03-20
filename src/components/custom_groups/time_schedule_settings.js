import React from 'react';

import _ from 'lodash';
import clone from 'lodash/clone';

import FormInput from '../form_input';
import '../form_input/index.css';

function Time_schedule_settings({parent_state, state_handler, ...rest}) {

  const base_state = {
    supply_schedule_switch: false,
    supply_schedule_from: '',
    supply_schedule_to: '',
    time_schedule_repetition: false,
    time_schedule_mon_on: false,
    time_schedule_tue_on: false,
    time_schedule_wed_on: false,
    time_schedule_thu_on: false,
    time_schedule_fri_on: false,
    time_schedule_sat_on: false,
    time_schedule_sun_on: false
  }

  const [timeShcheduleState, setTimeShcheduleState] = React.useState({
    supply_schedule_switch: false,
    supply_schedule_from: '',
    supply_schedule_to: '',
    time_schedule_repetition: false,
    time_schedule_mon_on: false,
    time_schedule_tue_on: false,
    time_schedule_wed_on: false,
    time_schedule_thu_on: false,
    time_schedule_fri_on: false,
    time_schedule_sat_on: false,
    time_schedule_sun_on: false
  })

  React.useEffect(() => {
    const state_clone = {
      time_schedule: clone(timeShcheduleState)
    }

    state_handler(state_clone)
  }, [])

  React.useEffect(() => {
    const state_clone = {
      time_schedule: clone(timeShcheduleState)
    }

    state_handler(state_clone)
  }, [timeShcheduleState])

  React.useEffect(() => {
    if (!Object.hasOwn(parent_state, 'time_schedule')) return

    if (_.isEqual(parent_state.time_schedule, timeShcheduleState)) return

    setTimeShcheduleState(
      parent_state.time_schedule
    )
  }, [parent_state])

  const changeHandler = (event) => {
    const target = event.target,
          name = target.name,
          value = target.type === 'checkbox' ? target.checked : target.value

    setTimeShcheduleState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const resetHandler = (event) => {
    if (!event.target.checked) {
      setTimeShcheduleState(base_state)
    }
  }

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
        key='time_shedule_settings'
        id='time_shedule_settings'
        className="settings_item">
        <label
          htmlFor={`time_shedule_settings_input`}
          className="settings_itemLabel">
          Расписание работы
        </label>
        <FormInput
          id={`supply_schedule_switch_input`}
          name={`supply_schedule_switch`}
          input_value={timeShcheduleState.supply_schedule_switch}
          type="switch"
          changeHandler={(e) => {
            changeHandler(e);
            resetHandler(e)
            }} />
      </li>
      {timeShcheduleState.supply_schedule_switch == true &&
      <>
        <li
          key='time_schedule'
          id='time_schedule'
          className="settings_item">
          <label
            htmlFor={`time_schedule_from`}
            className="settings_itemLabel">
            Период работы
          </label>
          <div
            className="text_range_container">
            <span>от</span>
            <input
              type="text"
              name='supply_schedule_from'
              className="text_range"
              data-threshold="low"
              value={timeShcheduleState.supply_schedule_from}
              onChange={changeHandler}
            />
            <span>до</span>
            <input
              type="text"
              name='supply_schedule_to'
              className="text_range"
              data-threshold="high"
              value={timeShcheduleState.supply_schedule_to}
              onChange={changeHandler}
            />
          </div>
        </li>
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
            changeHandler={changeHandler}
            input_value={timeShcheduleState.time_schedule_repetition}
            variants={[
              'Ежедневно',
              'Выбрать дни...'
            ]} />
        </li>
        {timeShcheduleState.time_schedule_repetition == 1 &&
          <li
            key='time_schedule_work_days'
            id='time_schedule_work_days'
            className="settings_item">
            {work_days.map(item => {
              return (
                <div
                  className='work_day_checkbox_container'
                  key={`time_schedule_${item.day}`}>
                  <FormInput
                    id={`time_schedule_${item.day}_on_input`}
                    name={`time_schedule_${item.day}_on`}
                    type="checkbox"
                    input_value={
                      timeShcheduleState[`time_schedule_${item.day}_on`] ?
                        timeShcheduleState[`time_schedule_${item.day}_on`] :
                      false
                    }
                    changeHandler={changeHandler} />
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

export default Time_schedule_settings;