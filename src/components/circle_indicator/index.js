import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

const Pie = ({label, value, min, max}) => {
  // const good_color = [122, 220, 71];
  // const error_color = [254, 95, 85];
  // let actual_color = [0, 0, 0];

  // for (let k = 0; k < actual_color.length; k++) {
  //   let channel_value = 0;
  //   let channel_delta = (good_color[k] - error_color[k]) * (percentage/100);
  //   channel_value = good_color[k] + channel_delta;
  //   actual_color[k] = channel_value;
  // }
  const percentage = ((value-min) /(max-min))* 100
  
  return (
  <div class="linear_indicator_wrapper">
    <div className='peripheral_option_label'>{label}</div>
    <div className='extra_linear_wrap'>
      <div className='linear_bar'>
          <div className='linear_progress' style={{ width: `${percentage}%`}}></div>
      </div>
      <div 
        className='linear_progress_percent' >{value}</div>
    </div>
  </div>
  );
};

export default Pie;
