import { dynamicApiAxios } from '../../../configs/api';

export function* getClassFromApi({ MyAmesStudentId, MyAiUserId }) {

  const courseResponse = yield dynamicApiAxios.query.post('', {
    sqlCommand: 'dbo.p_AMES247_GetAllCourse',
    parameters: {
      MyAmesStudentId,
      MyAiUserId,
    },
  });

  if (courseResponse.data.ok) {
    return courseResponse.data.items;
  }
}
