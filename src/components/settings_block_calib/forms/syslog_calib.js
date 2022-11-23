import React from 'react'

import FormInput from '../../form_input'
import ModalCalib from '../../calib_modal'
import time_ArrToStr from '../../../logic/time_ArrToStr'
import '../../status_logs_block/index.css'

import { BsChevronDoubleLeft, BsChevronLeft,
         BsChevronRight, BsChevronDoubleRight } from 'react-icons/bs'

import '../index.css'

const log_status = [
  '',
  'log_critical',
  'log_user',
  'log_hibernation'
]

function Syslog_calib(props) {

  const [isOpen, setIsOpen] = React.useState(false);

  const [sysLogLinks, setSysLogLinks] = React.useState({
    max_msgs: 0,
    active_page: 1,
    active_page_logs: [],
    max_active_logs: 13,
    max_pages: 0,
    max_links: 5,
    links: [],
    log_data: []
  });

  const active_link_ref = React.useRef(null)

  React.useEffect(() => {

    if (!Array.isArray(props.logData.SysLog)) {
      return
    }

    const logData = props.logData.SysLog,
          maxMsg = logData.length

    setSysLogLinks(prevState => ({
     ...prevState,
     max_msgs: maxMsg,
     log_data: logData,
    }))
    
  }, [props.logData])


  React.useEffect(() => {

    const max_msgs = sysLogLinks.max_msgs,
          max_active_logs = sysLogLinks.max_active_logs,
          max_pages = Math.ceil(max_msgs / max_active_logs),
          active_page = sysLogLinks.log_data.length == 0 ? 0 : 1

    setSysLogLinks(prevState => ({
      ...prevState,
      active_page: active_page,
      max_pages: max_pages
    }))

  }, [sysLogLinks.log_data])


  React.useEffect(() => {

    if (sysLogLinks.log_data.length == 0) {
      setSysLogLinks(prevState => ({
        ...prevState,
        active_page_logs: [],
        links: []
      }))

      return
    }

    let new_links = [],
        active_page_logs = []

    if (sysLogLinks.active_page < sysLogLinks.max_links) {

      for (let index = 1; index < sysLogLinks.max_links + 1; index++) {
        const link_obj = {
          index: index,
          active: index == sysLogLinks.active_page ? true : false
        }

        new_links.push(link_obj)
      }

    } else if (sysLogLinks.active_page > (sysLogLinks.max_pages - sysLogLinks.max_links - 1)) {
      let active_page_location,
        low_links_border,
        high_links_border

      low_links_border = sysLogLinks.max_pages - sysLogLinks.max_links
      high_links_border = sysLogLinks.max_pages

      for (let index = low_links_border; index < high_links_border + 1; index++) {
        const link_obj = {
          index: index,
          active: index == sysLogLinks.active_page ? true : false
        }

        new_links.push(link_obj)
      }
    } else {
      let active_page_location,
          low_links_border,
          high_links_border

      if (sysLogLinks.max_links % 2 == 0) {
        active_page_location = (sysLogLinks.max_links / 2) + 1
      } else {
        active_page_location = Math.ceil(sysLogLinks.max_links / 2)
      }

      low_links_border = sysLogLinks.active_page - (active_page_location - 1)
      high_links_border = sysLogLinks.active_page + sysLogLinks.max_links - active_page_location
      
      for (let index = low_links_border; index < high_links_border + 1; index++) {
        const link_obj = {
          index: index,
          active: index == sysLogLinks.active_page ? true : false
        }

        new_links.push(link_obj)
      }
    }

    let low_active_logs_border,
        high_active_logs_border

    if (sysLogLinks.active_page == 1) {
      low_active_logs_border = 0
      high_active_logs_border = sysLogLinks.max_active_logs
    } else if (sysLogLinks.active_page == sysLogLinks.max_pages) {
      low_active_logs_border = ((sysLogLinks.active_page - 1) * sysLogLinks.max_active_logs)
      high_active_logs_border = low_active_logs_border + (sysLogLinks.max_msgs - low_active_logs_border)
    } else {
      low_active_logs_border = ((sysLogLinks.active_page - 1) * sysLogLinks.max_active_logs) 
      high_active_logs_border = low_active_logs_border + sysLogLinks.max_active_logs
    }

    for (let log = low_active_logs_border; log < high_active_logs_border; log++) {

      let active_log_data = sysLogLinks.log_data[log]
      let active_log_instance = {
        id: active_log_data[0],
        message: active_log_data[3],
        status: active_log_data[1],
        time: time_ArrToStr(active_log_data[2]) 
      }


      active_page_logs.push(active_log_instance)
    }
    
    setSysLogLinks(prevState => ({
      ...prevState,
      active_page_logs: active_page_logs,
      links: new_links
    }))
    
  }, [sysLogLinks.active_page])



  const handleClick_open = () => {
    setIsOpen(true)
    handleSysLogRequest()
  }
  
  const handleSysLogRequest = () => {
    const request_obj = {
      address: 'SysLog.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)
  }

  const handleModalClose = (event) => {
    
    setSysLogLinks(prevState => ({
      ...prevState,
      max_msgs: 0,
      log_data: [],
    }))

    setIsOpen(false)
  }

  const link_handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const target = event.target
    const link = target.name.replace('sys_log_link_', '')

    let new_link = 0

    switch (link) {
      case 'plus':
        new_link = sysLogLinks.active_page + 1
        break;

      case 'minus':
        new_link = sysLogLinks.active_page - 1
        break;
    
      default:
        new_link = Number(link)
        break;
    }
  
    setSysLogLinks(prevState => ({
      ...prevState,
      active_page: new_link
    }))
  }

  const delete_handleClick = (event) => {
    const name = 'delete_sys_logs',
          value = 1

    const request_obj = {
      address: 'calib_misc.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)

    setSysLogLinks(prevState => ({
      ...prevState,
      max_msgs: 0,
      log_data: [],
    }))
    
    setIsOpen(false)

  }



  return (
    <>
    <li
      key='sys_logs_calib'
      id='sys_logs_calib'
      className="settings_item">
      <div className='item_header'>
        <label
          htmlFor={`sys_logs_calib_input`}
          className="settings_itemLabel">
          Cистемный журнал
        </label>
      </div>
      <div className='item_input'>
        <FormInput
          id={`sys_logs_calib_input`}
          name={`sys_logs_calib`}
          clickHandler={handleClick_open}
          label='Открыть'
          type="button" />
      </div>
    </li>
    {isOpen &&
      <ModalCalib
        header='системный журнал'
        setIsOpen={handleModalClose}
        user_controllable={true}
        class='full_log_modal sys_log_modal'>
        <>
          <div className="logs_header">
            <span className="header_num">№</span>
            <span className="header_message">сообщение</span>
            <span className="header_time">дата и время</span>
          </div>
          <ul className="log_list">
            {sysLogLinks.active_page_logs.map(item => (
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
          <div className="modal_footer sys_log_buttons">
            {sysLogLinks.max_pages != 0 && 
              <div className="sys_log_links">
                {sysLogLinks.active_page > 1 &&
                <>
                  <button
                    className='button_input plus_minus'
                    name={`sys_log_link_1`}
                    onClick={link_handleClick}
                  >
                    <BsChevronDoubleLeft />
                  </button>
                  <button
                    className='button_input plus_minus'
                    name={`sys_log_link_minus`}
                    onClick={link_handleClick}
                  >
                    <BsChevronLeft />
                  </button>
                </>
                }
                {sysLogLinks.links.map(link => {
                  return (
                    <button
                      key={link.index}
                      className={`button_input plus_minus ${link.active == true ? 'active_link' : ''}`}
                      name={`sys_log_link_${link.index}`}
                      onClick={link_handleClick}
                    >
                      {link.index}
                    </button>
                  )
                }
                )}
                {sysLogLinks.active_page < sysLogLinks.max_pages &&
                <>
                  <button
                    className='button_input plus_minus'
                    name={`sys_log_link_plus`}
                    onClick={link_handleClick}
                  >
                    <BsChevronRight />
                  </button>
                  <button
                    className='button_input plus_minus'
                    name={`sys_log_link_${sysLogLinks.max_pages}`}
                    onClick={link_handleClick}
                  >
                    <BsChevronDoubleRight />
                  </button>
                </>
                }
              </div>
            }
            <div className='sys_log_buttons'>
              <FormInput
                id={`delete_sys_logs_input`}
                name={`delete_sys_logs`}
                clickHandler={delete_handleClick}
                // class='log_refresh'
                label='Очистить журнал'
                type="button" />
                <a href="http://192.168.1.114/SysLog.bin" download>
                <FormInput
                  id={`calib_password_save`}
                  name={`calib_password`}
                  // clickHandler={refreshHandler}
                  // class='log_refresh'
                  label='Скачать журнал'
                  type="button" />
              </a>
            </div>
          </div>
        </>
      </ModalCalib>
    }
        
    {/* <li
      key='delete_sys_logs_calib'
      id='delete_sys_logs_calib'
      className="settings_item">
      <div className='item_header'>
        <label
          htmlFor={`delete_sys_logs_calib_input`}
          className="settings_itemLabel">
          Удалить системный журнал
        </label>
      </div>
      <div className='item_input'>
        <FormInput
          id={`delete_sys_logs_calib_save`}
          name={`delete_sys_logs_calib_calib`}
          // clickHandler={handleClick_save}
          label='Удалить'
          type="button" />
      </div>
    </li> */}
    </>
  )
}

export default Syslog_calib