import React from 'react';
import { MdMemory } from "react-icons/md";

import Pie from '../circle_indicator'

import './index.css'
import InputTooltip from '../form_input/tooltip_component';
import { Tooltip } from 'react-tooltip';

const translation_dict = {
  'pout': 'Вых. мощ., Вт',
  'swr': 'КСВ',
  'voltage': 'Напряж., В'
}


function PeripheralMenu(props) {
  const [peripheralData, setPeripheralData] = React.useState({
    structure: [],
    data: {},
    time: '2001-01-01 00:00:00'
  })

  // React.useEffect(() => {
  //   let request_obj = {
  //     address: 'peripheral_structure.cgi',
  //   }

  //   props.updateHandler(request_obj)
  // }, [])

  // React.useEffect(() => {
  //   if (props.structure.length > 0) {
  //     setPeripheralData(prevState => ({
  //       ...prevState,
  //       structure: props.structure
  //     }))
  //   }
  // }, [props.structure])

  React.useEffect(() => {
    if (props.data.status_info == null) {
      return
    }

    setPeripheralData(prevState => ({
      ...prevState,
      time: props.data.status_info.time
    }))
  }, [props.data.status_info])

  React.useEffect(() => {
    if (props.data.status_peripheral == null) {
      return
    }

    let peripheral_data_obj = {}

    for (const key in props.data.status_peripheral) {
      let data_arr = []

      const input_value = props.data.status_peripheral[key][0],
            divider = props.data.status_peripheral[key][1] != 0 ? 
                      props.data.status_peripheral[key][1] : 1,
            status = props.data.status_peripheral[key][2],
            postfix = props.data.status_peripheral[key][3] ? 
                      ' ' + props.data.status_peripheral[key][3] :
                      ''
      data_arr[0] = (input_value / divider).toFixed(1)
      data_arr[1] = status
      peripheral_data_obj[key] = data_arr
    }

    setPeripheralData(prevState => ({
      ...prevState,
      data: peripheral_data_obj
    }))
  }, [props.data.status_peripheral])


  return (
    <div data-tooltip-id='peripheral_indicator_menu' className={`peripheral_container ${props.minimized && 'minimized'}`}>
      {!props.minimized &&
      <>
        <div className="peripheral_time">
          <span className='time_label'>Тек. время:</span>
          <span className="time_value">{peripheralData.time}</span>
        </div>
        <div className="peripheral_time">
          <span className='time_label'>Версия ПО:</span>
          <span className="time_value">{props.software_version ? props.software_version : '...'}</span>
        </div>
      </>
      }
      {!!props.minimized &&
      <>
        <Tooltip id="peripheral_indicator_menu" clickable={true}>
          <div className="peripheral_time">
            <span className='time_label'>Тек. время:</span>
            <span className="time_value">{peripheralData.time}</span>
          </div>
          <div className="peripheral_time">
            <span className='time_label'>Версия ПО:</span>
            <span className="time_value">{props.software_version ? props.software_version : '...'}</span>
          </div>
        </Tooltip>
        <MdMemory className='peripheral_info_icon' size={25} />
      </>
      }
    </div>
  )
}

export default PeripheralMenu;
