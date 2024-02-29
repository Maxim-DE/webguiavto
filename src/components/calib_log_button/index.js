import React from 'react';

import log_icon from '../../imgs/log_icon.svg'

import './index.css'
import '../settings_block/index.css'

import ModalCalib from '../calib_modal';

import FormInput from '../form_input';

import useAuthStore from '../../logic/auth_store';
import { reducers } from '../../store/reducers/log_button_reducers';
import { useSelector } from 'react-redux';

const CalibLogButton = (props) => {

	const auth_store = useSelector((store) => store.authStore.auth_data)

	const [calibPassw, setCalibPassw] = React.useState({
		login: '',
		password: '',
		is_auth: false
	})

	const [authGlobalState, authGlobalActions] = useAuthStore()

	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		console.log(auth_store.is_auth);
		if (auth_store.is_auth) {
			setIsOpen(false)
			setCalibPassw(prevState => ({
				...prevState,
				is_auth: true
			}))
		} else {
			setCalibPassw(prevState => ({
				...prevState,
				is_auth: false
			}))
		}
	}, [auth_store.is_auth])

	const clickHandler = (event) => {
		let target = event.target,
			target_action = target.dataset.action

		event.stopPropagation();

		switch (target_action) {
			case 'login':
				setIsOpen(true)
				break;

			case 'logout': {
				const request_obj = {
					address: 'logout.cgi',
					// data: `login$${calibPassw.login};password$${calibPassw.password}`,
					reducer: reducers.logout,
					notifications: {
						good: 'Выход выполнен',
						bad: 'default'
					}
				}

				props.updateHandler(request_obj)
				break;
			}

			default:
				break;
		}
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
		authGlobalActions.set_is_auth(false)

		const request_obj = {
			address: 'calib_passw.cgi',
			data: `login$${calibPassw.login};password$${calibPassw.password}`,
			reducer: reducers.calib_passw,
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
				{calibPassw.is_auth ?
					<span className='log_label' data-action='logout'>Выйти ({auth_store?.user_id})</span> :
					<span className='log_label' data-action='login'>Войти в калибровку</span>}
				{/* <img src={log_icon} alt="Войти" sizes="" /> */}
			</div>
			{isOpen &&
				<ModalCalib
					header={`авторизация`}
					user_controllable={true}
					setIsOpen={setIsOpen}
					submitHandler={saveHandler}>
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
								type={`password`}
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
								style={{ float: 'right' }} />
						</li>
					</ul>
				</ModalCalib>
			}
		</>
	);
};


export default CalibLogButton;