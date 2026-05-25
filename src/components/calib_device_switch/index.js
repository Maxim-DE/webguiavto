import React from 'react'
import './index.css'

import { reducers } from '../../store/reducers/avr_control_reducers'

function CalibDeviceSwitch({ clickHandler, parent_state, state_handler, device_avaliability, settings_type, ...props }) {

  React.useEffect(() => {
    create_DeviceRequest(parent_state.active_device)
  }, [parent_state.active_device])

  const create_DeviceRequest = (device_num) => {
    const request_obj = {
      address: `get_avr_device_info.cgi`,
      data: `avr_device$${Number(device_num)};`,
      reducer: reducers.get_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }

  return 
}

export default CalibDeviceSwitch