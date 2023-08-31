/* eslint-disable no-unused-expressions */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Select, Form, Button, message } from 'antd';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { CardBody, CardFooter, Row } from 'reactstrap';
import classNames from 'classnames';
import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
// import { AnswerstoGroup_every } from 'modules/IeltsMindsetModule/components/GroupAnswers';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

const Select2 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    questions: null,
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
  });

  const inputTag = '#';

  const [form] = Form.useForm();

  const inputCount = React.useRef(0);

  const submitButton = React.useRef();

  const toggleState = React.useCallback(
    (fieldName) => () => {
      setState((prevState) => ({
        ...prevState,
        [fieldName]: !prevState[fieldName],
      }));
    },
    []
  );

  const onSubmit = React.useCallback(() => {
    submitButton.current?.click();
  }, []);

  const onRetry = React.useCallback(() => {
    form.resetFields();
    setState((preState) => ({
      ...preState,
      isPointed: false,
      isDisabledRetry: true,
      isDisabledSubmit: false,
    }));
  }, [form]);

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState]);

  React.useEffect(() => {
    const randomArray = () => {
      if (!question) return null;
      const questionJson = JSON.parse(question.questionJson);
      //Tạo mảng random cho thẻ select
      let randomArray = [];
      questionJson.forEach((item, index) => {
        item.answers.forEach((answer, indexAnswer) => {
          randomArray.push(answer.text);
        });
        // for (let i = 0; i < item.answers.length / 2; i++) {
        //   const randomIndex = Math.floor(Math.random() * item.answers.length);
        //   [randomArray[i], randomArray[randomIndex]] = [randomArray[randomIndex],randomArray[i]];
        // }
        // item.randomArray = randomArray;
        item.randomArray = randomArray.sort();
        // Lúc đầu là randum ngẫu nhiên.
        // đổi sang theo thứ tự ABCD và 1234...
        // nên cmt random lại. và đổi thành sort
      });
      const handledTitle = questionJson[0].title.replaceAll(
        '<p style="text-align:justify;">',
        '<p style="text-align:left;">'
      ); //Xử lý chữ thưa do text-align: justify
      questionJson[0].title = handledTitle;
      setState((preState) => ({
        ...preState,
        isPointed: false,
        questions: questionJson,
        isDisabledSubmit: false,
        isDisabledRetry: true,
      }));
    };
    randomArray();
    form.resetFields();
    return () => {
      setState((prevState) => ({
        ...prevState,
        questions: null,
        isPointed: false,
        isDisabledSubmit: false,
        isDisabledRetry: true,
        videoVisible: false,
      }));
    };
  }, [question, form]);

  // Cập nhật điểm cho session.
  const dispatch = useDispatch();
  const fetchIeltsMindsetScore = useCallback(
    (studentId, sessionId, assignmentId, takeExamTime) => {
      const payload = { studentId, sessionId, assignmentId, takeExamTime };
      dispatch({ type: FETCH_SCORE, payload });
    },
    [dispatch]
  );
  // #region Gởi dữ liệu tới máy chủ.
  const params = useParams();
  const location = useLocation();
  const { takeExamTime } = queryString.parse(location.search);
  const StudentId = useSelector((state) => state.loginReducer.loggedInUser.userMyames.StudentId);
  const postAnswer = useCallback(
    (answers, sentences, state) => {
      // Tính điểm.
      const correctAnswers = answers.filter((item) => item.isCorrect).length;
      const score = (correctAnswers / sentences.length) * 100;
      // Thuộc tính.
      let result = {
        answerType: 'IELTS', // Đổi từ NEWWORD sang IELTS
        assignmentId: params.assignmentId,
        notes: '',
        questionEntityName: question.questionEntityName,
        groupName: '',
        questionGuid: '',
        questionId: question.id,
        score: score,
        sessionId: params.sessionId,
        studentChoice: JSON.stringify({
          book: question.book,
          unit: question.unit,
          lesson: question.lesson,
          exercise: question.exercise,
          subexercise: question.subExercise ?? '',
          answers: answers,
          score: score,
          question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send S2 answers: success'))
        .catch((error) => console.log('Send S2 answers', error));
      // Cập nhật điểm.
      fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime);
    },
    [
      StudentId,
      fetchIeltsMindsetScore,
      params.assignmentId,
      params.sessionId,
      question.book,
      question.exercise,
      question.id,
      question.lesson,
      question.questionEntityName,
      question.subExercise,
      question.unit,
      takeExamTime,
    ]
  );
  // #endregion

  //Khi hoàn thành các field
  const onFinish = React.useCallback(
    (value) => {
      const { questions } = state;
      let checkAnswerArray = [];
      questions[0].answers.forEach((answer, indexAnswer) => {
        const isCorrect = answer.text === questions[0].randomArray[value[indexAnswer]];
        checkAnswerArray.push(isCorrect);
      });
      questions[0].checkAnswerArray = checkAnswerArray;

      let answers = [];
      questions[0].checkAnswerArray.map((item, index) => {
        let indexKeyWord = parseInt(value[index]);
        let answer = questions[0].randomArray[indexKeyWord];
        return answers.push({
          indexKeyWord: !isNaN(indexKeyWord) ? indexKeyWord : -1,
          answer: answer ?? '',
          isCorrect: item,
        });
      });

      // Kiểm tra làm đủ số câu?
      if (answers.some((x) => x.indexKeyWord === -1)) {
        message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE);
        return;
      }

      setState((preState) => ({
        ...preState,
        questions,
        isPointed: true,
        isDisabledRetry: false,
        isDisabledSubmit: true,
      }));

      postAnswer(answers, state.questions[0].answers, state);
    },
    [postAnswer, state]
  );
  //Tạo thẻ select
  const contentSelect = React.useCallback(() => {
    let temp = [];

    return state.questions?.[0]?.randomArray?.map((item, index) => {
      // kiểm tra đã có giá trị trong 'temp' chưa? Nếu chưa có thì thêm giá trị, tránh trùng lặp
      if (!temp.includes(item.toLowerCase())) {
        temp.push(item.toLowerCase());
        return (
          <Select.Option className="s2-select-options" style={{ textAlign: 'left' }} key={index}>
            {item}
          </Select.Option>
        );
      }
      return null;
    });
  }, [state.questions]);

  //Dịch HTML
  const transform = React.useCallback(
    (node, index) => {
      if (node.type === 'tag' && node.name === 'p') {
        node.name = 'div';
        return convertNodeToElement(node, index, transform);
      }

      if (node.type === 'text') {
        if (!node.data.includes('#'))
          return (
            <span style={{ fontSize: 18 }}>
              <CircleTheNumberInTheText text={node.data} />
            </span>
          );
        const elementArray = node.data.split(inputTag);
        let currentInputNo = 0;
        const lengthArray = state.questions?.[0]?.randomArray.map((a) => a.length);
        const longestOption = Math.max(...lengthArray);
        return (
          <span
            key={index}
            style={{
              color: specifications.QUESTION_COLOR,
              fontSize: specifications.QUESTION_FONT_SIZE,
              margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
            }}
          >
            {elementArray.map((item, index) => {
              if (index > 0) {
                currentInputNo = inputCount.current;
                const maxInput = state.questions[0].answers.length;
                inputCount.current++;
                if (inputCount.current >= maxInput) {
                  inputCount.current = 0;
                }
              }
              let isCorrect = false;
              let color = 'black';
              if (state.isPointed) {
                isCorrect = state.questions?.[0].checkAnswerArray?.[currentInputNo];
                color = isCorrect ? '#2dce89' : '#e74c3c';
              }
              return (
                <React.Fragment key={index} style={{ backgroundColor: 'red' }}>
                  {index !== 0 && (
                    <Form.Item
                      className="ml-2 mr-2"
                      name={currentInputNo}
                      style={{ display: 'inline-block', marginBottom: 0 }}
                      // rules={[{ required: true, message: 'Please choice the answer' },]}
                    >
                      <Select
                        bordered={false}
                        disabled={state.isPointed}
                        style={{
                          width: Math.max(longestOption * 10, 100),
                          // width: specifications.WIDTH,
                          fontWeight: specifications.FONTWEIGHT,
                          color: specifications.ANSWER_COLOR,
                          borderBottom: specifications.DOTTED_Black,
                          transform: 'translateY(10px)',
                        }}
                        // disabled={state.isPointed}
                        className={styles.select}
                        size="sm"
                        showSearch
                        allowClear
                        // placeholder='---Select---'
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLocaleLowerCase()) >= 0
                        }
                        // prefix={<PhoneOutlined />}
                      >
                        {contentSelect()}
                      </Select>
                    </Form.Item>
                  )}
                  {state.isPointed && index !== 0 && (
                    <i
                      className={classNames({
                        'fas fa-check': isCorrect,
                        'fas fa-times': !isCorrect,
                      })}
                      style={{
                        color,
                        // top: -1,
                        // right: 0,
                        fontSize: 20,
                        // position: 'absolute',
                      }}
                    />
                  )}
                  <span style={{}}>
                    <CircleTheNumberInTheText text={item} />
                  </span>
                </React.Fragment>
              );
            })}
          </span>
        );
      }
    },
    [state.questions, state.isPointed, contentSelect]
  );

  const renderKeyWord = React.useCallback((item) => {
    let temp = [];
    return item.randomArray.map((itemWord, index) => {
      // kiểm tra đã có giá trị trong 'temp' chưa? Nếu chưa có thì thêm giá trị, tránh trùng lặp
      if (!temp.includes(itemWord.toLowerCase())) {
        temp.push(itemWord.toLowerCase());
        return (
          <span
            style={{
              display: specifications.DISPLAY_BLOCK,
              fontSize: specifications.FONTSIZE,
              fontWeight: specifications.FONTWEIGHT,
              backgroundColor: specifications.ANSWER_BACKGROUND_COLOR,
              padding: specifications.PADDING,
              margin: specifications.MARGIN_TOP_BOTTOM,
              color: specifications.TEXT_WHITE,
              borderRadius: specifications.Radius_3,
            }}
            key={index}
          >
            <span style={{ color: specifications.TEXT_WHITE, fontWeight: 400 }}>{itemWord}</span>
          </span>
        );
      }
      return null;
    });
  }, []);

  const renderQuestion = React.useCallback(
    (item, index) => {
      return (
        <React.Fragment key={index}>
          <Row style={{ padding: 0, margin: 0 }}>
            <div className="mb-4">{renderKeyWord(item)}</div>
          </Row>
          <Row style={{ padding: 0, margin: 0 }}>
            <Form
              form={form}
              // ref={refForm}
              autoComplete="off"
              onFinish={onFinish}
              style={{ fontSize: 18, fontWeight: '500' }}
            >
              <span style={{ fontWeight: specifications.QUESTION_FONT_WEIGHT, lineHeight: specifications.Line_height }}>
                {ReactHtmlParser(item.title, { transform })}
              </span>
              <Form.Item style={{ display: 'none' }}>
                <Button ref={submitButton} id="submitButton" htmlType="submit"></Button>
              </Form.Item>
            </Form>
          </Row>
        </React.Fragment>
      );
    },
    [renderKeyWord, form, onFinish, transform]
  );

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>{state.questions?.map(renderQuestion)}</CardBody>
      <CardFooter style={{ padding: 0 }}>
        <FooterIeltsMindset
          isDisabledSubmit={state.isDisabledSubmit}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onSubmit}
          onRetry={onRetry}
          onPlayVideo={onPlayVideo}
          audioUrl={audio}
        />
      </CardFooter>
    </React.Fragment>
  );
};

Select2.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
  audio: PropTypes.string,
};

export default Select2;
