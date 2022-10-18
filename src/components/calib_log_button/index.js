import React from 'react';

import log_icon from '../../imgs/log_icon.svg'

import './index.css'
import '../settings_block/index.css'

import ModalCalib from '../calib_modal';

import FormInput from '../form_input';

const CalibLogButton = (props) => {

	const [calibPassw, setCalibPassw] = React.useState({
		login: '',
		password: ''
	})

	const [isOpen, setIsOpen] = React.useState(false);

	const clickHandler = (event) => {
		event.stopPropagation();
		setIsOpen(true)
	}

	const changeHandler = (event) => {
		const target = event.target,
					value = target.value,
					name = target.name
		setCalibPassw(prevState => ({
			...prevState,
			[name]: value
		}))
	}

	const saveHandler = () => {
		const request_obj = {
      address: 'calib_passw.cgi',
      data: `login$${calibPassw.login};password$${calibPassw.password}`,
			notifications: {
				good: 'default',
				bad: 'default'
			}
    }

		props.updateHandler(request_obj)

		// setCalibPassw({
		// 	login: '',
		// 	password: ''
		// })
	}

	return (
		<>
		<div 
			className="log_button"
			onClick={clickHandler}>
			<span className='log_label'>Войти в калибровку</span>
			{/* <img src={log_icon} alt="Войти" sizes="" /> */}
		</div>
		{isOpen &&
		<ModalCalib
			header={`авторизация`}
			setIsOpen = {setIsOpen}>
				<ul className="settings_list">
					<li
						key={`calib_login`}
						id={`calib_login`}
						className="settings_item">
						<label
							htmlFor={`calib_login_input`}
							className="settings_itemLabel">
							Логин
						</label>
						<FormInput
							id={`calib_login_input`}
							name={`login`}
							type={`text`}
							changeHandler={changeHandler}
							input_value={calibPassw.login}
						/>
					</li>
					<li
						key={`calib_password`}
						id={`calib_password`}
						className="settings_item">
						<label
							htmlFor={`calib_password_input`}
							className="settings_itemLabel">
							Пароль
						</label>
						<FormInput
							id={`calib_password_input`}
							name={`password`}
							type={`text`}
							changeHandler={changeHandler}
							input_value={calibPassw.password}
						/>
					</li>
					<li
						key={`calib_password_save_item`}
						id={`calib_password_save_item`}
						className="settings_item">
						<label
							className="settings_itemLabel">
						</label>
						<FormInput
								id={`calib_password_save`}
								name={`calib_password`}
								clickHandler={saveHandler}
								label='Войти'
								type="button"
								style={{float: 'right'}} />
					</li>
				</ul>
			</ModalCalib>
		}
		</>
	);
};


export default CalibLogButton;