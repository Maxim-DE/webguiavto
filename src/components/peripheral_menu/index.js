import React from 'react';

import Pie from '../circle_indicator'

import './index.css'

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

  React.useEffect(() => {
    let request_obj = {
      address: 'peripheral_structure.cgi',
    }

    props.updateHandler(request_obj)
  }, [])

  React.useEffect(() => {
    if (props.structure.length > 0) {
      setPeripheralData(prevState => ({
        ...prevState,
        structure: props.structure
      }))
    }
  }, [props.structure])

  React.useEffect(() => {
    if (props.data.status_info == null) {
      return
    }

    setPeripheralData(prevState => ({
      ...prevState,
      time: props.data.status_info.time
    }))
  }, [props.data.status_info])


  return (
    <div className="peripheral_container">
      <div className="peripheral_time">
        <span className='time_label'>Тек. время:</span>
        <span className="time_value">{peripheralData.time}</span>
      </div>
      <div className="linear_indicatiors">
        {peripheralData.structure.length > 0 &&
         peripheralData.structure.map(item => {
          return (
            <Pie
              key={item.name} 
              min={0}
              max={200}
              value={''} 
              label={translation_dict[item.name]} />
          )
        })}
      </div>
    </div>
  )
}

export default PeripheralMenu;
