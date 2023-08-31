import { dynamicApiAxios } from 'configs/api'

export function* getIeltsMindsetScore({ studentId, sessionId, assignmentId, takeExamTime }) {
  const response = yield dynamicApiAxios.query.post('', {
    sqlCommand: '[dbo].[p_AMES247_UpdateResultLog]',
    parameters: {
      StudentId: studentId,
      SessionId: sessionId,
      AssignmentId: assignmentId,
      TakeExamTime: takeExamTime,
    }
  })
  if (response.data.ok) {
    return response.data.items
  }
}