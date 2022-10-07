import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

import h_and_min_input from '../custom_inputs/silence_det_border_time'
import silence_det_channel_modes_input from '../custom_inputs/silence_det_channel_modes'

function FormInput(props) {

  const [openModal, setOpenModal] = React.useState(false);

  const changeHandler = (event) => {
    props.changeHandler(event)
  }


  const modal_clickHandler = (event) => {
    let is_modal_open = openModal;
    setOpenModal(!is_modal_open);
  }

  const custom_inputs = {
    'reaction_off_input': h_and_min_input,
    'reaction_on_input': h_and_min_input,
    // 'silence_det_channel_modes_input': silence_det_channel_modes_input,
  }

  if (props.type == "text") {
    return (
      <input
        id={props.id}
        name={props.name}
        type="text"
        onChange={changeHandler}
        value={props.input_value}
        style={props.style}
      />
    )
  } 
  else if (props.type == "checkbox") {
    return (
      <input
        id={props.id}
        name={`${props.name}`}
        type="checkbox"
        checked={!!(props.input_value)}
        onChange={changeHandler}
      />
    )
  } else if (props.type == "switch") {
    return (
      <input
        id={props.id}
        name={`${props.name}`}
        type='checkbox'
        className='switch'
        checked={!!(props.input_value)}
        onChange={changeHandler}
      />
    )
  } 
  // else if (props.type == "text_range") {
  //   const value_range = inputValue.split(',')
  //   return (
      // <div
      //   className="text_range_container"
        // id={props.id}
        // name={props.name}
      // >
      //   <span>от</span>
      //   <input
      //     type="text"
      //     className="text_range"
      //     onChange={changeHandler}
      //     data-range="0"
      //     value={value_range[0]}
      //   />
      //   <span>до</span>
      //   <input
      //     type="text"
      //     className="text_range"
      //     data-range="1"
      //     onChange={changeHandler}
      //     value={value_range[1]}
      //   />
      // </div>
  //   )
  // } 
  // else if (props.type == "text_buttons") {
  //   return (
  //     <div className="text_buttons_container">
  //       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <path d="M15.6667 10.6667H4V9H15.6667V10.6667Z" fill="black"/>
  //       </svg>
  //       <input
  //         id={props.id}
  //         name={props.name}
  //         type="text"
  //         onChange={changeHandler}
  //         value={inputValue}
  //       />
  //       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <path d="M15.8333 10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16666H9.16667V4.16666H10.8333V9.16666H15.8333V10.8333Z" fill="#3C3C3C"/>
  //       </svg>
  //     </div>
  //   )
  // } 
  else if (props.type == "text_large") {

    return (
      <>
      <div className='text_large_container'>
        <input
          id={props.id}
          name={props.name}
          type="text"
          className='text_large_not_expanded'
          value={props.input_value}
          onChange={changeHandler}
        />
        <input 
          className='text_large_expand_input'
          type="button" 
          value="..."
          onClick={modal_clickHandler} />
        <div 
          className='text_large_expanded_wrap'
            style={{ 
              // display: openModal ? 'block' : 'block' ,
              margin: openModal ? '11px 0 0 11px' : '16px 0 0 11px',
              visibility: openModal ? 'visible' : 'hidden',
              opacity: openModal ? '1' : '0'}}>
          <input
            id={props.id}
            name={props.name}
            type="text"
            className='text_large_expanded'
            value={props.input_value}
            onChange={changeHandler}
          />
        </div>
      </div>
      </>
    )
  } 
  else if (props.type == "text_large_split") {

    return (
      <>
        <div className='text_large_container'>
          <input
            id={props.id}
            name={props.name}
            type="text"
            className='text_large_not_expanded split'
            value={props.input_value}
            onChange={changeHandler}
          />
          <input
            className='text_large_expand_input'
            type="button"
            value="..."
            onClick={modal_clickHandler} />
          <div
            className='text_large_expanded_wrap'
            style={{
              margin: openModal ? '11px 0 0 11px' : '16px 0 0 11px',
              visibility: openModal ? 'visible' : 'hidden',
              opacity: openModal ? '1' : '0'
            }}>
            <input
              id={props.id}
              name={props.name}
              type="text"
              className='text_large_expanded split'
              value={props.input_value}
              onChange={changeHandler}
            />
          </div>
        </div>
      </>
    )
  } 
  else if (props.type == "select") {
    return (
      <select
        id={props.id}
        name={props.name}
        onChange={changeHandler}
        value={props.input_value}
      >
      {props.variants &&
        props.variants.map((item, index) => {
          return (
            <option value={index}>{item}</option>
          )
        })
      }
        {/* <option value='1'>4564</option>
        <option value='2'>456</option>
        <option value='3'>45</option>
        <option value='4'>4</option> */}
      </select>
    )
  } else if (props.type == "text_sample") {
    return (
      <span
        id={props.id}>
        {props.input_value}
      </span>
    )
  } 
  else if (props.type == "slider") {
    const value_range = props.input_value.split(',')
    return (
      <div
        className="slider_container"
        id={props.id}>
        <span>{value_range[0]}</span>

        <input
          id={props.id}
          name={props.name}
          type='range'
          className="slider"
          onChange={changeHandler}
          value={value_range[1]}
          min={value_range[0]}
          max={value_range[2]} />

        <span>{value_range[2]}</span>
      </div>
    )
    
  } else if (props.type == "button") {
    return (
      <input
        id={props.id}
        name={props.name}
        className='button_input'
        type="button"
        value={props.label}
        onClick={props.clickHandler} />
    )
  }

  else if (props.type == "custom") {
    return custom_inputs[props.id](changeHandler, props.input_value, props.id)
  }
}

export default FormInput;
