import React from 'react';
import ReactDOM from 'react-dom';

import useGlobalStore from '../../logic/auth_store';
import useSectionStore from '../../logic/sectionsRefs_store';
import { useInView } from '../../logic/useInView_hook';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

import './index.css'
import { icons } from 'react-icons';

// массив со всеми элементами навбара
const links_items = [
  {id: 'status', name: "Статус"},
  {id: 'settings', name: "Общие настройки"},
  {id: 'network', name: "Сетевые настройки"},
  {id: 'info', name: "Данные об устройстве"},
  {id: 'calibration_main', name: "Калибровка"}
] 

const calib_links_items = [
  {id: 'main', name: "Калибровка", nested: true},
  {id: 'misc', name: "Прочее", nested: true},
  {id: 'developer', name: "Для разработчиков", nested: true}
  
]

function Links_list(props) {
  const [active, SetActive] = React.useState('');
  const [calibOpen, setCalibOpen] = React.useState(false);
  const [authGlobalState, authGlobalActions] = useGlobalStore()
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
    if (active < '4') {
      setCalibOpen(false)
    } else {
      setCalibOpen(true)
    }
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

  if (active < '4') {
    return (
      <>
      <ul className="nav_linksList">
        {links_items.map((item, index) => {
          if (index > 0 && index < links_items.length - 1 
            && !authGlobalState.auth_access.settings) {
            return
          } else if (index == links_items.length - 1
                     && !authGlobalState.auth_access.calib) {
            return
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
              onClick={(e) => {console.log('nav span');}}
              >{item.name}</div>
              <FaAngleRight
                color='#6D8EA0'
                size='25px' />

              {/* <svg 
                width="9" 
                height="15" 
                viewBox="0 0 9 15" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" className="nav_linkArrow"
                onClick={(e) => {console.log('nav svg');}}>
                <path id="Vector 2" d="M1 1L7.21084 6.76721C7.6369 7.16284 7.6369 7.83716 7.21084 8.23279L1 14" stroke="#6D8EA0" strokeWidth="2" strokeLinecap="round"/>
              </svg> */}
            </li>
            )
          }
          })}
      </ul>
      <Outlet />
      </>
    )
  } else {
    return <CalibNavList updateHandler={props.updateHandler} setParentActive={SetActive}/>
  }
}



// Отдельный вариант списка навигации для калибровки, по реализации тоже самое, что и список выше, только он выступает в качестве потомка основного списка, поэтому в него передаются функции и значения из родительского компонента
function CalibNavList({updateHandler, setParentActive}) {
  const [authGlobalState, authGlobalActions] = useGlobalStore()
  const [active, setActive] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    updateHandler('calibration_main')
  }, [])

  // При нажатии на "Вернуться в основные настройки" просиходит смена активного пункта род. списка на основные настройки
  const handleReturn = () => {
    setParentActive(1)
    navigate(`settings`, {replace: false})
    updateHandler('status')
  }

  const handleClick = (event) => {
    event.stopPropagation()
    console.log('nav li')

    const active_link_name = event.currentTarget.id,
          active_link_num = calib_links_items.findIndex(item => {
              return active_link_name === item.id
            })

    setActive(active_link_num);

    navigate(`calibration/${active_link_name}`, {replace: false})
    updateHandler(active_link_name)
  }

  return (
    <>
    <ul className="nav_linksList">
      <li
        key={'backItem'}
        id={'backItem'}
        onClick={handleReturn}
        >
        <div className="backIcon_wrap">
          <FaAngleLeft
            color='#6D8EA0'
            size='25px' />
        </div>
        <div 
        className="nav_linkLabel"
        onClick={(e) => {console.log('nav span');}}
        >Вернуться к остальным настройкам</div>
      </li>
        {calib_links_items.map((item, index) => {
          if (item.id == 'developer' && !authGlobalState.auth_access.calib_extend) {
            return
          } else {
            return (
            <li
              key={item.id}
              id={item.id}
              onClick={handleClick}
              className={index === active ? 'active' : ''}
              >
              <div className="backIcon_wrap"></div>
              <div 
              className="nav_linkLabel"
              onClick={(e) => {console.log('nav span');}}
              >{item.name}</div>
              <FaAngleRight
                color='#6D8EA0'
                size='25px' />
            </li>
            )
          }
          })}
      </ul>
      <Outlet />
      </>
  )
}


export default Links_list;
