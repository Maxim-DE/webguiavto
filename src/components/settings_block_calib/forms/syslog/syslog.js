import React from 'react'
import { log_status } from '../syslog_calib'

import { PulseLoader } from 'react-spinners';

import { TbPlus } from 'react-icons/tb'
import { TbMinus } from 'react-icons/tb'

export default function Syslog_wrap(props) {
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const request_obj = {
      address: 'SysLog.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)

    setIsLoading(true)
  }, [])

  React.useEffect(() => {
    console.log(props.logs_list);
    if (props.logs_list.length > 0) {
      setIsLoading(false)
    }

  }, [props.logs_list])

  if (isLoading) {
    return (
      <div className='hex_upload_message_wrap'>
        <PulseLoader
          color="#bbcacf"
          loading
          margin={9}
          size={13}
          speedMultiplier={0.5}
        />
        <span className='hex_upload_upload_message'>
          Идет получение данных журнала... При долгой загрузке нажмите на вкладку с нужным журналом еще раз.
        </span>

      </div>
    )
  } else {
    return (
      <>
      <div className="logs_header">
        <span className="header_num">№</span>
        <span className="header_message">сообщение</span>
        <span className="header_time">дата и время</span>
      </div>
      <ul className="log_list">
        {props.logs_list.map((item, index) => (
          <>
            <div className='log_divider'></div>
            <li
              key={item.id}
              id={`log_${item.id}`}
              className={`log_item ${log_status[item.status]} syslog_item`}>
              <div className='log_expand_button_wrap'>
                {item.log_expand !== 'none' && 
                  <button
                    className='log_expand_button'
                    type='button'
                    onClick={(e) => {
                      props.logs_expand(index, item.id)
                  }}>
                    {item.log_expand ? <TbMinus /> :
                                       <TbPlus />
                                       }
                    
                  </button>
                }
              </div>
              <span className="log_num">{item.id}</span>
              <span className="log_message">{item.message}</span>
              <span className="log_time">{item.time}</span>
            </li>
            {item.log_expand === true && 
            //  item.log_expand_data !== 'none' &&
              <div
                className='log_expand_message'>
                {item.log_expand_data !== 'none' ? 
                
                  item.log_expand_data :
                  <PulseLoader
                    color="#bbcacf"
                    loading
                    margin={9}
                    size={13}
                    speedMultiplier={0.5}
                  />
                }
              </div>
            }
          </>
        ))}
      </ul>
      </>
    )
  }

}
