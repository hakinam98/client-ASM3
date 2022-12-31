import axiosClient from './axiosClient';

const UserAPI = {
	postLogin: (query) => {
		const url = `/users/login${query}`;
		return axiosClient.get(url);
	},

	getDetailData: (id) => {
		const url = `/users/${id}`;
		return axiosClient.get(url);
	},

	postSignUp: (query) => {
		const url = `/users/signup${query}`;
		return axiosClient.get(url);
	},
};

export default UserAPI;
