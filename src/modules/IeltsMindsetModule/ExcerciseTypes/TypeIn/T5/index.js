/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { Col, Row } from 'reactstrap';
import styles from './styles.module.css';
import FooterModal from '../../../FooterModal';
// import ReactTextDiff from 'react-text-diff';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
const defaultStyles = {
  variables: {
    light: {
      diffViewerBackground: '#fff',
      diffViewerColor: '#212529',
      addedBackground: '#e6ffed',
      addedColor: '#24292e',
      removedBackground: '#ffeef0',
      removedColor: '#24292e',
      wordAddedBackground: '#27ae60',
      wordRemovedBackground: '#e74c3c',
      addedGutterBackground: '#cdffd8',
      removedGutterBackground: '#ffdce0',
      gutterBackground: '#f7f7f7',
      gutterBackgroundDark: '#f3f1f1',
      highlightBackground: '#fffbdd',
      highlightGutterBackground: '#fff5b1',
      codeFoldGutterBackground: '#dbedff',
      codeFoldBackground: '#f1f8ff',
      emptyLineBackground: '#fafbfc',
      gutterColor: '#212529',
      addedGutterColor: '#212529',
      removedGutterColor: '#212529',
      codeFoldContentColor: '#212529',
      diffViewerTitleBackground: '#fafbfc',
      diffViewerTitleColor: '#212529',
      diffViewerTitleBorderColor: '#eee',
    },
    dark: {
      diffViewerBackground: '#2e303c',
      diffViewerColor: '#FFF',
      addedBackground: '#044B53',
      addedColor: 'white',
      removedBackground: '#632F34',
      removedColor: 'white',
      wordAddedBackground: '#055d67',
      wordRemovedBackground: '#7d383f',
      addedGutterBackground: '#034148',
      removedGutterBackground: '#632b30',
      gutterBackground: '#2c2f3a',
      gutterBackgroundDark: '#262933',
      highlightBackground: '#2a3967',
      highlightGutterBackground: '#2d4077',
      codeFoldGutterBackground: '#21232b',
      codeFoldBackground: '#262831',
      emptyLineBackground: '#363946',
      gutterColor: '#464c67',
      addedGutterColor: '#8c8c8c',
      removedGutterColor: '#8c8c8c',
      codeFoldContentColor: '#555a7b',
      diffViewerTitleBackground: '#2f323e',
      diffViewerTitleColor: '#555a7b',
      diffViewerTitleBorderColor: '#353846',
    }
  },
  diffContainer: {}, // style object
  diffRemoved: {}, // style object
  diffAdded: {}, // style object
  marker: {}, // style object
  emptyGutter: {}, // style object
  highlightedLine: {}, // style object
  lineNumber: {}, // style object
  highlightedGutter: {}, // style object
  contentText: {}, // style object
  gutter: {}, // style object
  line: {}, // style object
  wordDiff: {}, // style object
  wordAdded: {}, // style object
  wordRemoved: {}, // style object
  codeFoldGutter: {}, // style object
  codeFold: {}, // style object
  emptyLine: {}, // style object
  content: {}, // style object
  titleBlock: {}, // style object
  splitView: {}, // style object
}
const TypeIn5 = ({ question }) => {
  const [state, setState] = React.useState({
    questions: null,
    editable: null,
    correctAnswersHTML: null,
    // isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
    randomArray: []
  });

  React.useEffect(() => {
    const questions = JSON.parse(JSON.stringify(question));
    setState((prevState) => ({ ...prevState, questions }))
  }, [question])

  const [form] = Form.useForm();

  const submitButton = React.useRef();

  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onSubmit = React.useCallback(() => {
    submitButton.current?.click()
  }, [])

  const onRetry = React.useCallback(() => {
    setState((preState) => ({ ...preState, isDisabledRetry: true, isDisabledSubmit: false, editable: null }))
  }, [])

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])


  const onFinish = React.useCallback((value) => {

    const innerHTML = document.getElementById('editable').innerHTML
    const elementInput = document.createElement('div')
    elementInput.innerHTML = innerHTML
    const editable = elementInput.innerText

    const element = document.createElement('div')
    element.innerHTML = state.questions[0].answer
    const correctAnswersHTML = element.innerText

    setState((preState) => ({ ...preState, editable, correctAnswersHTML, isDisabledSubmit: true, isDisabledRetry: false }))
  }, [state.questions])

  const renderQuestion = React.useCallback(() => {
    return (
      <>
        <Row>
          <Form
            form={form}
            // ref={refForm}
            autoComplete="off"
            onFinish={onFinish}
            style={{ fontSize: 18, fontWeight: '500', display: 'contents' }}
          >
            <div id='editable' style={{}} className='ml-4' contentEditable dangerouslySetInnerHTML={{ __html: state.questions[0].question }} />

            <Form.Item style={{ display: 'none' }}>
              <Button ref={submitButton} id='submitButton' htmlType="submit"></Button>
            </Form.Item>
          </Form>
        </Row>
      </>
    );
  }, [form, onFinish, state.questions]);

  const renderContent = React.useCallback((str) => {
    return (
      <pre
        style={{ display: 'inline', fontFamily: 'arial', fontSize: 15, fontWeight: '500' }}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(str, Prism.languages.javascript),
        }}
      />
    )

  }, [])

  if (!state.questions) return null

  return (
    <>
      <Row className='flex flex-1 justify-content-center'>
        <Col className='d-initial justify-content-center'>
          {!state.editable && (
            renderQuestion()
          )}

          {state.editable && (
            <div>
              <ReactDiffViewer
                styles={defaultStyles}
                // leftTitle='Your Text'
                splitView
                // rightTitle='Correct Text'
                showDiffOnly={false}
                hideLineNumbers
                // disableWordDiff
                // showDiffOnly={false}
                oldValue={state.editable}
                newValue={state.correctAnswersHTML}
                compareMethod={DiffMethod.WORDS}
                renderContent={renderContent}
              />;
            </div>
          )}

          {state.videoVisible && (
            <Row className={styles.centeredRow}>
              <div className={styles['video-container']}>
                <iframe title='video'
                  src="https://www.youtube.com/embed/tgbNymZ7vqY">
                </iframe>
              </div>
            </Row>
          )}
        </Col>
      </Row>
      <Row className='mt-4'>
        <FooterModal
          onRetry={onRetry}
          onSubmit={onSubmit}
          onPlayVideo={onPlayVideo}
          isDisabledRetry={state.isDisabledRetry}
          isDisabledSubmit={state.isDisabledSubmit}
        />
      </Row>
    </>
  )
};

TypeIn5.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default TypeIn5;
