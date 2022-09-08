import React from 'react';
import ReactDOM from 'react-dom';

import Pie from '../circle_indicator'

import './index.css'



function PeripheralMenu(props) {
  const [peripheral_data, setPeripheralData] = React.useState({
    data: {},
  })

  React.useEffect(() => {
    let request_obj = {
      name: 'peripheral_data',
    }

    let peripheral_timer = setInterval(() => {
      props.updateHandler(request_obj)
    }, 8000)

  }, [])


  return (
    <div className="peripheral_container">
      <div className="peripheral_time">
        <span className='time_label'>Тек. время:</span>
        <span className="time_value">2022-03-21 13:13:46</span>
      </div>
      <div className="linear_indicatiors">
        <Pie percentage={23} value={106.4} label='Частота, МГц'/>
        <Pie percentage={20} value={106.4} label='Частота, МГц' />
        <Pie percentage={23} value={106.4} label='Частота, МГц' />
        <Pie percentage={23} value={106.4} label='Частота, МГц' />
      </div>
    </div>
  )
}

export default PeripheralMenu;
