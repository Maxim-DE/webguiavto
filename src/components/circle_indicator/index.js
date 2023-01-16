import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

import { status_colors } from '../graph_blocks';

const Pie = ({label, value, min, max, status}) => {
  
  let percentage

  percentage = percentage >= 100 ? 100 :
                                   ((value-min) /(max-min)) * 100
  
  return (
  <div className="linear_indicator_wrapper">
    <div className='peripheral_option_label'>{label}</div>
    <div className='extra_linear_wrap'>
      <div className='linear_bar'>
          <div className='linear_progress' style={{ width: `${percentage}%`, backgroundColor: `${status_colors[status]}`}}></div>
      </div>
      <div 
        className='linear_progress_percent' >{value}</div>
    </div>
  </div>
  );
};

export default Pie;