import React from 'react'

import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import FormInput from '../form_input'
import '../form_input/index.css'
import '../settings_block/index.css'

import { filter_obj } from '../../logic/utilites'

const timezone_arr = [
  'UTC -12:00',
  'UTC -11:00',
  'UTC -10:00',
  'UTC -9:30',
  'UTC -9:00',
  'UTC -8:00',
  'UTC -7:00',
  'UTC -6:00',
  'UTC -5:00',
  'UTC -4:00',
  'UTC -3:30',
  'UTC -3:00',
  'UTC -2:00',
  'UTC -1:00',
  'UTC 0',
  'UTC 0',
  'UTC +1:00',
  'UTC +2:00 (МСК -1)',
  'UTC +3:00 (МСК)',
  'UTC +3:30',
  'UTC +4:00  (МСК+1)',
  'UTC +4:30',
  'UTC +5:00 (МСК+2)', 
  'UTC +5:30',
  'UTC +5:45',
  'UTC +6:00 (МСК+3)', 
  'UTC +6:30',
  'UTC +7:00 (МСК+4)', 
  'UTC +8:00 (МСК+5)', 
  'UTC +8:45',
  'UTC +9:00 (МСК+6)', 
  'UTC +9:30',
  'UTC +10:00 (МСК+7)', 
  'UTC +10:30',
  'UTC +11:00 (МСК+8)', 
  'UTC +12:00 (МСК+9)',
  'UTC +12:45',
  'UTC +13:00',
  'UTC +14:00'
]

function Time_server_sync_settings({ parent_state, state_handler, ...rest }) {
  const base_state = {
    time_sync_switch: false,
    ntp_server: '',
    time_sync_timezone: 0,
    time_sync_period: 0
  }

  const [timeSyncState, setTimeSyncState] = React.useState(base_state)

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
    console.log(parent_state)
    console.log(timeSyncState);
    if (!parent_state) return
    
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

  const handleClick_save = (event) => {
    console.log(rest)

    const target = event.target,
          name = target.name,
          value = 1

    const request_obj = {
      address: `sync_ntp_time_now.cgi`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    rest.clickHandler(request_obj);
  }

  const resetHandler = (event) => {
    if (!event.target.checked) {
      let state_to_restore,
          reset_state
      if (!Object.hasOwn(parent_state, 'time_sync')) {
        state_to_restore = filter_obj(base_state, (key, value) => !key.includes('switch'))
        setTimeSyncState(base_state)
      } else {
        state_to_restore = filter_obj(parent_state.time_sync, (key, value) => !key.includes('switch'))
      }

      reset_state = Object.assign(base_state, state_to_restore)
      
      setTimeSyncState(reset_state)
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
          Служба синхр. времени (NTP)
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
      {Boolean(timeSyncState.time_sync_switch) == true &&
        <>
          <li
            key='ntp_server'
            id='ntp_server'
            className="settings_item">
            <label
              htmlFor={`time_sync_server_ip_input`}
              className="settings_itemLabel">
              IP NTP-сервера
            </label>
            <FormInput
              id={`time_sync_server_ip_input`}
              name={`ntp_server`}
              type="text"
              changeHandler={changeHandler}
              input_value={timeSyncState.ntp_server} />
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
              variants={timezone_arr} />
          </li>
          <li
            key='time_sync_period'
            id='time_sync_period'
            className="settings_item">
            <label
              htmlFor={`time_sync_period_input`}
              className="settings_itemLabel">
              Период синхронизации, дни
            </label>
            <FormInput
              id={`time_sync_period_input`}
              name={`time_sync_period`}
              type="text"
              changeHandler={changeHandler}
              input_value={timeSyncState.time_sync_period} />
          </li>
          <li
            key='time_sync_now'
            id='time_sync_now'
            className="settings_item">
            <label
              htmlFor={`time_sync_now_input`}
              className="settings_itemLabel">
              Синхронизировать сейчас
            </label>
            <FormInput
              id={`time_sync_now_input`}
              name={`time_sync_now`}
              type="button"
              label="Синхронизировать"
              clickHandler={handleClick_save} />
          </li>
        </>
      }
    </>
  )
}

export default Time_server_sync_settings
