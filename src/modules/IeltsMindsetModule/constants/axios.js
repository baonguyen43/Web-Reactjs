import axios from 'axios';
import { localStorageKey } from '.';

export const host = 'https://cloud.softech.cloud/mobile/ames/api';
// export const host = 'https://b6fb11008835.ngrok.io/api/IeltsWorkBookAmes';

export const baseURL = 'https://cloud.softech.vn/mobile/api';
// export const baseURL = 'https://cloud.softech.vn/mobile/api';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    // AppName: Settings.AppName,
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Bearer ${localStorage.getItem(localStorageKey.TOKEN)}`,
  },
});


export const dynamicApiAxios = {
  query: axios.create({
    baseURL: `${host}/query/dynamic`,
    headers: {
      // AppName: Settings.AppName,
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D',
    },
  }),
  execute: axios.create({
    baseURL: `${host}/execute/dynamic`,
    headers: {
      // AppName: Settings.AppName,
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D',
    },
  }),
};