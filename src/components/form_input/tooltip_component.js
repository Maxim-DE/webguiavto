import React from 'react'
import { IoAlertOutline } from 'react-icons/io5'
import { BsQuestionLg } from "react-icons/bs";
import { Tooltip } from 'react-tooltip'

export default function InputTooltip({id, type, tooltip_text}) {
  const tooltip_icon = type === 'info' ? <BsQuestionLg size={10} /> :
                                         <IoAlertOutline />

  return (
    <div className='tooltip_wrap'>
        <div 
          className={`tooltip_indicatior ${type ? type : 'info'}`}
          data-tooltip-id={`${id}_${type}_tooltip`}
          data-tooltip-variant={type}
          data-tooltip-content={tooltip_text} >
            {tooltip_icon}
        </div>
        <Tooltip id={`${id}_${type}_tooltip`} className={`tooltip_instance ${type}`} /> 
    </div>
  )
}
