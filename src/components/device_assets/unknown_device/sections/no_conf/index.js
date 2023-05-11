import React from 'react'

import { MdOutlineWarningAmber } from 'react-icons/md'
import { IconContext } from 'react-icons'

import './index.css'

export const NoConf_placeholder = () => {
  return (
    <IconContext.Provider value={{
      size: '50px'
    }}>
    <div className='noconf_placeholder'>
      <div className="picture_wrap">
        <MdOutlineWarningAmber />
      </div>
      <span className="text_wrap">
        Отсутствует файл конфигурации!
      </span>
    </div>
    </IconContext.Provider>
  )
}
