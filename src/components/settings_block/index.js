import React from 'react';
import ReactDOM from 'react-dom';

import { MdDone } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'

import './index.css'
import FormInput from '../form_input'
import Modal from '../modal';

import { blockData_structure_forming } from '../../logic/block_data_structure_forming';
import { flat_input_data } from '../../logic/block_data_structure_forming';
import additional_items_description from '../../logic/additional_items_description';

import silence_det_block from '../custom_groups/silence_det_settings';

import time_schedule_settings from '../custom_groups/time_schedule_settings';
import { time_server_sync_settings } from '../custom_groups/time_server_sync_settings';
import { silence_det_settings } from '../custom_groups/silence_det_settings';
import { conf_file_upload } from '../custom_groups/conf_file_upload';


function Settings_block({ settings_type, className = "", ...rest }) {

  const custom_groups = {
    'time_settings': {
      'supply_schedule': {
        'render_structure': time_schedule_settings,
        'data_structure': [
          'supply_schedule_switch',
          'time_schedule_repetition',
          'time_schedule_mon_on',
          'time_schedule_tue_on',
          'time_schedule_wed_on',
          'time_schedule_thu_on',
          'time_schedule_fri_on',
          'time_schedule_sat_on',
          'time_schedule_sun_on',
        ]
      },
      
      'time_server_sync': {
        'render_structure': time_server_sync_settings.render_structure,
        'data_structure': time_server_sync_settings.data_structure
      }
    },

    'silence_det_settings': {
      'silence_det_settings': {
        'render_structure': silence_det_settings.render_srtucture,
        'data_structure': silence_det_settings.data_structure,
      }
    },

    'misc_settings': {
      'conf_file_upload': {
        'render_structure': conf_file_upload.render_structure,
        'data_structure': conf_file_upload.data_structure,
      }
    }
  }

  const blockData_structure = blockData_structure_forming(
    rest.items, 
    rest.additional_items, 
    custom_groups[settings_type]
  );


  const [blockData, setBlockData] = React.useState(blockData_structure)
  
  const [isOpen, setIsOpen] = React.useState(false);

  const [isChanged, setIsChanged] = React.useState({
    'changed': false,
    'saved_data': blockData_structure,
  });

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

  React.useEffect(() => {
    if (rest.data) {
      let data_flattened = flat_input_data(rest.data),
          state_copy = blockData;

      console.log(data_flattened);
      console.log(state_copy);

      for (const key in state_copy) {
        if (Object.prototype.hasOwnProperty.call(data_flattened, key)) {
          state_copy[key] = data_flattened[key];
        }
      }

      setBlockData(state_copy);
    }
  }, [rest.data])

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

    } else if (event.target.className == 'text_range') {
      let range_inputs = event.target.parentElement.children;
      value = `${range_inputs[1].value},${range_inputs[3].value}`;

    } else {
      value = target.type === 'checkbox' ? target.checked : target.value;
    }

    const name = target.name;

    setBlockData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleClick = event => {
    event.preventDefault();
    let block_data = blockData;
    let data_string = '';
    
    for (const key in block_data) {
      if (block_data[key].length === 0) {
        data_string += `${key}$NULL;`

        setBlockData(prevState => ({
          ...prevState,
          [key]: ''
        }));

        continue
      }

      data_string += `${key}$${block_data[key]};`
    }
    
    let request_obj = {
      address: null,
      data: data_string,
    };

    rest.clickHandler(request_obj);
  }

  const reset_form_handleClick = event => {
    event.preventDefault();
    setBlockData(isChanged.saved_data);
  }

  // const custom_forms = {
  //   'settings': {
  //     'silence_det_settings': silence_det_block
  //   }
  // }


  return (

    <div
      className={`settings_block ${settings_type ? settings_type : ""}`}>
      <form className="settings_container">
        <div className="settings_block_header">
          <h3>{rest.header}</h3>
          <button 
            className='save_form_button'
            // style={{
            //   display: isChanged.changed ? 'block' : 'none',
            //   opacity: isChanged.changed ? '1' : '0'
            // }}
            onClick={handleClick}
            title='Сохранить' >
            <MdDone style={{ margin: "3px 0 0 0" }} />
          </button>
          {/* <button
            className='reset_form_button'
            style={{
              display: isChanged.changed ? 'block' : 'none',
              opacity: isChanged.changed ? '1' : '0'
            }}
            onClick={reset_form_handleClick}
            title='Сбросить' >
            <GrPowerReset style={{ margin: "3px -1px 0" }} />
          </button> */}
        </div>
        <ul className="settings_list">
          {rest.items.map(item => {

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
                              input_value={blockData[nest_item.id]}
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
                      input_value={
                        blockData ? blockData[`${item.id}`] : ''
                      }
                    />
                  </li>
                )
                
            }
          })}
          {rest.additional_items.length != 0 &&
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
          }
        </ul>
      </form>
    </div>
  )

}


export default Settings_block;
