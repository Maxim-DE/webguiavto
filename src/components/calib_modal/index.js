import React, { useCallback } from 'react';

import { IoMdClose } from 'react-icons/io';

import './index.css'
import '../modal/index.css'

import FormInput from '../form_input'

function ModalCalib(props) {

  const handleClose = () => {
    props.setIsOpen()
  }
  
  const handleEnterDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && props.submitHandler) {
        props.submitHandler()
        console.log('it pressed enter!');
      }
    },
  [props.submitHandler]) 

  return (
    <>
    <div 
      className='darkBG'
      onClick={props.user_controllable ? handleClose : undefined} />
    <div className='centered'>
      <div className={`modal ${props.class}`} tabIndex={0} onKeyUp={handleEnterDown} >
        <div className="modal_header">
          <h3>{props.header}</h3>
        </div>
        {props.user_controllable &&
          <button 
            className='closeBtn'
            onClick={handleClose}
            type='button'>
            <IoMdClose style={{ marginBottom: "-3px" }} />
          </button>
        }
        {props.children}
      </div>
    </div>
    </>
  );
}

export default ModalCalib;