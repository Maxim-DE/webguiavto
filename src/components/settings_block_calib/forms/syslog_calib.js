import React from 'react'

import FormInput from '../../form_input'
import ModalCalib from '../../calib_modal'
import time_ArrToStr from '../../../logic/time_ArrToStr'
import '../../status_logs_block/index.css'

import Syslog_wrap from './syslog/syslog'
import HttpLog_wrap from './syslog/http_log'

import { BsChevronDoubleLeft, BsChevronLeft,
         BsChevronRight, BsChevronDoubleRight } from 'react-icons/bs'

import '../index.css'

export const log_status = [
  '',
  'log_critical',
  'log_user',
  'log_hibernation'
]

const sys_log_types = [
  {type: 'syslog', name: 'Cистемный'},
  {type: 'http_log', name: 'HTTP-жур.'}
]

function Syslog_calib(props) {

  const [isOpen, setIsOpen] = React.useState(false);

  const [logType, setLogType] = React.useState({
    log_type: 'syslog'
  })

  const [sysLogLinks, setSysLogLinks] = React.useState({
    max_msgs: 0,
    active_page: 1,
    active_page_logs: [],
    max_active_logs: 24,
    max_pages: 0,
    max_links: 5,
    links: [],
    log_data: []
  });

  const active_link_ref = React.useRef(null)

  React.useEffect(() => {

    if (!Array.isArray(props.logData)) {
      return
    }

    const logData = props.logData,
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
      let links_counter

      if (sysLogLinks.max_links > sysLogLinks.max_pages) {
        links_counter = sysLogLinks.max_pages
      } else {
        links_counter = sysLogLinks.max_links
      }

      for (let index = 1; index < links_counter + 1; index++) {
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
      if (sysLogLinks.log_data.length < sysLogLinks.max_active_logs) {
        high_active_logs_border = sysLogLinks.log_data.length
      } else {
        high_active_logs_border = sysLogLinks.max_active_logs
      }
    } else if (sysLogLinks.active_page == sysLogLinks.max_pages) {
      low_active_logs_border = ((sysLogLinks.active_page - 1) * sysLogLinks.max_active_logs)
      high_active_logs_border = low_active_logs_border + (sysLogLinks.max_msgs - low_active_logs_border)
    } else {
      low_active_logs_border = ((sysLogLinks.active_page - 1) * sysLogLinks.max_active_logs) 
      high_active_logs_border = low_active_logs_border + sysLogLinks.max_active_logs
    }

    for (let log = low_active_logs_border; log < high_active_logs_border; log++) {
      if (log > (sysLogLinks.log_data.length - 1)) return

      let active_log_data = sysLogLinks.log_data[log]
      let active_log_instance = {
        id: active_log_data[0],
        message: active_log_data[2],
        status: active_log_data[1],
        time: time_ArrToStr(active_log_data[3]),
        log_expand: active_log_data[4] == 1 ? false : 'none',
        log_expand_data: active_log_data[5] ? active_log_data[4] : 'none'
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
      address: 'GetLogErrorFull.cgi',
      data: 'syslog$1',
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

  const handle_logType_change = async (event) => {
    const target = event.target,
          name = target.name

    await setSysLogLinks(prevState => ({
      ...prevState,
      max_msgs: 0,
      log_data: [],
    }))

    const request_obj = {
      address: `GetLogErrorFull.cgi`,
      data: `${name}$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.updateHandler(request_obj)

    setLogType(prevState => (
      {
        ...prevState,
        log_type: name
      }
    ))
  }

  const handle_logExpand = (log_num, log_id) => {
    
    let logs_data = sysLogLinks.active_page_logs,
    expanded_log = logs_data[log_num]
    
    expanded_log.log_expand = !expanded_log.log_expand

    handle_logExpand_request(log_id, expanded_log.log_expand)

    setSysLogLinks(prevState => ({
      ...prevState,
      active_page_logs: logs_data
    }))
  }

  const handle_logExpand_request = (log_type, log_num, expand_bool) => {
    let request_obj

    if (expand_bool) {
      request_obj = {
        address: 'get_expanded_log.cgi',
        data: `${log_type}$1;log_num$${log_num}`,
        notifications: {
          good: 'default',
          bad: 'default'
        }
      }
    }

    props.updateHandler(request_obj)
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
          <div className='logs_type_switch'>
            {sys_log_types.map(item => (
              <button 
                className={`log_type_item button_input ${item.type == logType.log_type ? 'active_type' : ''}`}
                type='button'
                name={item.type}
                onClick={handle_logType_change}
                key={item.type}>
                {item.name}
              </button>
            ))}
          </div>
          {logType.log_type == 'syslog' &&
            <Syslog_wrap
              logs_list={sysLogLinks.active_page_logs}
              logs_expand={handle_logExpand}
              updateHandler={props.updateHandler} />}
          {logType.log_type == 'http_log' &&
            <HttpLog_wrap
              logs_list={sysLogLinks.active_page_logs}
              logs_expand={handle_logExpand}
              updateHandler={props.updateHandler} />}
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