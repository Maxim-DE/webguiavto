import React from 'react'

import FormInput from '../../form_input'
import ModalCalib from '../../calib_modal'

import time_ArrToStr from '../../../logic/time_ArrToStr'
import { set_logs_id } from '../../../logic/syslog_handle_expand'
import { syslog_handle_expand } from '../../../logic/syslog_handle_expand'
import { set_expand_state } from '../../../logic/syslog_handle_expand'
import { set_expand_value_status } from '../../../logic/syslog_handle_expand'
import { param_label_translate } from '../../../logic/syslog_handle_expand'

import '../../status_logs_block/index.css'

import Syslog_wrap from './syslog/syslog'
import HttpLog_wrap from './syslog/http_log'

import { BsChevronDoubleLeft, BsChevronLeft,
         BsChevronRight, BsChevronDoubleRight } from 'react-icons/bs'

import '../index.css'
import { reducers } from '../../../store/reducers/calib_forms_reducers'
import SettingsBlockWrap from '../../settings_block_wrap'
import { useSelector } from 'react-redux'

export const log_status = [
  '',
  'log_critical',
  'log_user',
  'log_hibernation'
]

const sys_log_types = [
  {type: 'syslog', name: 'Cистемный'},
  // {type: 'http_log', name: 'HTTP-жур.'}
]

function SyslogSection_calib(props) {

  const [isOpen, setIsOpen] = React.useState(false);

  const [logType, setLogType] = React.useState({
    log_type: 'syslog'
  })

  const [sysLogLinks, setSysLogLinks] = React.useState({
    max_msgs: 0,
    active_page: 1,
    active_page_logs: [],
    max_active_logs: 10000,
    max_pages: 1,
    max_links: 5,
    links: [],
    log_data: []
  });

  const auth_store = useSelector((store) => store.authStore.auth_data),
        info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info)

  const active_link_ref = React.useRef(null)

  // React.useEffect(() => {
  //   if (isOpen) handleSysLogRequest()
  // }, [isOpen])

  let device_arr = [],
    device_type = 0,
    device_serialNum,
    device_model

  if (info_section_data.info_general) {
    device_arr = info_section_data.info_general.device_type_list ? info_section_data.info_general.device_type_list : [],
      device_type = info_section_data.info_general.model ? info_section_data.info_general?.model : 0,
      device_serialNum = info_section_data.info_general.serial_number ? '_' + info_section_data.info_general?.serial_number : '',
      device_model = '_' + device_arr[device_type]
  }

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
          max_pages = sysLogLinks.max_pages == 0 ? 0 : Math.ceil(max_msgs / max_active_logs)
          
    const processing_result = sys_log_render_processing(sysLogLinks.active_page,
                                                        sysLogLinks.max_links,
                                                        max_pages,
                                                        sysLogLinks.max_active_logs,
                                                        sysLogLinks.log_data,
                                                        sysLogLinks.active_page_logs)

    setSysLogLinks(prevState => ({
      ...prevState,
      max_pages: max_pages,
      active_page_logs: processing_result.active_page_logs,
      links: processing_result.new_links
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

    let processing_result = sys_log_render_processing(sysLogLinks.active_page,
                                                      sysLogLinks.max_links,
                                                      sysLogLinks.max_pages,
                                                      sysLogLinks.max_active_logs,
                                                      sysLogLinks.log_data,
                                                      sysLogLinks.active_page_logs)
    
    setSysLogLinks(prevState => ({
      ...prevState,
      active_page_logs: processing_result.active_page_logs,
      links: processing_result.new_links
    }))
    
  }, [sysLogLinks.active_page])

  const handleClick_open = () => {
    setIsOpen(true)
    // handleSysLogRequest()
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
      active_page: 1,
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
      reducer: reducers.delete_sys_logs,
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

    setSysLogLinks(prevState => ({
      ...prevState,
      max_msgs: 0,
      log_data: [],
    }))

    const request_obj = {
      address: 'GetLogErrorFull.cgi',
      data: 'syslog$1',
      reducer: reducers.syslog_data,
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

  const handle_logExpand = (log_type, log_num, log_id, unique_id) => {
    
    let logs_data = sysLogLinks.active_page_logs,
        expanded_log = logs_data.find(log => log.unique_id === unique_id)
    
    if (expanded_log.log_expand == null) {
      expanded_log.log_expand = true
    } else {
      expanded_log.log_expand = !expanded_log.log_expand
    }

    setSysLogLinks(prevState => ({
      ...prevState,
      active_page_logs: logs_data
    }))

    if (expanded_log.expand_info == 'none') handle_logExpand_request(log_type, log_id, expanded_log.log_expand)

  }

  const handle_logExpand_request = (log_type, log_num, expand_bool) => {
    let request_obj

    if (expand_bool) {
      request_obj = {
        address: 'get_expanded_log.cgi',
        data: `${log_type}$1;log_num$${log_num}`,
        reducer: reducers.get_expanded_syslog,
        notifications: {
          good: 'default',
          bad: 'default'
        }
      }
    }

    props.updateHandler(request_obj)
  }



  return (
    <SettingsBlockWrap type="blank" screen_fit={true}>
    
      <div className='logs_type_switch'>
        Тип журнала: 
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
          {auth_store.auth_access.calib_extend &&
            <FormInput
              id={`delete_sys_logs_input`}
              name={`delete_sys_logs`}
              clickHandler={delete_handleClick}
              // class='log_refresh'
              label='Очистить журнал'
              type="button" />
          }
          <a 
            href="ReadSysLog.txt"
            download={`SysLog${device_model}${device_serialNum}.txt`} >
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
    
    </SettingsBlockWrap>
  )
}

const sys_log_render_processing = (active_page, max_links, max_pages, max_active_logs, log_data, active_log_state) => {

  let new_links = [],
      active_page_logs = [],
      processing_obj = {}

  if (active_page < max_links) {
    let links_counter

    if (max_links > max_pages) {
      links_counter = max_pages
    } else {
      links_counter = max_links
    }

    for (let index = 1; index < links_counter + 1; index++) {
      const link_obj = {
        index: index,
        active: index == active_page ? true : false
      }

      new_links.push(link_obj)
    }

  } else if (active_page > (max_pages - max_links - 1)) {
    let active_page_location,
      low_links_border,
      high_links_border

    low_links_border = max_pages - max_links
    high_links_border = max_pages

    for (let index = low_links_border; index < high_links_border + 1; index++) {
      const link_obj = {
        index: index,
        active: index == active_page ? true : false
      }

      new_links.push(link_obj)
    }
  } else {
    let active_page_location,
      low_links_border,
      high_links_border

    if (max_links % 2 == 0) {
      active_page_location = (max_links / 2) + 1
    } else {
      active_page_location = Math.ceil(max_links / 2)
    }

    low_links_border = active_page - (active_page_location - 1)
    high_links_border = active_page + max_links - active_page_location

    for (let index = low_links_border; index < high_links_border + 1; index++) {
      const link_obj = {
        index: index,
        active: index == active_page ? true : false
      }

      new_links.push(link_obj)
    }
  }

  processing_obj.new_links = new_links


  let low_active_logs_border,
      high_active_logs_border,
      max_msgs = log_data.length

  if (active_page == 1) {
    low_active_logs_border = 0
    if (log_data.length < max_active_logs) {
      high_active_logs_border = log_data.length
    } else {
      high_active_logs_border = max_active_logs
    }
  } else if (active_page == max_pages) {
    low_active_logs_border = ((active_page - 1) * max_active_logs)
    high_active_logs_border = low_active_logs_border + (max_msgs - low_active_logs_border)
  } else {
    low_active_logs_border = ((active_page - 1) * max_active_logs)
    high_active_logs_border = low_active_logs_border + max_active_logs
  }

  let i = 0

  for (let log = low_active_logs_border; log < high_active_logs_border; log++) {
    if (log > (log_data.length - 1)) return

    let active_log_data = log_data[log]
    let active_log_instance = {}

    active_log_instance.id = active_log_data[0]
    active_log_instance.status = active_log_data[1]
    active_log_instance.user = active_log_data[2]
    active_log_instance.message = active_log_data[3]
    active_log_instance.time = active_log_data[4]
    if (active_log_state.length != 0) {
      let active_log_ref = active_log_state.find(log => log.unique_id === active_log_data[active_log_data.length + 1])
      
      if (active_log_ref != undefined) {
        active_log_instance.log_expand = set_expand_state(active_log_data[5], active_log_ref.log_expand)
        if (active_log_ref.expand_info === 'none') {
          active_log_instance.expand_info = active_log_data[5] ? active_log_data[6] : 'none'
        } else {
          active_log_instance.expand_info = active_log_ref.expand_info
        }
      } else {
        active_log_instance.log_expand = active_log_data[5] == 1 ? false : 'none'
        active_log_instance.expand_info = active_log_data[6] ? active_log_data[6] : 'none'
      }
    } else {
      active_log_instance.log_expand = active_log_data[5] == 1 ? false : 'none'
      active_log_instance.expand_info = active_log_data[6] ? active_log_data[6] : 'none'
    }
    active_log_instance.unique_id = active_log_data[active_log_data.length + 1]

    active_page_logs.push(active_log_instance)

    i++
  }

  processing_obj.active_page_logs = active_page_logs

  return processing_obj
}

export default SyslogSection_calib

