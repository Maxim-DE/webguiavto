import React from 'react'
import './index.css'
import { FaAngleDown } from 'react-icons/fa'

import { new_status_colors } from '../graph_blocks'

const info_data_mock = {
  "power": [
    {
      "name": "Pout",
      "value": 0,
      "status": 1,
      "divider": 1,
      "adc": 3678
    },
    {
      "name": "Pref",
      "value": 0,
      "status": 2,
      "divider": 1,
      "units": "Вт"
    },
  ]
}

export const NavInfoMenu = ({ info_data, ...rest }) => {
  const info_rows_ref = React.useRef([])

  React.useEffect(() => {
    if (info_data && Object.keys(info_data).length > 0) {
      for (const key in info_data) {
        info_rows_ref.current.push(<NavInfoRow name={key} key_info={info_data[key]} key={key} />)
      }
    }

    return () => {
      info_rows_ref.current.length = 0
    }
  }, [info_data])

  // for (const key in info_data_mock) {
  //   info_rows.push(<NavInfoRow name={key} key_info={info_data_mock[key]} />)
  // }
  
  if (info_data && Object.keys(info_data).length > 0) {
    return (
      <div className='nav_info_wrap'>
        {info_rows_ref.current}
      </div>
    )
  } else {
    return (
      <div className='nav_info_wrap'>
        нет данных для отображения
      </div>
    )
  }
}

const NavInfoRow = ({name, key_info, ...rest }) => {
  const [isExpanded, setIsExpanded] = React.useState(1)

  return (
    <div className="nav_info_item_wrap">
      <div 
        className="info_item_label"
        onClick={(e) => {
          setIsExpanded(!isExpanded)
        }}>
        <span className="info_item_name">{name}</span>
        <div
          className={`info_item_expand_svg_wrap ${isExpanded && 'expanded'}`} 
          type="button">
          <FaAngleDown className='expand_arrow' size={25} />
        </div>
      </div>
      {!!isExpanded && 
        <div className="info_item_content">
          <ul className="info_content_list">
            {key_info.map((info_data, index) => {
              const info_instance_data = info_data,
                    info_instance_round_index = info_instance_data?.divider ?
                      Math.log10(info_instance_data?.divider) :
                      0,
                    info_instance_value = info_instance_data?.divider ? 
                      (info_instance_data.value / info_instance_data.divider).toFixed(info_instance_round_index) :
                      info_instance_data.value,
                    info_instance_adc = info_instance_data?.adc ? 
                      `/ ${info_instance_data.adc}` :
                      '',
                    info_instance_units = info_instance_data?.units ?
                      ` ${info_instance_data.units} ` :
                      '',
                info_instance_status_color = info_instance_data.status != undefined && new_status_colors[info_instance_data.status] != undefined ? 
                  new_status_colors[info_instance_data.status] : 
                  "transparent"

              const displayed_value = `${info_instance_value}${info_instance_units}${info_instance_adc}`

              return (
              <li className="info_content_item" key={index}>
                <div className="info_content_item_label">
                  <div className="info_item_indicator" style={{
                    "backgroundColor": info_instance_status_color
                  }}></div>
                  <span className="item_label_name">
                    {info_instance_data.name}: 
                  </span>
                </div>
                <span className="item_value">
                  {displayed_value}
                </span>
              </li>
              )
            })}
          </ul>
        </div>
      }
    </div>
  )
}
