import * as actionTypes from './types';

export const fetchAssignmentsAction = ({ studentId, classId, sessionId, typeApp }) => ({
  type: actionTypes.FETCH_ASSIGNMENT,
  payload: { studentId, classId, sessionId, typeApp }
});
