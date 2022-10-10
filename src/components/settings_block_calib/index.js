import React from 'react';
import ReactDOM from 'react-dom';

import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'

import '../settings_block/index.css'
import FormInput from '../form_input'
import Modal from '../modal';

import { blockData_structure_forming } from '../../logic/block_data_structure_forming';
import { flat_input_data } from '../../logic/block_data_structure_forming';
import additional_items_description from '../../logic/additional_items_description';

function Settings_block_calib({ settings_type, className = "", ...rest }) {

  // const blockData_structure = blockData_structure_forming(rest.children);
  
  // const [isOpen, setIsOpen] = React.useState(false);

  // const [isChanged, setIsChanged] = React.useState({
  //   'changed': false,
  //   'saved_data': blockData_structure,
  // });

  // React.useEffect(() => {
  //   const blockData_stringify = JSON.stringify(blockData),
  //         savedData_stringify = JSON.stringify(isChanged.saved_data);

  //   if (blockData_stringify != savedData_stringify) {
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
  // }, [blockData])

  // React.useEffect(() => {
  //   if (rest.data) {
  //     let data_flattened = flat_input_data(rest.data),
  //         state_copy = blockData;

  //     console.log(data_flattened);
  //     console.log(state_copy);

  //     for (const key in state_copy) {
  //       if (data_flattened.hasOwnProperty(key)) {
  //         state_copy[key] = data_flattened[key];
  //       }
  //     }

  //     setBlockData(state_copy);
  //   }
  // }, [rest.data])

  // const handleChange = (event) => {
  //   const target = event.target;
  //   let value;

  //   if (target.classList.contains('split')) {
  //     let split_value = target.value,
  //           separator = ' ',
  //           limit = 8,
  //           unmask_value = split_value.replace(/[^\d]/g, '')

  //     let output = [];

  //     if (unmask_value.length > (limit * 4)) {
  //       unmask_value = unmask_value.slice(0, (limit * 4))
  //     }

  //     for (let i = 0; i < unmask_value.length; i++) {
  //       if (i !== 0 && i % limit === 0) {
  //         output.push(separator);
  //       }

  //       output.push(unmask_value[i]);
  //     }

  //     value = output.join('');

  //   } else if (target.className == 'slider') {
  //     const value_string = `${event.target.min},${event.target.value},${event.target.max}`;
  //     value = value_string;

  //   } else if (event.target.className == 'text_range') {
  //     let range_inputs = event.target.parentElement.children;
  //     value = `${range_inputs[1].value},${range_inputs[3].value}`;

  //   } else {
  //     value = target.type === 'checkbox' ? target.checked : target.value;
  //   }

  //   const name = target.name;

  //   setBlockData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // }

  // const handleClick = event => {
  //   event.preventDefault();
  //   let block_data = blockData;
  //   let request_obj = {
  //     name: null,
  //     data: block_data,
  //   };
  //   rest.clickHandler(request_obj);
  // }

  return (

    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <form className="settings_container">
        <div className="settings_block_header">
          <h3>{rest.header}</h3>
          {/* <button 
            className='save_form_button'
            onClick={handleClick}
            title='Сохранить' >
            <MdDone style={{ margin: "3px 0 0 0" }} />
          </button> */}
        </div>
        <ul className="settings_list">
          {rest.children}
        </ul>
      </form>
    </div>
  )
  
}

export default Settings_block_calib;

// const custom_forms = {
//   'settings': {
//     'silence_det_settings': silence_det_block
//   }
// }

{/* {rest.items.map(item => {
  
  switch (item.type) {
    // case 'custom':
    //   return custom_forms[rest.section_name][settings_type](updateBlock, blockData)
    
    case 'custom_group':
      if (custom_groups[settings_type]) {
        const custom_group_render_structure = custom_groups[settings_type][item.id].render_structure;
        return custom_group_render_structure(handleChange, blockData, item.id, item.name)
      } else {
        
        break;
        
      }

    // case 'group': 
    //   return (
    //     <ul className="settings_list">
    //       <li
    //         key={item.id}
    //         id={item.id}
    //         className="settings_item">
    //         <label
    //           htmlFor={`${item.id}_input`}
    //           className="settings_itemLabel">
    //           {item.name}
    //         </label>
    //       </li>
    //       {
    //         item.items.map(nest_item => {
    //           return (
    //             <li
    //               key={nest_item.id}
    //               id={nest_item.id}
    //               className="settings_item nested_item">
    //               <label
    //                 htmlFor={`${nest_item.id}_input`}
    //                 className="settings_itemLabel">
    //                 {nest_item.name}
    //               </label>
    //               <FormInput
    //                 id={`${nest_item.id}_input`}
    //                 name={nest_item.id}
    //                 type={nest_item.type}
    //                 changeHandler={handleChange}
    //                 input_value={blockData[nest_item.id]}
    //               />
    //             </li>
    //           )
    //         })
    //       }
    //     </ul>
    //   )
      
  
    default:
      return (
        <li
          key={item.id}
          id={item.id}
          className="settings_item calib">
          <label
            htmlFor={`${item.id}_input`}
            className="settings_itemLabel">
            {item.name}
          </label>
        </li>
      )
      
  }
})} */}
{/* {rest.additional_items.length != 0 &&
  <li
    className="settings_item additional">
    <button 
      className='primaryBtn' 
      onClick={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }}>
      Все настройки{additional_items_description(rest.additional_items)}
    </button>
    {isOpen &&
    <Modal 
      header={rest.header}
      items={rest.items}
      additional_items={rest.additional_items}
      custom_groups={custom_groups[settings_type]}
      block_state={blockData}
      clickHandler={handleClick}
      updateHandler={handleChange}
      isChanged={isChanged.changed}
      saved_data={isChanged.saved_data}
      setBlockData={setBlockData}
      setIsOpen={setIsOpen} />
    }
  </li>
} */}