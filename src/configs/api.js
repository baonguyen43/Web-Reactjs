import axios from 'axios';

const AppName = 'WEB_MY_AMES';
const authorizationKey = 'Basic 12C1F7EF9AC8E288FBC2177B7F54D';

export const API_ = 'https://cloud.softech.cloud/mobile/api';
export const API_AMES = 'https://cloud.softech.cloud/mobile/ames/api';
export const API_MYAMES = 'https://cloud.softech.cloud/myames/myamesapi';
export const API_CalendarStudent = 'https://softech.cloud/api/v1.0/dynamic';
export const API_FIREBASE_CLOUD_FUNCTION =
  'https://us-central1-imm-crm.cloudfunctions.net';

export const axiosAMES = axios.create({
  baseURL: `${API_AMES}`,
  headers: {
    'Content-Type': 'application/json',
    'Platform': 'WEB',
    // 'secret-token': 'D8284EE5CEAAEB77281A983B5141D',
    AppName,
  }
});

export const axiosAPI = axios.create({
  baseURL: `${API_}`,
  headers: {
    'Content-Type': 'application/json',
    'Platform': 'WEB',
    AppName,
  }
});

export const axiosMYAMES = axios.create({
  baseURL: `${API_MYAMES}`,
  headers: {
    'Content-Type': 'application/json',
    'Platform': 'WEB',
    AppName,
  }
});

export const axiosMYAMESPUT = axios.create({
  baseURL: API_MYAMES,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  }
});

export const axiosCalendar = axios.create({
  baseURL: API_CalendarStudent,
  headers: {
    ApplicationName: 'EBM',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: authorizationKey
  }
});

export const dynamicApiAxios = {
  query: axios.create({
    baseURL: 'https://cloud.softech.cloud/mobile/ames/api/query/dynamic',
    headers: {
      AppName,
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: authorizationKey
    }
  }),
  execute: axios.create({
    baseURL: 'https://cloud.softech.cloud/mobile/ames/api/execute/dynamic',
    headers: {
      AppName,
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: authorizationKey
    }
  })
};

export const ames247Axios = axios.create({
  baseURL: 'https://cloud.softech.cloud/mobile/ames247/api',
  headers: {
    Platform: 'WEB',
    AppName,
    'Content-Type': 'application/json; charset=utf-8',
  },
});

