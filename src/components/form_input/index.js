import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'


import { MdOutlineExposurePlus2 } from 'react-icons/md'
import { TbPlus } from 'react-icons/tb'
import { TbMinus } from 'react-icons/tb'

import h_and_min_input from '../custom_inputs/silence_det_border_time'
import silence_det_channel_modes_input from '../custom_inputs/silence_det_channel_modes'
import { roundDigits } from '../../logic/utilites';
import { toast } from 'react-toastify';

function FormInput(
  {
    // id, 
    // name, 
    // type, 
    // className,
    // input_value,
    // style,
    // disabled,
    // placeholder,
    // changeHandler,
    // stateHandler,
    // variants,
    // step,
    // max,
    // min,
    ...props
  }
) {

  const [openModal, setOpenModal] = React.useState(false);

  const handleChange = (event) => {
    props.changeHandler(event)
  }

  const plusMinusHandler = (event, control_input_name) => {
    event.preventDefault()

    const target = event.currentTarget,
          name = target.name

    let letters_regex = /[A-Za-z]+/g;
          
    let target_data = name.split('_'),
        action = target_data[0],
        action_value = target_data[2] != undefined ? Number(target_data[2]) : 1,
        round_digits = roundDigits(action_value)
    
    console.log(target_data);

    if (typeof props.input_value == 'string') {
      if (props.input_value.match(letters_regex) ||
          props.input_value.match(/,/)) {
        toast.error('Неправильный тип данных для изменения', { autoClose: 1500 })

        const corrected_value = Number(props.input_value.replace(letters_regex, '').replace(/,/, '.'))

        props.statusHandler(prevState => ({
          ...prevState,
          [props.name]: corrected_value
        }))

        return
      }
    }

    let output_value = props.input_value != undefined ? Number(props.input_value) : 0

    if (/minus/g.test(action)) {
      output_value = (output_value - action_value).toFixed(round_digits)
    } else if (/plus/g.test(action)) {
      output_value = (output_value + action_value).toFixed(round_digits)
    }

    if (props.max ||  props.min) {
      if (output_value > Number(props.max)) {
        output_value = Number(props.max)
      } else if (output_value < Number(props.min)) {
        output_value = Number(props.min)
      }
      
    }

    props.statusHandler(prevState => ({
      ...prevState,
      [props.name]: output_value
    }))
    
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
        className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'}`}
        type="text"
        onChange={handleChange}
        value={props.input_value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        style={props.style}
      />
    )
  } else if (props.type == "password") {
    return (
      <input
        id={props.id}
        name={props.name}
        type="password"
        onChange={handleChange}
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
        className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'}`}
        checked={!!(props.input_value)}
        onChange={handleChange}
        disabled={props.disabled}
      />
    )
  } else if (props.type == "switch") {
    return (
      <div className="switch_container">
        <span className={`switch_state_display ${props.input_value ? 'turned_on' : 'turned_off'}`}>
          {props.input_value ? 'вкл' : 'выкл'}
        </span>
        <input
          id={props.id}
          name={`${props.name}`}
          type='checkbox'
          className={`switch ${props.class != undefined && props.class} ${props.disabled && 'disabled_input'}`}
          checked={!!(props.input_value)}
          onChange={handleChange}
          disabled={props.disabled}
        />
      </div>
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
      //     onChange={handleChange}
      //     data-range="0"
      //     value={value_range[0]}
      //   />
      //   <span>до</span>
      //   <input
      //     type="text"
      //     className="text_range"
      //     data-range="1"
      //     onChange={handleChange}
      //     value={value_range[1]}
      //   />
      // </div>
  //   )
  // } 

  else if (props.type == "text_buttons") {
    return (
      <div className="text_buttons_container">
        {/* <button 
          className='button_input plus_minus'
          name='minus_value_3'
          onClick={(e) => {
            plusMinusHandler(e, props.name)
          }}>
          <TbMinus />
          3
        </button> */}
        <button 
          className='button_input plus_minus'
          name={`minus_value_${props.step}`}
          onClick={(e) => {
            plusMinusHandler(e, props.name)
          }}>
          <TbMinus />
        </button>
        <input
          id={props.id}
          name={props.name}
          type="number"
          onChange={handleChange}
          value={props.input_value}
          step={props.step}
          max={props.max}
          min={props.min}
        />
        <button 
          className='button_input plus_minus'
          name={`plus_value_${props.step}`}
          onClick={(e) => {
            plusMinusHandler(e, props.name)
          }}>
          <TbPlus />
        </button>
        {/* <button 
          className='button_input plus_minus'
          name='plus_value_3'
          onClick={(e) => {
            plusMinusHandler(e, props.name)
          }}>
          <TbPlus />
          3
        </button> */}
      </div>
    )
  } 

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
          onChange={handleChange}
        />
        <input 
            className='text_large_expand_input button_input'
          type="button" 
          value="..."
          onClick={modal_clickHandler} />
        <div 
          className='text_large_expanded_wrap'
            style={{ 
              // display: openModal ? 'block' : 'block' ,
              margin: openModal ? '30px 0 0 11px' : '16px 0 0 11px',
              visibility: openModal ? 'visible' : 'hidden',
              opacity: openModal ? '1' : '0'}}>
          <input
            id={props.id}
            name={props.name}
            type="text"
            className='text_large_expanded'
            value={props.input_value}
            onChange={handleChange}
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
            onChange={handleChange}
          />
          <input
            className='text_large_expand_input button_input'
            type="button"
            value="..."
            onClick={modal_clickHandler} />
          <div
            className='text_large_expanded_wrap'
            style={{
              margin: openModal ? '30px 0 0 18px' : '16px 0 0 11px',
              visibility: openModal ? 'visible' : 'hidden',
              opacity: openModal ? '1' : '0'
            }}>
            <input
              id={props.id}
              name={props.name}
              type="text"
              className='text_large_expanded split'
              value={props.input_value}
              onChange={handleChange}
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
        className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'}`}
        onChange={handleChange}
        disabled={props.disabled}
        value={props.input_value}
      >
      {props.variants &&
        props.variants.map((item, index) => {
          if (typeof item != 'undefined') {
            return (
              <option 
                key={index}
                value={index}>{item}</option>
            ) 
          }
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
    // const value_range = props.input_value.split(',')
    return (
      <div
        className="slider_container"
        id={props.id}>
        {/* <span>{value_range[0]}</span> */}
        <span>{props.input_value}</span>

        <input
          id={props.id}
          name={props.name}
          type='range'
          className="range_slider"
          onChange={handleChange}
          onMouseUp={props.mouseupHandler}
          disabled={props.disabled}
          value={props.input_value}
          step={props.step}
          min={props.min}
          max={props.max} />

      </div>
    )
    
  } else if (props.type == "button") {
    return (
      <button
        id={props.id}
        name={props.name}
        title={props.title}
        className={`button_input ${props.class != undefined && props.class} ${props.disabled && 'disabled_input'}`}
        disabled={props.disabled}
        type="button"
        style={props.style}
        onClick={props.clickHandler}>
        {props.label}
      </button>
    )
  }

  else if (props.type == "custom") {
    return custom_inputs[props.id](handleChange, props.input_value, props.id)
  }
}

export default FormInput;
