import React from 'react';
import ReactDOM from 'react-dom';

import FormInput from '../form_input';
import ModalCalib from '../calib_modal';
import time_ArrToStr from '../../logic/time_ArrToStr';

import './index.css'

const log_items = [
  {id: '0', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '1', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '2', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '3', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '4', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
  {id: '5', message: "Питание передатчика", time: "2022-03-17 13:16:28"},
]

const log_status = [
  '',
  'log_critical',
  'log_user',
  'log_hibernation'
]

function Status_logs({settings_type, data, full_data, className = "", ...rest}) {

  const [logData, setLogData] = React.useState([])
  const [fullLogData, setFullLogData] = React.useState([])

  const [isOpen, setIsOpen] = React.useState(false);
  
  function logArrToObj(data) {
    let logs_array = [];
    for (const log in data) {
      let log_obj = {};
      log_obj.id = data[log][0];
      log_obj.status = data[log][1];
      log_obj.message = data[log][2];
      log_obj.time = time_ArrToStr(data[log][3]);
      logs_array.push(log_obj);
    }
    return logs_array;
  }

  React.useEffect(() => {
    if (data != null && data.length != 0) {
      let logs_array = logArrToObj(data);

      setLogData(logs_array)
    }

  }, [data])

  React.useEffect(() => {
    if (full_data != null && full_data.length != 0) {
      let logs_array = logArrToObj(full_data);

      setFullLogData(logs_array)
    }

  }, [full_data])

  // React.useEffect(() => {

  //   if (data != null && Object.keys(data).length != 0) {
  //     let logs_array = []

  //     for (const log in data) {
  //       let log_obj = {}

  //       log_obj.id = log
  //       log_obj.message = data[log].message
  //       log_obj.time = data[log].time
  //       log_obj.status = data[log].status

  //       logs_array.push(log_obj)
  //     }

  //     setLogData(logs_array)
  //   }

  // }, [data])

  const refreshHandler = () => {
    setFullLogData([])
    getFullLog()
  }

  const getFullLog = () => {
    const request_obj = {
      address: 'GetLogErrorFull.cgi',
    }

    rest.updateHandler(request_obj)
  }

  return (
    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <div className="settings_container">
        <div className="settings_block_header">
          <h3>{rest.header}</h3>
        </div>
        <div className="logs_header">
          <span className="header_num">№</span>
          <span className="header_message">сообщение</span>
          <span className="header_time">дата и время</span>
        </div>
        {data != null ? 
          <>
          <ul className="log_list">
            {logData.map(item => (
              <>
              <div className='log_divider'></div>
              <li
              key={item.id}
                id={`log_${item.id}`}
                className={`log_item ${log_status[item.status]}`}>
                <span className="log_num">{item.id}</span>
                <span className="log_message">{item.message}</span>
                <span className="log_time">{item.time}</span>
              </li>
              </>
            ))}
          </ul>
          <FormInput
            id={`full_logs_button`}
            name={`full_logs_button`}
            clickHandler={(e) => {
              getFullLog();
              setIsOpen(true);
            }}
            class='log_refresh'
            label='Открыть полный журнал'
            type="button"
            />
          </>
          : 'ЗАГРУЗКА...'
        }
        {isOpen &&
          <ModalCalib
          header='полный журнал'
          setIsOpen={setIsOpen}
          class='full_log_modal'>
             <>
              <div className="logs_header">
                <span className="header_num">№</span>
                <span className="header_message">сообщение</span>
                <span className="header_time">дата и время</span>
              </div>
              <ul className="log_list">
                {fullLogData.map(item => (
                  <>
                  <div className='log_divider'></div>
                  <li
                    key={item.id}
                    id={`log_${item.id}`}
                    className={`log_item ${log_status[item.status]}`}>
                    <span className="log_num">{item.id}</span>
                    <span className="log_message">{item.message}</span>
                    <span className="log_time">{item.time}</span>
                  </li>
                  </>
                ))}
              </ul>
              <FormInput
                id={`calib_password_save`}
                name={`calib_password`}
                clickHandler={refreshHandler}
                class='log_refresh'
                label='Обновить журнал'
                type="button"
              />
             </>
            {/* {full_data != null &&
            } */}

            
          </ModalCalib>
         }
      </div>
    </div>
  )

}

export default Status_logs;
