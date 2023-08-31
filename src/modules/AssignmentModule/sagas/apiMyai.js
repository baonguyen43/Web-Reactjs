import { dynamicApiAxios } from 'configs/api';

export function* getAssignmentsMyai({ studentId, sessionId, AppName }) {
  const response = yield dynamicApiAxios.query.post('', {
    sqlCommand: '[dbo].[p_AMES247_StudentAssignments_BySession]',
    parameters: {
      studentId,
      SessionId: sessionId,
      AppName,
    },
  });
  if (response.data.ok) {
    return response.data.items;
  }
}

export function* getTOEICListening({ studentId, sessionId }) {
  const response = yield dynamicApiAxios.query.post('', {
    sqlCommand: '[dbo].[p_AMES247_ReadingListeningQuestions_GetPart_V2]',
    parameters: {
      StudentId: studentId,
      SessionId: sessionId,
    },
  });
  if (response.data.ok) {
    return response.data.items;
  }
}
