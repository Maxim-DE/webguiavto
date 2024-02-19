import React from 'react';
import ReactDOM from 'react-dom';

import useGlobalStore from '../../logic/auth_store';
import useSectionStore from '../../logic/sectionsRefs_store';
import { useInView } from '../../logic/useInView_hook';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

import './index.css'
import { useSelector } from 'react-redux';
import { IoMdRefresh } from 'react-icons/io';
import { reducers } from '../../store/reducers/core_store_reducers';

// массив со всеми элементами навбара
const links_items = [
  { id: 'status', name: "Статус", req_access_level: 0 },
  { id: 'settings', name: "Общие настройки", req_access_level: 1 },
  { id: 'network', name: "Сетевые настройки", req_access_level: 1 },
  { id: 'info', name: "Данные об устройстве", req_access_level: 0 },
  {
    id: 'calibration_main', name: "Расширенные настройки", req_access_level: 2, children: [
      { id: 'main', name: "Общее", nested: true },
      { id: 'misc', name: "Прочее", nested: true },
      { id: 'syslog', name: "Системный журнал", nested: true },
      { id: 'developer', name: "Для разработчиков", nested: true },
    ]
  }
] 

const calib_links_items = [
  {id: 'main', name: "Калибровка", nested: true},
  {id: 'misc', name: "Прочее", nested: true},
  {id: 'developer', name: "Для разработчиков", nested: true}
  
]

function Links_list(props) {
  const [active, SetActive] = React.useState('');
  const auth_level = useSelector((store) => store.authStore.auth_data.auth_level)
  const [sectionState, sectionActions] = useSectionStore()

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('Current location is ', location);
    const section_name = location.pathname.replace(/\//g, '')

    props.updateHandler(section_name)

  }, [location]);

  React.useEffect(() => {
    let active_link 
    for (const key in sectionState.intersection_pool) {
      if (sectionState.intersection_pool[key].isInView) {
        const section_name = key.replace('_section', '')
        SetActive(
          links_items.findIndex(item => {
            return item.id === section_name
          }));
        return
      }
    }
  }, [sectionState.intersection_pool])

  React.useEffect(() => {
    // if (active < '4') {
    //   setCalibOpen(false)
    // } else {
    //   setCalibOpen(true)
    // }
  }, [active]);

  function handleClick(event) {
    event.stopPropagation()
    console.log('nav li')

    const active_link_name = event.currentTarget.id,
          active_link_num = links_items.findIndex(item => {
              return active_link_name === item.id
            })

    SetActive(active_link_num);

    navigate(active_link_name.replace('_', '/'), {replace: false})

    props.updateHandler(event.currentTarget.id)

  }

  return (
    <>
    <ul className="nav_linksList">
      {links_items.map((item, index) => {
        if (props.device_type != 255) {
          if (auth_level >= item.req_access_level) {
            if (index == links_items.length - 1) {
          return (
            <CalibNavList
              id={item.id}
              name={item.name}
              index={index}
              updateHandler={props.updateHandler}
              isParentActive={index == active}
              setParentActive={SetActive}
              nested_elements={item.children}
            />
          )
        } else {
          return (
          <li
            key={item.id}
            id={item.id}
            onClick={handleClick}
            className={index === active ? 'active' : ''}>
            <div className="backIcon_wrap"></div>
            <div 
            className="nav_linkLabel"
                    onClick={(e) => { console.log('nav span'); }}
            >{item.name}</div>
            {/* <FaAngleRight
              color='#6D8EA0'
              size='25px' /> */}
          </li>
          )
        }
          }
        }
        // if (index > 0 && index < links_items.length - 1 && 
        //     (!auth_store.auth_access.settings ||
        //     props.device_type === 255)) {
        //   return
        // } else if (index == links_items.length - 1 && 
        //            (!auth_store.auth_access.calib ||
        //            props.device_type === 255)) {
        //   return
        // } else if (index == links_items.length - 1 &&
        //            (auth_store.auth_access.calib &&
        //            props.device_type !== 255)) {

        //   return (
        //     <CalibNavList
        //       id={item.id}
        //       name={item.name}
        //       index={index}
        //       updateHandler={props.updateHandler}
        //       isParentActive={index == active}
        //       setParentActive={SetActive}
        //       nested_elements={item.children}
        //     />
        //   )
        // } else {
        //   return (
        //   <li
        //     key={item.id}
        //     id={item.id}
        //     onClick={handleClick}
        //     className={index === active ? 'active' : ''}>
        //     <div className="backIcon_wrap"></div>
        //     <div 
        //     className="nav_linkLabel"
        //     onClick={(e) => {console.log('nav span');}}
        //     >{item.name}</div>
        //     {/* <FaAngleRight
        //       color='#6D8EA0'
        //       size='25px' /> */}
        //   </li>
        //   )
        // }
      })}
      
    </ul>
    <Outlet />
    </>
  )
  // if (active < links_items.length) {
  // } else {
  //   return 
    // <CalibNavList 
    //           updateHandler={props.updateHandler} 
    //           setParentActive={SetActive}
    //           nested_elements={}
    //           />
  // }
}



// Отдельный вариант списка навигации для калибровки, по реализации тоже самое, что и список выше, только он выступает в качестве потомка основного списка, поэтому в него передаются функции и значения из родительского компонента
function CalibNavList({id, name, updateHandler, index, isParentActive, setParentActive, nested_elements}) {
  const auth_store = useSelector((store) => store.authStore.auth_data)
  const [active, setActive] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isParentActive) {
      setIsExpanded(false);
    }
  }, [isParentActive])

  const handleNestedClick = (event) => {
    event.stopPropagation()
    console.log('nav li')

    const active_link_name = event.currentTarget.id,
          active_link_num = nested_elements.findIndex(item => {
              return active_link_name === item.id
            })

    setActive(active_link_num);

    navigate(`calibration/${active_link_name}`, {replace: false})
    updateHandler(`calibration_${active_link_name}`)
  }

  const handleExpand = (event) => {
    setIsExpanded(!isExpanded)

    if (isExpanded == false) {
      setActive(0)
      navigate(`calibration/${nested_elements[0].id}`, { replace: false })
    }
  }

  return (
    <>
      <li
        key={id}
        id={id}
        onClick={(e) => {
          setParentActive(index)
          handleExpand()
        }}
        className={`${isParentActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <div className="backIcon_wrap"></div>
        <div className="nav_linkLabel">{name}</div>
        <FaAngleRight
          color='#6D8EA0'
          className='front_icon'
          size='25px' />
      </li>
        {isExpanded && nested_elements.map((item, index) => {
          if (item.id == 'developer' && !auth_store.auth_access.calib_extend) {
            return
          } else {
            return (
            <li
              key={item.id}
              id={item.id}
              onClick={handleNestedClick}
              className={`nested_item ${index == active ? 'active' : ''}`}
              >
              <div className="backIcon_wrap"></div>
              <div 
              className="nav_linkLabel"
              onClick={(e) => {console.log('nav span');}}
              >{item.name}</div>
              {/* <FaAngleRight
                color='#6D8EA0'
                size='25px' /> */}
            </li>
            )
          }
          })}
      
      <Outlet />
    </>
  )
}


export default Links_list;
