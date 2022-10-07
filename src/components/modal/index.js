import React from 'react'

import { IoMdClose } from 'react-icons/io'
import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'


import './index.css'
import '../settings_block/index.css'

import FormInput from '../form_input'

const Modal = ({ setIsOpen, ...props }) => {

  const [modalData, setModalData] = React.useState(props.block_state)

  const [isChanged, setIsChanged] = React.useState({
    'changed': props.isChanged,
    'saved_data': props.saved_data,
  });

  const merged_items = [...props.items, ...props.additional_items];

  // React.useEffect(() => {
  //   const modalData_stringify = JSON.stringify(modalData),
  //     savedData_stringify = JSON.stringify(isChanged.saved_data);

  //   if (modalData_stringify != savedData_stringify) {
  //     setIsChanged(prevState => ({
  //       ...prevState,
  //       'changed': true
  //     }))

  //   } else {
  //     setIsChanged(prevState => ({
  //       ...prevState,
  //       'changed': false
  //     }))
  //   }
  // }, [modalData])

  const handleChange = (event) => {
    const target = event.target;
    let value;

    if (target.classList.contains('split')) {
      let split_value = target.value,
        separator = ' ',
        limit = 8,
        unmask_value = split_value.replace(/[^\d]/g, '')

      let output = [];

      if (unmask_value.length > (limit * 4)) {
        unmask_value = unmask_value.slice(0, (limit * 4))
      }

      for (let i = 0; i < unmask_value.length; i++) {
        if (i !== 0 && i % limit === 0) {
          output.push(separator);
        }

        output.push(unmask_value[i]);
      }

      value = output.join('');

    } else if (target.className == 'slider') {
      const value_string = `${event.target.min},${event.target.value},${event.target.max}`;
      value = value_string;

    }

    else {
      value = target.type === 'checkbox' ? target.checked : target.value;
    }

    const name = target.name;

    console.log(merged_items);


    setModalData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const reset_modal_handleClick = (event) => {
    event.preventDefault();
    setModalData(isChanged.saved_data);
  }

  const handleCloseClick = () => {
    // setModalData(modalData);
    props.setBlockData(modalData);
    setIsOpen(false);
  }

  return (
    <>
      <div 
        className='darkBG'
        onClick={handleCloseClick} />
      <div className='centered'>
        <div className='modal'>
          <div className="settings_block_header modal_header">
            <h3>{props.header}</h3>
            <button 
              className='save_form_button'
              // style={{
              //   display: isChanged.changed ? 'block' : 'none',
              //   opacity: isChanged.changed ? '1' : '0'
              // }}
              onClick={(event) => {
                props.setBlockData(modalData);
                props.clickHandler(event);
                setIsOpen(false);
                }}>
              <MdDone style={{ margin: "3px 0 0 0" }} />
            </button>
            {/* <button
              className='reset_form_button'
              style={{
                display: isChanged.changed ? 'block' : 'none',
                opacity: isChanged.changed ? '1' : '0'
              }}
              onClick={reset_modal_handleClick}
              title='Сбросить' >
              <GrPowerReset style={{ margin: "4px -1px 0" }} />
            </button> */}
          </div>
          <button 
            className='closeBtn'
            onClick={handleCloseClick}>
            <IoMdClose style={{ marginBottom: "-3px" }} />
          </button>
          <ul className="settings_list">
            {merged_items.map(item => {

              switch (item.type) {
                // case 'custom':
                //   return custom_forms[rest.section_name][settings_type](updateBlock, modalData)

                case 'custom_group':
                  return props.custom_groups[item.id].render_structure(handleChange, modalData, item.id, item.name)

                case 'group':
                  return (
                    <ul className="settings_list">
                      <li
                        key={item.id}
                        id={item.id}
                        className="settings_item">
                        <label
                          htmlFor={`${item.id}_input`}
                          className="settings_itemLabel">
                          {item.name}
                        </label>
                      </li>
                      {
                        item.items.map(nest_item => {
                          return (
                            <li
                              key={nest_item.id}
                              id={nest_item.id}
                              className="settings_item nested_item">
                              <label
                                htmlFor={`${nest_item.id}_input`}
                                className="settings_itemLabel">
                                {nest_item.name}
                              </label>
                              <FormInput
                                id={`${nest_item.id}_input`}
                                name={nest_item.id}
                                type={nest_item.type}
                                changeHandler={handleChange}
                                input_value={props.block_state.data[1] ? props.block_state.data[1][nest_item.id] : ''}
                              />
                            </li>
                          )
                        })
                      }
                    </ul>
                  )

                default:
                  return (
                    <li
                      key={item.id}
                      id={item.id}
                      className="settings_item">
                      <label
                        htmlFor={`${item.id}_input`}
                        className="settings_itemLabel">
                        {item.name}
                      </label>
                      <FormInput
                        id={`${item.id}_input`}
                        name={item.id}
                        type={item.type}
                        changeHandler={handleChange}
                        input_value={modalData[item.id]}
                      />
                    </li>
                  )

              }
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Modal