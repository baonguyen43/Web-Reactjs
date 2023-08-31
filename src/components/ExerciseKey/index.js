/* eslint-disable no-mixed-operators */
import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Typography } from 'antd';
import styles from './ExerciseKey.module.css';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';

const ExerciseKey = ({ exerciseKey, visible, onClose }) => {
  const questionParse = React.useMemo(() => {
    if (exerciseKey.length === 0) return null;
    return JSON.parse(exerciseKey.questionJson);
  }, [exerciseKey.questionJson, exerciseKey.length]);

  // #region Multiple Choice

  const showAnswerMultipleType = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => (
      <React.Fragment key={index}>
        {item.answers.map((answer, indexAnswer) => {
          return answer.isCorrect ? (
            <React.Fragment key={indexAnswer}>
              <div className="ml-2 text-left">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index + 1}. </span>
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>{answer.text}</span>
              </div>
              <hr />
            </React.Fragment>
          ) : (
            <span key={indexAnswer}></span>
          );
        })}
      </React.Fragment>
    ));
  }, []);

  const showAnswerMC4 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    const answers = questionParse.questions.map((item, index) =>
      index === 0 ? ( // Dòng đầu là tiêu đề
        <Fragment key={index} />
      ) : (
        item.answers.map((v, i) =>
          v.isCorrect ? (
            <Fragment key={i}>
              <div className="text-left">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index}.&nbsp;</span>
                {/* Đáp án 'True' hay 'False' là đáp án cần chọn? */}
                {/* <span style={{ fontSize: 18, fontWeight: '400' }}>{i === 0 ? 'True' : 'False'}</span> */}
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                  {questionParse.questions[0].answers[i].text}
                </span>
              </div>
              <hr />
            </Fragment>
          ) : (
            <Fragment key={i} />
          )
        )
      )
    );
    return <Fragment>{answers}</Fragment>;
  }, []);

  const showAnswerMC5 = useCallback((questionParse) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (!questionParse) return null;
    const answers = questionParse.map((item, index) =>
      item.answers.map((v, i) =>
        v.isCorrect ? (
          <Fragment key={i}>
            <div className="text-left">
              <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index + 1}.&nbsp;</span>
              {/* Đáp án 'True' hay 'False' là đáp án cần chọn? */}
              <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                {alphabet[i].toUpperCase()}&nbsp;&mdash;&nbsp;{v.text}
              </span>
            </div>
            <hr />
          </Fragment>
        ) : (
          <Fragment key={i} />
        )
      )
    );
    return <Fragment>{answers}</Fragment>;
  }, []);
  const showAnswerMC6 = useCallback((questionParse) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'start', lineHeight: 3 }}>
          <span>{index + 1}&nbsp; : &nbsp;&nbsp;</span>
          <div>
            {item.answers.map((v, i) => {
              return v.isCorrect ? (
                // Một câu có thể có nhiều đáp án, mỗi đáp án cho xuống 1 dòng, căn lề trái.
                <div key={i} style={{ textAlign: 'left' }}>
                  {' '}
                  {alphabet[i].toUpperCase()}.&nbsp;{v.text}&nbsp; {i < item.countCorrectAnswers + 1 ? ', ' : ''}&nbsp;
                </div>
              ) : (
                <Fragment />
              );
            })}
          </div>
        </div>
      );
    });
  }, []);

  // #endregion

  // #region Select Type 1  +  2

  const showAnswerSelectType = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      // if it is Select 2
      if (item.answers) {
        return item.answers.map((answer, indexAnswer) => {
          return (
            <Fragment key={indexAnswer}>
              <div key={indexAnswer} className="ml-2 text-left">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>{indexAnswer + 1}</span>
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                  {'.  '}
                  {answer.text}
                  {'  '}
                </span>
                <hr />
              </div>
            </Fragment>
          );
        });
      }
      // if it is Select 1
      else {
        return (
          <Fragment key={item.id}>
            <div key={index} className="ml-2 text-left">
              <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index + 1}</span>
              <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                {'.  '}
                {item.text}
                {'  '}
              </span>
              <hr />
            </div>
          </Fragment>
        );
      }
    });
  }, []);

  // #endregion

  // #region Matching Type

  const showAnswerMatchingType = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return item.answers.map((answer, indexAnswer) => {
        return (
          <div key={indexAnswer} className="text-left">
            <p key={indexAnswer} className="ml-2">
              <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index + 1}. </span>
              <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                {item.question.replace(/(^\d{1,2}\.\s)/, '')} - {answer.text}
              </span>
            </p>
            <hr />
          </div>
        );
      });
    });
  }, []);

  // #endregion

  // #region Type In

  const showAnswerTypeIn = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return item.answers.map((answer, indexAnswer) => {
        return (
          <div key={indexAnswer} className="ml-2 text-left">
            <span className={`${styles.f_size} ${styles.f_Wt500}`}>{indexAnswer + 1}</span>
            <span className={`${styles.f_size} ${styles.f_Wt400}`}>
              {'.  '}
              {answer.text}
              {'  '}
            </span>
            <hr />
          </div>
        );
      });
    });
  }, []);

  const showAnswerT1 = useCallback((questionParse) => {
    if (!questionParse) return null;
    const answers = questionParse.map((item, index) => (
      <div key={index} className="text-left">
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>{item.no}.&nbsp;</span>
        {item.answers.map((v, i) => (
          <span key={i} className={`${styles.f_size} ${styles.f_Wt400}`}>
            {v.answer}
          </span>
        ))}
        <hr />
      </div>
    ));
    return <Fragment>{answers}</Fragment>;
  }, []);

  const showAnswerT2 = React.useCallback((questionParse) => {
    let count = 1;
    if (!questionParse) return null;
    return questionParse.map((item) => {
      return item.answers.map((answer, indexAnswer) => {
        return (
          <div key={indexAnswer} className="ml-2 text-left">
            <span className={`${styles.f_size} ${styles.f_Wt500}`}>{count++}. </span>
            <span className={`${styles.f_size} ${styles.f_Wt400}`}>{answer.text}</span>
            <hr />
          </div>
        );
      });
    });
  }, []);

  const showAnswerT3 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    let endIndex = 0;
    return questionParse.map((item) => {
      return item.answers.map((answer, indexAnswer) => {
        endIndex = answer.text.indexOf('/') !== -1 ? answer.text.indexOf('/') : answer.text.length;
        return (
          <div key={indexAnswer} className="ml-2 text-left">
            <span className={`${styles.f_size} ${styles.f_Wt500}`}>{indexAnswer + 1}. </span>
            <span className={`${styles.f_size} ${styles.f_Wt400}`}>
              {/* {answer.text.substring(0, endIndex)} */} {/* Chỉ lấy đáp án đầu tiên. */}
              {answer.text} {/* Trường hợp 1 câu có 2 hay nhiều đáp án. */}
            </span>
            <hr />
          </div>
        );
      });
    });
  }, []);

  const showAnswerT7 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item) => {
      return item.answers.map((answer, indexAnswer) => {
        return (
          <div key={indexAnswer} className="text-left">
            <span className={`${styles.f_size} ${styles.f_Wt500}`}>{answer.no}</span>
            {answer.text.split('').map((v, i) => (
              <span key={i} className={`${styles.f_size} ${styles.f_Wt400} ${styles.mrRight}`}>
                . {v}
              </span>
            ))}
            <hr />
          </div>
        );
      });
    });
  }, []);

  const showAnswerT8 = useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.questions.map((item, index) => {
      return item.question?.length < 1 ? (
        <Fragment key={index} />
      ) : (
        <div key={index} style={{ display: 'flex', justifyContent: 'start' }}>
          <span>
            <span>{index + 1 + '.'}&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
          <span>
            {item.answers.map((v, i) => (
              <span key={i}> {v.text}</span>
            ))}
          </span>
        </div>
      );
    });
  }, []);

  const showAnswerT9 = useCallback((questionParse) => {
    if (!questionParse) return null;
    let count = 1;
    return (
      <table style={{ fontSize: 15 }}>
        {questionParse.questions?.map((item, index) => {
          const tr1 = item.no !== 1;
          const question = item.question === 'none';
          const QSFalse = (question && !tr1) || item.question === '' || item.question === ' ';
          return (
            <tr
              key={index}
              style={{
                backgroundColor: !QSFalse ? '' : '#d7e6dc',
                color: !QSFalse ? '' : 'black',
                fontSize: !QSFalse ? '' : 18,
              }}
            >
              {/* {QSFalse ? <span /> : <td>Row {count++} :</td>} */}
              {item.question?.length < 0 ? (
                <Fragment key={index} />
              ) : (
                item.answers?.map((v, i) => {
                  if (v.correctAnswer === 'none' || (v.correctAnswer === null && !v.text.includes('#')))
                    return <Fragment />;
                  return (
                    <td key={i} style={{ fontWeight: 200 }}>
                      {v.correctAnswer === '' || v.correctAnswer === ' ' ? (
                        v.text
                      ) : (
                        <CircleTheNumberInTheText text={v.text.replace('#', `~|${v.correctAnswer}|~`)} />
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          );
        })}
      </table>
    );
  }, []);
  const showAnswerT10 = React.useCallback((questionParse) => {
    return questionParse.map((item, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            <span>{index + 1 + '.'} </span>
            <strong>{item.question + ' : '}&nbsp;&nbsp;&nbsp;&nbsp;</strong>
          </span>
          <span>
            {item.answers?.map((value, indexAnswer) => {
              return (
                <span key={indexAnswer}>
                  {value.answer}&nbsp; {indexAnswer < item.answers.length - 1 ? ', ' : ''}
                </span>
              );
            })}
          </span>
        </div>
      );
    });
  }, []);
  const showAnswerT11 = useCallback((questionParse) => {
    let count = 1;
    return questionParse.map((item, index) => {
      if (item?.question.includes('#')) {
        return (
          <div key={index} style={{ lineHeight: 2.5, display: 'flex', justifyContent: 'start' }}>
            <span>
              {item.answers.map((x, i) => {
                return (
                  <span key={i}>
                    {`${count++} .`}&nbsp;&nbsp;&nbsp;&nbsp;
                    {x.answer}
                  </span>
                );
              })}
            </span>
          </div>
        );
      }
      return null;
    });
  }, []);

  // #endregion

  // #region UnderLine In

  const showAnswerUnderLine = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return (
        <div key={index} className="text-left">
          <span className={`${styles.f_size} ${styles.f_Wt500}`}>Question {index + 1}:</span>
          {item.answers.map((answer, indexAnswer) => {
            return (
              <div key={indexAnswer} className="ml-2">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>{indexAnswer + 1}</span>
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                  {'.  '}
                  {answer.answer}
                  {'  '}
                </span>
              </div>
            );
          })}
          <hr />
        </div>
      );
    });
  }, []);

  const showAnswerU1 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    let count = 1;
    return questionParse.map((item, index) => {
      return item.answers.map((x, i) => {
        return (
          <div
            key={i}
            className={`${styles.f_size} ${styles.f_Wt500}`}
            style={{ display: 'flex', alignItems: 'center', lineHeight: 2 }}
          >
            <div>{count++} : </div>&nbsp;&nbsp;
            <div>
              <span>{x.firstCorrectAnswer} &nbsp;</span>

              {x.secondCorrectAnswer ? <span> , &nbsp;{x.secondCorrectAnswer}&nbsp; </span> : <Fragment />}

              {x.thirdCorrectAnswer ? <span> , &nbsp;{x.thirdCorrectAnswer}&nbsp;</span> : <Fragment />}
            </div>
          </div>
        );
      });
    });
  }, []);

  const showAnswerU2 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return (
        <div key={index} className="text-left">
          {item.correctAnswers.map((answer, indexAnswer) => {
            return (
              <div key={indexAnswer} className="ml-2">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>
                  {indexAnswer + 1}
                  {'.  '}
                </span>
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>{answer}</span>
                <hr />
              </div>
            );
          })}
        </div>
      );
    });
  }, []);

  const showAnswerU3 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return questionParse.map((item, index) => {
      return (
        <div key={index} className="text-left">
          {/* <span style={{ fontSize: 18, fontWeight: '500' }}>
            Question {index + 1}:
          </span> */}
          {item.correctAnswers.map((answer, indexAnswer) => {
            return (
              <div key={indexAnswer} className="ml-2">
                <span className={`${styles.f_size} ${styles.f_Wt500}`}>
                  {indexAnswer + 1}
                  {'.  '}
                </span>
                <span className={`${styles.f_size} ${styles.f_Wt400}`}>{answer}</span>
                <hr />
              </div>
            );
          })}
        </div>
      );
    });
  }, []);

  const showAnswerU4 = useCallback((questionParse) => {
    if (!questionParse) return null;
    const answers =
      questionParse.length === 1
        ? // Bài văn.
          questionParse[0].answers.map((item, index) => (
            <div key={index} className="ml-2 text-left">
              <span className={`${styles.f_size} ${styles.f_Wt500}`}>{`Index: ${parseInt(item.index) + 1} - `}</span>
              <span className={`${styles.f_size} ${styles.f_Wt400}`}>{`Answer: ${item.answer}`}</span>
              <hr />
            </div>
          ))
        : // Nhiều câu.
          questionParse.map(
            (item, index) =>
              item.answers?.length > 0 && (
                <div key={index} className="ml-2 text-left">
                  <span className={`${styles.f_size} ${styles.f_Wt500}`}>{`${index + 1}. `}</span>
                  {item.answers?.map((v, i) => (
                    <span key={i} className={`${styles.f_size} ${styles.f_Wt400}`}>
                      {v.answer.trim()}
                      {i < item.answers.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  <hr />
                </div>
              )
          );
    return <Fragment>{answers}</Fragment>;
  }, []);

  // #endregion

  // #region Drag And Drop Type

  const showAnswerDragAndDropType = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    let i = 0;
    return questionParse.map((item, index) => {
      return (
        <div key={index}>
          {/* <div className='ml-2 text-left' style={{ fontSize: 18, fontWeight: '500' }}>
            Question: {item.question}
          </div> */}

          {index > 0
            ? item.answers?.map((answer, indexAnswer) => {
                i++;
                return (
                  <div key={indexAnswer} className="ml-2 text-left">
                    <div>
                      <span className={`${styles.f_size} ${styles.f_Wt500}`}>{i}</span>
                      <span className={`${styles.f_size} ${styles.f_Wt400}`}>
                        {'.  '}
                        {answer.answer}
                        {'  '}
                      </span>
                    </div>
                    <hr />
                  </div>
                );
              })
            : ''}
        </div>
      );
    });
  }, []);

  const showAnswerDD1 = useCallback((questionParse) => {
    if (!questionParse) return;
    return questionParse.map((item, index) => (
      <div key={index} className="ml-2 text-left">
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>
          {item.no}. {item.question}:{' '}
        </span>
        {item.answers.map((v, i) => (
          <span key={i} className={`${styles.f_size} ${styles.f_Wt400}`}>
            {v.answer}
            {i < item.answers.length - 1 ? ', ' : ''}
          </span>
        ))}
        <hr />
      </div>
    ));
  }, []);

  const showAnswerDD2 = useCallback((questionParse) => {
    if (!questionParse) return;
    const answers = questionParse.map((item, index) =>
      index === 0 ? (
        <Fragment key={index} />
      ) : (
        item.answers.map((v, i) => (
          <div key={i} className="text-left">
            <span className={`${styles.f_size} ${styles.f_Wt500}`}>{index}.&nbsp;</span>
            <span className={`${styles.f_size} ${styles.f_Wt400}`}>{v.answer}</span>
            <hr />
          </div>
        ))
      )
    );
    return <Fragment>{answers}</Fragment>;
  }, []);

  const showAnswerDD3 = useCallback((questionParse) => {
    if (!questionParse) return;
    let count = 1;
    return questionParse.map((item, index) => {
      if (index === 0) return null;
      if (!item.question.includes('#')) return null;
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: 18 }}>
          <div>{item.question.match(/^\d+/) ? <span> {count++} : &nbsp;&nbsp; </span> : <Fragment />}</div>
          <div
            style={{ display: 'flex', flexDirection: item.question.match(/^\d+/) ? '' : 'column', alignItems: 'start' }}
          >
            {item.answers?.map((v, i) => {
              return (
                <span key={i} style={{ fontWeight: 'normal' }}>
                  {item.question.match(/^\d+/) ? (
                    <Fragment />
                  ) : (
                    <span style={{ color: 'black' }}>{count++} : &nbsp;&nbsp;</span>
                  )}
                  <span style={{ marginRight: 10 }}>
                    {v.answer}&nbsp;&nbsp;
                    {item.question.match(/^\d+/) ? i < item.answers.length - 1 ? ' , ' : '' : <Fragment />}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      );
    });
  }, []);

  const showAnswerDD4 = useCallback((questionParse) => {
    if (!questionParse) return;
    return questionParse.map((item, index) => (
      <div key={index} className="ml-2 text-left">
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>{item.no}. </span>
        {item.answers.map((v, i) => (
          <span key={i} className={`${styles.f_size} ${styles.f_Wt400}`}>
            {v.answer}
          </span>
        ))}
        <hr />
      </div>
    ));
  }, []);

  // #endregion

  /* ********* Question List ********* */

  const questionsList = [
    { questionType: 'MC4', questionTypeText: '', component: showAnswerMC4 },
    { questionType: 'MC5', questionTypeText: '', component: showAnswerMC5 },
    { questionType: 'MC6', questionTypeText: '', component: showAnswerMC6 },
    { questionType: 'T1', questionTypeText: '', component: showAnswerT1 },
    { questionType: 'T2', questionTypeText: '', component: showAnswerT2 },
    { questionType: 'T3', questionTypeText: '', component: showAnswerT3 },
    { questionType: 'T7', questionTypeText: '', component: showAnswerT7 },
    { questionType: 'T8', questionTypeText: '', component: showAnswerT8 },
    { questionType: 'T9', questionTypeText: '', component: showAnswerT9 },
    { questionType: 'T10', questionTypeText: '', component: showAnswerT10 },
    { questionType: 'T11', questionTypeText: '', component: showAnswerT11 },
    { questionType: 'U1', questionTypeText: '', component: showAnswerU1 },
    { questionType: 'U2', questionTypeText: '', component: showAnswerU2 },
    { questionType: 'U3', questionTypeText: '', component: showAnswerU3 },
    { questionType: 'U4', questionTypeText: '', component: showAnswerU4 },
    { questionType: 'DD1', questionTypeText: '', component: showAnswerDD1 },
    { questionType: 'DD2', questionTypeText: '', component: showAnswerDD2 },
    { questionType: 'DD3', questionTypeText: '', component: showAnswerDD3 },
    { questionType: 'DD4', questionTypeText: '', component: showAnswerDD4 },
    { questionType: '', questionTypeText: 'Multiple choice', component: showAnswerMultipleType },
    { questionType: '', questionTypeText: 'Select type', component: showAnswerSelectType },
    { questionType: 'M1', questionTypeText: 'Matching', component: showAnswerMatchingType },
    { questionType: '', questionTypeText: 'Type in', component: showAnswerTypeIn },
    { questionType: '', questionTypeText: 'Click to underline', component: showAnswerUnderLine },
    { questionType: '', questionTypeText: 'Drag and Drop', component: showAnswerDragAndDropType },
  ];

  // Bài có id 656 này làm cứng, vì từ T7 chuyển qua T2.
  // T7 là điền từng ký tự, nhưng với bài id 656 này là đoạn văn dài, nên điền từng ký tự sẽ lâu.
  const hardCodeId656 = React.useCallback((questionParse) => {
    if (!questionParse) return null;
    return (
      <div className="ml-2 text-left">
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>1. </span>
        <span className={`${styles.f_size} ${styles.f_Wt400}`}>First - Then</span>
        <hr />
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>2. </span>
        <span className={`${styles.f_size} ${styles.f_Wt400}`}>After that - Following that - Next</span>
        <hr />
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>3. </span>
        <span className={`${styles.f_size} ${styles.f_Wt400}`}>Once</span>
        <hr />
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>4. </span>
        <span className={`${styles.f_size} ${styles.f_Wt400}`}>When - Before</span>
        <hr />
        <span className={`${styles.f_size} ${styles.f_Wt500}`}>3. </span>
        <span className={`${styles.f_size} ${styles.f_Wt400}`}>Finally</span>
        <hr />
      </div>
    );
  }, []);

  const showAnswer = React.useCallback(() => {
    for (let index = 0; index < questionsList.length; index++) {
      let check = false;
      const element = questionsList[index];
      if (check) return;
      if (exerciseKey.id === 656) {
        check = true;
        return hardCodeId656(questionParse);
      }
      if (element.questionType === exerciseKey.questionType) {
        check = true;
        return <div key={index}>{element.component(questionParse)}</div>;
      }
      if (element.questionTypeText === exerciseKey.questionTypeText) {
        check = true;
        return <div key={index}>{element.component(questionParse)}</div>;
      }
    }
  }, [
    exerciseKey.id,
    exerciseKey.questionType,
    exerciseKey.questionTypeText,
    hardCodeId656,
    questionParse,
    questionsList,
  ]);

  return (
    <Drawer
      width={640}
      zIndex={2000}
      placement="right"
      closable={true}
      visible={visible}
      title={<img src="/assets/key-header.png" alt="" />}
      onClose={onClose}
      className="text-center"
    >
      <Typography.Title underline level={2} className={styles['key-title']}>
        {exerciseKey?.lesson}
      </Typography.Title>
      <Typography.Title level={3} className={styles['key-question']}>
        {exerciseKey?.exerciseName}
      </Typography.Title>
      <Typography.Title level={5}>{showAnswer()}</Typography.Title>
    </Drawer>
  );
};

ExerciseKey.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  exerciseKey: PropTypes.instanceOf(Object),
};

ExerciseKey.defaultProps = {
  exerciseKey: {},
};

export default ExerciseKey;
