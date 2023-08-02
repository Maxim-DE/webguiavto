import React from 'react'
import ModalCalib from '../calib_modal'

import './index.css'

export const AlertDialogWrap = ({open, onClose, title, ...props}) => {
  const closeAlert = () => {
    props.onClose()
  }

  if (open) {
    return (
      <ModalCalib
        header={title}
        setIsOpen={onClose}
        user_controllable={false}
        class='alert_modal'>
        <div className='alert_message_wrap'>
          {props.children}
        </div>
      </ModalCalib>
    )
  }
}
