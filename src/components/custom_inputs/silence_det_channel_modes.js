import React from 'react';
import ReactDOM from 'react-dom';

import '../form_input/index.css';

function silence_det_channel_modes_input(input_handler, state_value, id) {
  const value_range = state_value.split(',')

  return (
    <div
      className="text_range_container double_select"
      id={id}
      name={id}
    >
      <span>Осн. вход</span>
      <select
        id='silence_det_primary_channel_list'
        name='silence_det_primary_channel'
        className='double_select_item'
        onChange={input_handler}
        value={value_range[0]}
      >
        <option value='0'>Stereo</option>
        <option value='1'>AEC</option>
        <option value='2'>КСС</option>
      </select>
      <span>Рез. вход</span>
      <select
        id='silence_det_backup_channel_list'
        name='silence_det_backup_channel'
        className='double_select_item'
        onChange={input_handler}
        value={value_range[1]}
      >
        <option value='0'>Stereo</option>
        <option value='1'>AEC</option>
        <option value='2'>КСС</option>
      </select>
    </div>
  )
}

export default silence_det_channel_modes_input;