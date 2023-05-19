import React from 'react';
import ReactDOM from 'react-dom';

import useGlobalStore from '../../logic/auth_store';
import useSectionStore from '../../logic/sectionsRefs_store';
import { useInView } from '../../logic/useInView_hook';

import './index.css'

const links_items = [
  {id: 'status', name: "Статус"},
  {id: 'settings', name: "Общие настроки"},
  {id: 'network', name: "Сетевые настройки"},
  {id: 'info', name: "Данные об устройстве"},
  {id: 'calibration', name: "Калибровка"}
]

function Links_list(props) {
  const [active, SetActive] = React.useState('');
  const [authGlobalState, authGlobalActions] = useGlobalStore()
  const [sectionState, sectionActions] = useSectionStore()

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

  function handleClick(event) {
    event.stopPropagation()
    console.log('nav li')

    SetActive(
      links_items.findIndex(item => {
        return event.currentTarget.id === item.id
      })
    );

    props.updateHandler(event.currentTarget.id)

  }

  return (
    <ul className="nav_linksList">
      {links_items.map((item, index) => {
        console.log(links_items.length);
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
            <div 
            className="nav_linkLabel"
            onClick={(e) => {console.log('nav span');}}
            >{item.name}</div>
            <svg 
              width="9" 
              height="15" 
              viewBox="0 0 9 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" className="nav_linkArrow"
              onClick={(e) => {console.log('nav svg');}}>
              <path id="Vector 2" d="M1 1L7.21084 6.76721C7.6369 7.16284 7.6369 7.83716 7.21084 8.23279L1 14" stroke="#6D8EA0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </li>
          )
        }
        })}
    </ul>
  )
}

export default Links_list;
