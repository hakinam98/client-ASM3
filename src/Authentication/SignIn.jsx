import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import UserAPI from '../API/UserAPI';
import { addSession } from '../Redux/Action/ActionSession';
import './Auth.css';
import queryString from 'query-string';
import CartAPI from '../API/CartAPI';

function SignIn(props) {
	//listCart được lấy từ redux
	const listCart = useSelector((state) => state.Cart.listCart);

	const [email, setEmail] = useState('');

	const [password, setPassword] = useState('');

	const [user, setUser] = useState({});

	const [errorEmail, setErrorEmail] = useState(false);
	const [emailRegex, setEmailRegex] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [errorWrongPassword, setErrorWrongPassword] = useState(false);
	const [errorWrongEmail, setErrorWrongEmail] = useState(false);

	const [redirect, setRedirect] = useState(false);

	const [checkPush, setCheckPush] = useState(false);

	const dispatch = useDispatch();

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const response = await UserAPI.postLogin();

	// 		setUser(response);
	// 	};

	// 	fetchData();
	// }, []);

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePassword = (e) => {
		setPassword(e.target.value);
	};

	const onSubmit = () => {
		if (!email) {
			setErrorEmail(true);
			setErrorPassword(false);
			setErrorWrongPassword(false)
			setErrorWrongEmail(false);
			setEmailRegex(false);
			return;
		} else {
			if (!password) {
				setErrorEmail(false);
				setErrorWrongEmail(false);
				setErrorWrongPassword(false)
				setErrorPassword(true);
				setEmailRegex(false);
				return;
			} else {
				setErrorPassword(false);

				if (!validateEmail(email)) {
					setEmailRegex(true);
					setErrorEmail(false);
					setErrorWrongEmail(false);
					setErrorWrongPassword(false)
					return;
				} else {
					setEmailRegex(false);
					const fetchData = async () => {
						const params = {
							email: email,
							password: password
						}
						const query = '?' + queryString.stringify(params)

						const response = await UserAPI.postLogin(query);
						console.log(response.message)
						if (response.message === 'A user with this email could not be found.') {
							setErrorWrongEmail(true);
							setErrorWrongPassword(false);
							setErrorEmail(false);
							return;
						}
						else {
							setErrorEmail(false)
							setErrorWrongEmail(false);
							if (response.message === 'Wrong password!') {
								setErrorWrongPassword(true)
								return;
							} else {
								console.log(response)
								setErrorWrongPassword(false);
								localStorage.setItem('id_user', response.userId);
								localStorage.setItem('token', response.token);
								setCheckPush(true);
								const action = addSession(localStorage.getItem('id_user'));
								dispatch(action);
							}
						}
					};

					fetchData();
				}
			}
		}
	};

	//Hàm này dùng để đưa hết tất cả carts vào API của user
	useEffect(() => {
		const fetchData = async () => {
			//Lần đầu sẽ không thực hiện insert được vì addCart = ''
			if (checkPush === true) {
				for (let i = 0; i < listCart.length; i++) {
					//Nó sẽ lấy idUser và idProduct và count cần thêm để gửi lên server
					const params = {
						idUser: localStorage.getItem('id_user'),
						idProduct: listCart[i].idProduct,
						count: listCart[i].count,
					};

					const query = '?' + queryString.stringify(params);

					const response = await CartAPI.postAddToCart(query);
					console.log(response);
				}

				setRedirect(true);
			}
		};

		fetchData();
	}, [checkPush]);

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	return (
		<div className='limiter'>
			<div className='container-login100'>
				<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50'>
					<span className='login100-form-title p-b-33'>Sign In</span>

					<div className='d-flex justify-content-center pb-5'>
						{emailRegex && (
							<span className='text-danger'>
								* Incorrect Email Format
							</span>
						)}
						{errorEmail && (
							<span className='text-danger'>
								* Please Check Your Email
							</span>
						)}
						{errorPassword && (
							<span className='text-danger'>
								* Please Check Your Password
							</span>
						)}
						{errorWrongEmail && (
							<span className='text-danger'>
								* User with this email could not be found
							</span>
						)}
						{errorWrongPassword && (
							<span className='text-danger'>
								* Wrong password
							</span>
						)}
					</div>

					<div className='wrap-input100 validate-input'>
						<input
							className='input100'
							type='text'
							placeholder='Email'
							value={email}
							onChange={onChangeEmail}
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							type='password'
							placeholder='Password'
							value={password}
							onChange={onChangePassword}
						/>
					</div>

					<div className='container-login100-form-btn m-t-20'>
						{redirect && <Redirect to={`/`} />}
						<button className='login100-form-btn' onClick={onSubmit}>
							Sign in
						</button>
					</div>

					<div className='text-center p-t-45 p-b-4'>
						<span className='txt1'>Create an account?</span>
						&nbsp;
						<Link to='/signup' className='txt2 hov1'>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
