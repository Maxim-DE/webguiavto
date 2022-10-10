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


  return (
    <div className="peripheral_container">
      <div className="peripheral_time">
        <span className='time_label'>Тек. время:</span>
        <span className="time_value">2022-03-21 13:13:46</span>
      </div>
      <div className="linear_indicatiors">
        {peripheralData.structure.length > 0 &&
         peripheralData.structure.map(item => {
          return (
            <Pie
              key={item.name} 
              min={item.min}
              max={item.max}
              value={''} 
              label={translation_dict[item.name]} />
          )
        })}
      </div>
    </div>
  )
}

export default PeripheralMenu;
