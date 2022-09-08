import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

const graph_blocks_map = [
  {
    modulator: [
      {
        block_header:'модулятор',
        icon_type: '1',
        param_list: [
          {id:'0', label: 'Частота, МГц'},
          {id:'1', label: 'Температура, С'},
          {id:'2', label: 'Ротр, Вт'},
          {id:'3', label: 'Сила тока 1, А'},
        ],
      }
    ],

    exiter: [
      {
        block_header:'усилитель',
        icon_type: '1',
        param_list: [
          {id:'0', label: 'Напряжение, В'},
          {id:'1', label: 'Сила тока, А'},
        ],
      }
    ],

    out: [
      {
        block_header:'выход',
        icon_type: '1',
        param_list: [
          {id:'0', label: 'Рвых, Вт'},
          {id:'1', label: 'Ротр, Вт'},
          {id:'2', label: 'КСВ'},
        ],
      }
    ]
  },
];

function Status_graphs(props) {
  const [graph_data, setGraphData] = React.useState({
    data: {},
  })

  React.useEffect(() => {
    let request_obj = {
      name: 'status_graphs',
    }

    let graph_timer = setInterval(() => {
      console.dir(graph_blocks_map);
      props.updateHandler(request_obj)
    }, 10000)

  }, [])

  return (
    <div className="graphs">
      <Graph_block type="modulator" data="" />
      <Graph_block type="exiter" data="" />
      <Graph_block type="exiter" data="" />
      <Graph_block type="out" data="" />
    </div>
  )
}

function Graph_block(props) {
  return (
    <div className="graph_container">
      <div className="graph_header">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="14" height="14" rx="2" fill="#7ADC47"/>
        </svg>
        <h4>{graph_blocks_map[0][props.type][0].block_header}</h4>
      </div>
      <div className="graph_pwr_display">
          <div className="pwr_out_display">
            <div className="pwr_indicator_in"></div>
            <span>120 Вт</span>
          </div>
          <div className="pwr_out_display">
            <span>120 Вт</span>
            <div className="pwr_indicator_out"></div>
          </div>
      </div>
      <ul className="graph_main_params">
        {graph_blocks_map[0][props.type][0].param_list.map(item => {
          return (
            <li
              key={item.id}
              id={item.id}
              className="graph_item">
              <span>{item.label}</span>
              <span>0</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Status_graphs;
