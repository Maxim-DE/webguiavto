import React from 'react';

import { IoMdClose } from 'react-icons/io';

import './index.css'
import '../modal/index.css'

import FormInput from '../form_input'

function ModalCalib(props) {

  const handleClose = () => {
    props.setIsOpen(false)
  }

  return (
    <>
    <div 
      className='darkBG'
      onClick={handleClose} />
    <div className='centered'>
      <div className={`modal ${props.class}`}>
        <div className="modal_header">
          <h3>{props.header}</h3>
        </div>
        <button 
          className='closeBtn'
          onClick={handleClose}>
          <IoMdClose style={{ marginBottom: "-3px" }} />
        </button>
        {props.children}
      </div>
    </div>
    </>
  );
}

export default ModalCalib;