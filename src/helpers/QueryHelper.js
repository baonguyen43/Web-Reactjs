import { sachsoServerUrl } from 'constants/serverUrls';
import axios from 'axios';
import _ from 'lodash';

const authorizationKey = 'Basic 12C1F7EF9AC8E288FBC2177B7F54D';
// const TOKEN = localStorage.getItem('TOKEN')

export function getById(entityName, fields, id, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      method: 'OPTIONS',
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        fields,
        parameters: { id },
      },
    })
      .then((response) => {
        resolve(_.first(response.data.results));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getByEntityId(entityName, fields, entityId, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      method: 'OPTIONS',
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        fields,
        parameters: entityId,
      },
    })
      .then((response) => {
        resolve(_.first(response.data.results));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function get(entityName, fields, parameters, sort, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      method: 'OPTIONS',
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        fields,
        parameters,
        sort,
      },
    })
      .then((response) => {
        resolve(response.data.results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function add(entityName, parameters, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      method: 'POST',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        parameters,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function update(entityName, entityId, parameters, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      method: 'PUT',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        entityId,
        parameters,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function remove(entityName, entityId, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/crud`,
      method: 'DELETE',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        moduleName,
        subModuleName,
        entityName,
        entityId,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteFile(entityName, entityId, fileName, subModuleName = '', moduleName = 'MYAMES', applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/files`,
      method: 'DELETE',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        entityName,
        entityId,
        fileName,
        moduleName,
        subModuleName,
        applicationName,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function execute(sqlCommand, parameters = {}, applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/execute`,
      method: 'POST',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        sqlCommand,
        parameters,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function query(sqlCommand, parameters = {}, applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/query`,
      method: 'POST',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        sqlCommand,
        parameters,
      },
    })
      .then((response) => {
        resolve(response.data.results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function queryFirst(sqlCommand, parameters = {}, applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      url: `${sachsoServerUrl}/api/v1.0/dynamic/query/first`,
      method: 'POST',
      headers: {
        Authorization: authorizationKey,
        ApplicationName: applicationName,
      },
      data: {
        sqlCommand,
        parameters,
      },
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const token =
  'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZW5hbWUiOiJzYWNoc28ifSwiaWF0IjoxNjIzOTQ3NTE5LCJleHAiOjE3ODE2Mjc1MTksImF1ZCI6IndlYmhvb2suc29mdGVjaC5jbG91ZCIsImlzcyI6InNvZnRlY2guY2xvdWQiLCJzdWIiOiJzYWNoc28ifQ.g5cijByPRAaLxHp1kv1YXrtlMbKvJjQtpaQTqmpo24hVyw9P7rMH8lLYskfmsT3tSkVbmew7SihaBns2ILcGTQ';

const sachsoClient = axios.create({
  baseURL: 'https://webhook.softech.cloud/api/sachso',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Platform: 'WEB',
    ApplicationName: 'sachso.edu.vn',
    Authorization: token,
  },
});

export function nosql_get(entityName, applicationName = 'SmartEducation') {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: 'https://webhook.softech.cloud/api/sachso/collections',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Platform: 'WEB',
        ApplicationName: applicationName,
        Authorization: token,
        collection: entityName,
      },
    })
      .then((response) => {
        resolve(response.data.results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default { query, queryFirst, execute, add, get, getById, getByEntityId, update, remove, deleteFile, nosql_get };
