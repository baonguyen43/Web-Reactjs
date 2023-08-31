import { axiosAMES } from 'configs/api';


export function* getAssignmentsMyames({ studentId, classId, sessionId }) {
  const response = yield axiosAMES.get(`GetStudentAssignmentBySession/${studentId}/${classId}/${sessionId}`);
  // console.log('🚀 ~ file: apiMyames.js ~ line 6 ~ function*getAssignmentsMyames ~ response', response)
  if (response.data.message === 'OK') {
    response.data.results.sessionTitle = response.data.sessionTitle;
    return response.data.results
  }

}
