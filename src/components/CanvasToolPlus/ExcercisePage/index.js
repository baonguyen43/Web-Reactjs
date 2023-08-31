/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import notificationWithIcon from 'components/Notification/notificationWithIcon';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Result, { totalScore } from './Result';
// import Footer from './Footer';
import { get } from 'helpers/QueryHelper';
import { modeFilter } from './configuration';
import useExercises, {
  DragDrop,
  Listen,
  Match,
  MultipleChoice,
  OneChoice,
  SelectWord,
  Write,
  DropDown,
} from './exercises';
import { saveToServer } from './api';

const getDataByID = (attachmentsId) => {
  if (!attachmentsId) return [];
  return get(
    'Attachments',
    '*',
    { id: attachmentsId, entityName: 't_AMES247_Sessions' },
    'CreatedDate DESC',
    'SHARE'
  ).then((res) => res[0]);
};
function ExcercisePage({
  idCurrent,
  studentId,
  file,
  isCompleted,
  isTeacher,
  refSubmit,
  isVisibleResult,
  styles,
  studentData,
}) {
  const [storeCanvas, setStoreCanvas] = useState({});
  const [resultState, setResultState] = useState({});
  //
  const exercises = useExercises({});
  //
  const listen = useRef({});
  // load inital from server
  useEffect(() => {
    const loadData = async () => {
      const fileData = await getDataByID(idCurrent);
      const fileClone = _.cloneDeep(file ?? fileData);
      console.log('🚀 ~ file: index.js:56 ~ loadData ~ fileClone:', fileClone);
      if (fileClone?.jsonData) {
        const { ExerciseData, backgroundImage, result } = fileClone.jsonData;
        setStoreCanvas({ ExerciseData, backgroundImage });
        if (result) {
          setResultState(result);
          //
          const {
            matchResult,
            writeResult,
            oneChoiceResult,
            selectWordResult,
            multipleChoiceResult,
            dragdropResult,
            dropDownResult,
          } = result;
          exercises.setResults({
            match: matchResult,
            write: writeResult,
            oneChoice: oneChoiceResult,
            multipleChoice: multipleChoiceResult,
            selectWord: selectWordResult,
            dragdrop: dragdropResult,
            dropDown: dropDownResult,
          });
          //
          if (!studentId) {
            exercises.setIsDoneAll(true);
          }
        }
      }
    };
    //
    loadData();
    return () => {
      setStoreCanvas({});
    };
  }, [exercises, file, idCurrent, studentId]);

  useEffect(() => {
    Object.assign(refSubmit.current ?? {}, {
      submit: () => {
        return handleSubmit();
      },
      tryAgain: () => {
        // exercises.setIsDoneAll(false);
        exercises.tryAgainAll();
        setResultState({});
      },
      result: () => resultState,
      isCompleted,
    });
    return () => {};
  });
  //
  const handleSubmit = useCallback(async () => {
    //
    const result = exercises.submitAll();

    const resultListen = listen.current.submit();
    //
    const total = totalScore(result);
    // Tài khoản giáo viên, khi submit, chỉ kiểm tra đúng sai, không gửi đáp án lên server.
    setResultState(result);
    if (isTeacher) {
      exercises.setIsDoneAll(true);
      return null;
    }
    const res = await saveToServer(total, { result, resultListen, ...storeCanvas }, studentData);
    if (res) {
      exercises.setIsDoneAll(true);
      notificationWithIcon('success', 'Thông báo', 'Bạn đã gửi bài làm thành công');
    }
    return res;
  }, [exercises, isTeacher, storeCanvas, studentData]);
  //
  const renderExercises = useCallback(() => {
    const { ExerciseData } = storeCanvas;
    const ex = modeFilter(ExerciseData);
    const { write, match, oneChoice, multipleChoice, selectWord, dragdrop, dropDown } = exercises;
    return (
      <>
        <Write write={write} data={ex.write} />

        <Match match={match} data={ex.match} />

        <Listen listen={listen} data={ex.listen} />

        <OneChoice oneChoice={oneChoice} data={ex.oneChoice} />

        <MultipleChoice multipleChoice={multipleChoice} data={ex.multipleChoice} />

        <SelectWord selectWord={selectWord} data={ex.selectWord} />

        <DragDrop dragdrop={dragdrop} data={ex.dragdrop} />

        <DropDown dropDown={dropDown} data={ex.dropDown} />
      </>
    );
  }, [exercises, storeCanvas]);
  //
  return (
    <div style={{ height: '100%', ...styles }}>
      {isVisibleResult && <Result data={resultState} />}
      <div style={{ maxHeight: '90%', overflow: 'auto' }}>
        <div className="match-container" style={{ position: 'relative', width: '1140px' }}>
          <img src={storeCanvas.backgroundImage} alt="" />
          {renderExercises()}
        </div>
      </div>
      {/* {(studentId && !isCompleted) && <Footer onSubmit={handleSubmit} />} */}
    </div>
  );
}

ExcercisePage.propTypes = {
  isTeacher: PropTypes.bool,
  refSubmit: PropTypes.object,
  file: PropTypes.object,
  studentId: PropTypes.any,
  isCompleted: PropTypes.any,
  isVisibleResult: PropTypes.bool,
  styles: PropTypes.object,
  studentData: PropTypes.object,
  idCurrent: PropTypes.string,
};

ExcercisePage.defaultProps = {
  isTeacher: false,
  refSubmit: {},
  file: {},
  studentId: null,
  isCompleted: null,
  isVisibleResult: true,
};

export default React.memo(ExcercisePage);
