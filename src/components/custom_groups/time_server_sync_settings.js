import React from 'react'

import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import FormInput from '../form_input'
import '../form_input/index.css'
import '../settings_block/index.css'

function Time_server_sync_settings({ parent_state, state_handler, ...rest }) {
  const base_state = {
    time_sync_switch: false,
    time_sync_server_ip: '',
    time_sync_timezone: 0,
    time_sync_period: ''
  }

  const [timeSyncState, setTimeSyncState] = React.useState({
    time_sync_switch: false,
    time_sync_server_ip: '',
    time_sync_timezone: 0,
    time_sync_period: ''
  })

  React.useEffect(() => {
    const state_ref = clone(timeSyncState)
    const state_clone = {
      time_sync: state_ref
    }

    state_handler(state_clone)
  }, [])

  React.useEffect(() => {
    const state_ref = clone(timeSyncState)
    const state_clone = {
      time_sync: state_ref
    }

    state_handler(state_clone)
  }, [timeSyncState])

  React.useEffect(() => {
    if (!Object.hasOwn(parent_state, 'time_sync')) return

    if (isEqual(parent_state.time_sync, timeSyncState)) return

    setTimeSyncState(
      parent_state.time_sync
    )
  }, [parent_state])

  const changeHandler = (event) => {
    const target = event.target,
      name = target.name,
      value = target.type === 'checkbox' ? target.checked : target.value

    setTimeSyncState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const resetHandler = (event) => {
    if (!event.target.checked) {
      setTimeSyncState(base_state)
    }
  }

  return (
    <>
      <li
        key='time_sync_settings'
        id='time_sync_settings'
        className="settings_item group_divider">
        <label
          htmlFor={`time_sync_input`}
          className="settings_itemLabel">
          Синхронизация сервера с сервером
        </label>
        <FormInput
          id={`time_sync_input`}
          name={`time_sync_switch`}
          input_value={timeSyncState.time_sync_switch}
          type="switch"
          changeHandler={(e) => {
            changeHandler(e);
            resetHandler(e);
            }} />
      </li>
      {timeSyncState.time_sync_switch == true &&
        <>
          <li
            key='time_sync_server_ip'
            id='time_sync_server_ip'
            className="settings_item">
            <label
              htmlFor={`time_sync_server_ip_input`}
              className="settings_itemLabel">
              IP сервера
            </label>
            <FormInput
              id={`time_sync_server_ip_input`}
              name={`time_sync_server_ip`}
              type="text"
              changeHandler={changeHandler}
              input_value={timeSyncState.time_sync_server_ip} />
          </li>
          <li
            key='time_sync_timezone'
            id='time_sync_timezone'
            className="settings_item">
            <label
              htmlFor={`time_sync_timezone_input`}
              className="settings_itemLabel">
              Часовой пояс
            </label>
            <FormInput
              id={`time_sync_timezone_input`}
              name={`time_sync_timezone`}
              type="select"
              changeHandler={changeHandler}
              input_value={timeSyncState.time_sync_timezone}
              variants={[
                '-12',
                '-11',
                '-10',
                '-9',
                '-8',
                '-7',
                '-6',
                '-5',
                '-4',
                '-3',
                '-2',
                '-1',
                '0',
                '+1',
                '+2',
                '+3',
                '+4',
                '+5',
                '+6',
                '+7',
                '+8',
                '+9',
                '+10',
                '+11',
                '+12',
              ]} />
          </li>
          <li
            key='time_sync_period'
            id='time_sync_period'
            className="settings_item">
            <label
              htmlFor={`time_sync_period_input`}
              className="settings_itemLabel">
              Период синхронизации, ч
            </label>
            <FormInput
              id={`time_sync_period_input`}
              name={`time_sync_period`}
              type="text"
              changeHandler={changeHandler}
              input_value={timeSyncState.time_sync_period} />
          </li>
        </>
      }
    </>
  )
}

export default Time_server_sync_settings
