import { dynamicApiAxios } from 'configs/api';

export function* getSessionsMyai({ classId, studentId }) {
  const response = yield dynamicApiAxios.query.post('', {
    sqlCommand: '[dbo].[p_API_AMES247_Course_GetSessions]',
    parameters: {
      userId: studentId,
      CourseId: classId,
    },
  });
  if (response.data.ok) {
    return response.data.items;
  }
}
