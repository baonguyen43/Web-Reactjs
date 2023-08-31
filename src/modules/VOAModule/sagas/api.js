import { axiosAPI } from 'configs/api';

export const getVOAListapi = () => {
  return axiosAPI.get('/voa/GetCategories');
};

export const getVOADetailsListapi = ({ categoryId, page = 0 }) => {
  return axiosAPI.get(`/voa/GetArticles/${categoryId}/${page}`);
};

