import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

import './index.css'


import { MdOutlineExposurePlus2 } from 'react-icons/md'
import { TbPlus } from 'react-icons/tb'
import { TbMinus } from 'react-icons/tb'
import { IoAlertOutline } from "react-icons/io5";

import h_and_min_input from '../custom_inputs/silence_det_border_time'
import silence_det_channel_modes_input from '../custom_inputs/silence_det_channel_modes'
import { isFocused, roundDigits } from '../../logic/utilites';
import { toast } from 'react-toastify';
import { validateValue } from '../../logic/validation/validate_value';
import InputTooltip from './tooltip_component';

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
    // validators
    ...props
  }
) {

  const [isDirty, setDirty] = useState(false)

  const [isError, setError] = useState(null)

  const [openModal, setOpenModal] = React.useState(false);

  const addInput_ref = React.useRef(null)

  const handleBlur = useCallback(async () => {
    if (props.validators && Array.isArray(props.validators)) {
      setError(await validateValue(props.input_value, props.validators));
    }

    if (!isDirty) setDirty(true)

  }, [props.input_value, props.validators]);

  React.useEffect(() => {
    let is_modal_open = openModal;

    if (is_modal_open == true &&
        addInput_ref.current != null) {
      setTimeout(() => {
        addInput_ref.current.focus()
      }, 100)
    }
  }, [openModal])

  React.useEffect(() => {
    const hasInputValidError = !!isError

    if (props.formValidHandler) {
      props.formValidHandler({
        id: props.name, 
        valid_status: !hasInputValidError
      })
    }
  }, [isError])

  React.useEffect(() => {
    async function performValidation() {
      if (props.validators && Array.isArray(props.validators)) {
        const valid_result = await validateValue(props.input_value, props.validators)
        setError(valid_result);
      }
    }

    performValidation()

  }, [props.input_value])

  const handleChange = async (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    props.changeHandler(event)

    if (props.validators && Array.isArray(props.validators)) {
      setError(await validateValue(value, props.validators));
    }
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

  const onBlur_addInput_handler = (event) => {
    const is_modal_open = openModal,
          isExpandButtonPressed = event.relatedTarget && 
                                  event.relatedTarget.className.includes("text_large_expand_input")

    if (!isExpandButtonPressed && is_modal_open) {
      setOpenModal(false)
    }
  }

  const custom_inputs = {
    'reaction_off_input': h_and_min_input,
    'reaction_on_input': h_and_min_input,
    // 'silence_det_channel_modes_input': silence_det_channel_modes_input,
  }

  if (props.type == "text") {
    return (
      <div className="form_input_wrap">
        {isError &&
          <InputTooltip
            id={props.id}
            type={'error'}
            tooltip_text={isError} />
        }
        <input
          id={props.id}
          name={props.name}
          className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'} ${isError && 'error_input'}`}
          type="text"
          onChange={handleChange}
          value={props.input_value}
          disabled={props.disabled}
          placeholder={props.placeholder}
          style={props.style}
          maxLength={props.max_length}
          onBlur={handleBlur}
          data-error={!!isError}
          />
      </div>
    )
  } else if (props.type == "password") {
    return (
      <div className="form_input_wrap">
        {isError &&
          <InputTooltip
            id={props.id}
            type={'error'}
            tooltip_text={isError} />
        }
        <input
          id={props.id}
          name={props.name}
          className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'} ${isError && 'error_input'}`}
          type="password"
          onChange={handleChange}
          disabled={props.disabled}
          maxLength={props.max_length}
          onBlur={handleBlur}
          value={props.input_value}
          style={props.style}
          data-error={!!isError}
        />
      </div>
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
        {isError &&
          <InputTooltip
            id={props.id}
            type={'error'}
            tooltip_text={isError} />
        }
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
          style={props.style}
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
        {isError &&
          <InputTooltip
            id={props.id}
            type={'error'}
            tooltip_text={isError} />
        }
        <input
          id={props.id}
          name={props.name}
          type="text"
          className={`text_large_not_expanded ${isError && 'error_input'}`}
          value={props.input_value}
          onChange={handleChange}
          maxLength={props.max_length}
        />
        <input 
            className='text_large_expand_input button_input'
          type="button" 
          value="..."
          onClick={modal_clickHandler} />
        <div 
          className={`text_large_expanded_wrap ${isError && 'error_input'}`}
          style={{ 
            // display: openModal ? 'block' : 'block' ,
            margin: openModal ? '30px 0 0 -212px' : '16px 0 0 -212px',
            visibility: openModal ? 'visible' : 'hidden',
            opacity: openModal ? '1' : '0'
          }}>
          <input
            id={props.id}
            name={props.name}
            type="text"
            className='text_large_expanded'
            value={props.input_value}
            ref={addInput_ref}
            onChange={handleChange}
            onBlur={(e) => { onBlur_addInput_handler(e) }}
            maxLength={props.max_length}
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
          {isError &&
            <InputTooltip
              id={props.id}
              type={'error'}
              tooltip_text={isError} />
          }
          <input
            id={props.id}
            name={props.name}
            type="text"
            className={`text_large_not_expanded split ${isError && 'error_input'}`}
            value={props.input_value}
            onChange={handleChange}
          />
          <input
            className='text_large_expand_input button_input'
            type="button"
            value="..."
            onClick={modal_clickHandler} />
          <div
            className={`text_large_expanded_wrap ${isError && 'error_input'}`}
            style={{
              margin: openModal ? '30px 0 0 -198px' : '16px 0 0 -198px',
              visibility: openModal ? 'visible' : 'hidden',
              opacity: openModal ? '1' : '0'
            }}>
            <input
              id={props.id}
              name={props.name}
              type="text"
              className={`text_large_expanded split ${isError && 'error_input'}`}
              value={props.input_value}
              ref={addInput_ref}
              onChange={handleChange}
              onBlur={(e) => { onBlur_addInput_handler(e) }}
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
        className={`${props.class != undefined && props.class} ${props.disabled && 'disabled_input'} ${isError && 'error_input'}`}
        onChange={handleChange}
        disabled={props.disabled}
        value={props.input_value}
      >
      {props.variants &&
        props.variants.map((item, index) => {
          return (
            <option 
              key={index}
              value={index}>{item}</option>
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
    // const value_range = props.input_value.split(',')
    return (
      <div className="form_input_wrap">
        {isError &&
          <InputTooltip
            id={props.id}
            type={'error'}
            tooltip_text={isError} />
        }
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
