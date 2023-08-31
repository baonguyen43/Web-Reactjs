import Axios from 'axios';
import { get, remove } from './config';

const instance = Axios.create({
  baseURL: 'https://server.sachso.edu.vn/api/v1.0/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D',
    ApplicationName: 'SmartEducation',
  },
});

export const pdfToJPG = async (file, entityId, userId) => {
  const DATA = new FormData();
  DATA.append('files', file);
  DATA.append('moduleName', 'AMES247');
  // DATA.append('subModuleName', '');
  DATA.append('entityName', 'Sessions');
  DATA.append('entityId', entityId);
  DATA.append('sqlCommand', 'p_MYAMES_SHARE_Attachments_Add');

  // entityName: t_SACHSO_LIVEWORKSHEET_Assignments
  // entityId: 358d8538-628d-471e-8ed5-5c337f4aa8cb
  let response = {};
  if (file?.type.split('/')[1] === 'pdf') {
    response = await instance.post('pdf/upload-files', DATA);
  } else {
    response = await instance.post('dynamic/upload-files', DATA);
  }
  const { id, downloadUrl } = response.data.files[0];

  // const parameters = {
  //   sqlCommand: '[dbo].[p_MYAMES_SHARE_Attachments_UpdateTags]',
  //   parameters: {
  //     id,
  //     tags: 'LIVEWORKSHEET',
  //   },
  // };

  // await instance.post('/dynamic/execute', parameters);
  updateTags(id, 'LIVEWORKSHEET', userId)

  return { id, imgURL: downloadUrl };
};
//
export async function updateTags(id, tags, userId) {
  if (!id) return;
  const parameters = {
    sqlCommand: '[dbo].[p_MYAMES_SHARE_Attachments_UpdateTags]',
    parameters: {
      id,
      tags,
      userId,
    },
  };

  await instance.post('/dynamic/execute', parameters);
}

export const fileToURL = async (file, entityId) => {
  const DATA = new FormData();
  DATA.append('files', file);
  DATA.append('moduleName', 'AMES247');
  DATA.append('entityName', 'Sessions');
  DATA.append('sqlCommand', 'p_MYAMES_SHARE_Attachments_Add');
  DATA.append('entityId', entityId);

  // entityName: t_SACHSO_LIVEWORKSHEET_Assignments
  // entityId: 358d8538-628d-471e-8ed5-5c337f4aa8cb
  let rs = null;
  try {
    const response = await instance.post('dynamic/upload-files', DATA);
    if (response.data) {
      const { id, downloadUrl, fileName } = response.data.files[0];
      rs = { id, audioURL: downloadUrl, fileName };
    } else {
      rs = false;
    }
  } catch (error) {
    return false;
  }
  return rs;
};
// module = "MYAMES"
// subModule = "SHARE"
// entity = "Attachments"
export const fetcher = async (entityId, id) => {
  const fields = '*';
  const parameters = {
    entityId,
    entityName: 't_MYAMES_CLASSWORK_Assignments',
    id,
  };
  const sort = 'CreatedDate';

  const response = await get('Attachments', fields, parameters, sort, 'SHARE', 'MYAMES');
  return response;
};

export const updateJsonData = async (id, JsonData, userId) => {
  const DATA = {
    sqlCommand: '[dbo].[p_MYAMES_SHARE_Attachments_UpdateJsonData]',
    parameters: {
      id,
      JsonData,
      userId,
    },
  };
  console.log(DATA);
  const response = await instance.post('dynamic/execute', DATA);
  return response;
};

export const removeFile = async (id) => {
  const response = await remove('Attachments', id, 'SHARE');
  return response;
};

export default { pdfToJPG, fetcher, updateJsonData };
