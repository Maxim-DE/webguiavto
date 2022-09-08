import React from 'react';
import ReactDOM from 'react-dom';

import '../form_input/index.css';

function h_and_min_input(input_handler, state_value, id) {
    const value_range = state_value.split(',')

    return (
        <div
            className="text_range_container"
            id={id}
            name={id}
        >
            <span>часы</span>
            <input
                type="text"
                className="text_range"
                onChange={input_handler}
                data-range="0"
                value={value_range[0]}
            />
            <span>мин</span>
            <input
                type="text"
                className="text_range"
                onChange={input_handler}
                data-range="1"
                value={value_range[1]}
            />
        </div>
    )
}

export default h_and_min_input;