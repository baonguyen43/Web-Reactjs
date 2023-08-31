import { axiosAMES, dynamicApiAxios } from 'configs/api';
import soundFalse from 'assets/audioGame/soundfalse.mp3';
import soundTrue from 'assets/audioGame/soundtrue.mp3';
import soundVictory from 'assets/audioGame/victory.mp3';
import soundCountDown from 'assets/audioGame/ticktick.mp3';

export const getUser = () => {
  let studentInfo = '';
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    if (loggedInUser.typeLogin.includes('ames')) {
      studentInfo = loggedInUser.userMyames;
    }
    if (loggedInUser.typeLogin === 'ai') {
      studentInfo = loggedInUser.userMyai;
    }
    return studentInfo;
  }
  return null;
};

export const getStudentId = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    const MyAmesStudentId = loggedInUser.userMyames?.StudentId
      ? loggedInUser.userMyames?.StudentId
      : '';
    const MyAiUserId = loggedInUser.userMyai?.StudentId
      ? loggedInUser.userMyai?.StudentId
      : '';

    const studentInfo = { MyAmesStudentId, MyAiUserId };
    return studentInfo;
  }
  return null;
};

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getStarRecord = (score) => {
  let lastNumber = score.toString().split('');
  let number = parseInt(score);
  if (lastNumber[1] > 0) {
    number = lastNumber[0] + '0';
  }
  return parseInt(number) / 20;
};

export const StarCalculator = (number) => {
  let star = 0;
  if (number > 91) {
    star = 5;
  } else if (number >= 71 && number <= 90) {
    star = 4;
  } else if (number >= 51 && number <= 70) {
    star = 3;
  } else if (number >= 31 && number <= 50) {
    star = 2;
  } else if (number >= 10 && number <= 30) {
    star = 1;
  }
  return star;
};

export const getUserTrial = async (UserId) => {
  const body = {
    sqlCommand: '[dbo].[p_MYAMES_GetUsersTrialUI]',
    parameters: {},
  };

  let isActive = false;
  const response = await dynamicApiAxios.query.post('', body);
  const userItem = response.data.items.filter(
    (x) => parseInt(x.userId) === UserId
  );
  if (userItem.length > 0) isActive = true;
  return isActive;
};

export const postAnswerToAPI = async body => {
  try {
    const DATA = new FormData();
    DATA.append('answerType', body.answerType);
    DATA.append('assignmentId', body.assignmentId);
    DATA.append('notes', body.notes);
    DATA.append('questionEntityName', body.questionEntityName);
    DATA.append('groupName', body.groupName);
    DATA.append('questionGuid', body.questionGuid);
    DATA.append('questionId', body.questionId);
    DATA.append('score', body.score);
    DATA.append('sessionId', body.sessionId);
    DATA.append('studentChoice', body.studentChoice);
    DATA.append('studentId', body.studentId);
    DATA.append('takeExamTime', body.takeExamTime);
    DATA.append('duration', body.duration);

    let response = await axiosAMES.post('saveanswer', DATA);
    return response;
  } catch (error) {
    return false;
  }
};

export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomArray = (array) => {
  var m = array.length,
    t,
    i;
  // Chừng nào vẫn còn phần tử chưa được xáo trộn thì vẫn tiếp tục
  while (m) {
    // Lấy ra 1 phần tử
    i = Math.floor(Math.random() * m--);
    // Sau đó xáo trộn nó
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

// số điễm đạt yêu cầu là câu tl dúng :D
export const satisfactoryResults = 49;

export const randomTextAnswersFromAPI = (questions) => {
  if (!questions[0].text) return questions;

  questions.forEach((item, i) => {
    questions[i].answers = [];

    //push true answer to array of answer
    questions[i].answers.push({
      id: item.id,
      text: questions[i].text,
      imageUrl: questions[i].imageUrl,
      soundUrl: questions[i].soundUrl,
      isCorrect: true,
    });
    // get wrong answer array
    let wrongAnswers = questions
      .filter((x) => x.text !== questions[i].text)
      .map((t) => ({ id: t.id, text: t.text, imageUrl: t.imageUrl, soundUrl: t.soundUrl  }));

    let maxWrongAnswer = questions.length <= 3 ? questions.length - 1 : 3;

    //get wrong answers
    for (let j = 0; j < maxWrongAnswer; j++) {
      //get wrong answer (random)
      let wrongAns = wrongAnswers[getRandomInt(0, wrongAnswers.length - 1)];
      //if random existed then random again
      while (
        // eslint-disable-next-line no-loop-func
        questions[i].answers.findIndex((x) => x.text === wrongAns.text) > -1
      ) {
        wrongAns = wrongAnswers[getRandomInt(0, wrongAnswers.length - 1)];
      }
      //push wrong answer to array
      questions[i].answers.push({ ...wrongAns, isCorrect: false });
    }
  });

  return questions;
};

export const randomFourAnswersOneWay = (questions) => {

  questions.forEach((_, i) => {
    if (!questions[i].answers) return questions;
    // if(!questions[i].answers.length) return questions
    let temp = [];
    let gettedIndexes = [];
    for (let j = 0; j < questions[i].answers.length; j++) {
      let rand = getRandomInt(0, questions[i].answers.length - 1);
      while (gettedIndexes.indexOf(rand) > -1) {
        rand = getRandomInt(0, questions[i].answers.length - 1);
      }
      gettedIndexes.push(rand);
      temp.push(questions[i].answers[rand]);
    }
    questions[i].answers = temp;
  });

  return questions;
};

export const randomImageAnswersFromAPI = (questions) => {
  questions.forEach((_, i) => {
    if (!questions[i].id) return questions
    questions[i].answers = [];
    //push true answer to array of answer
    questions[i].answers.push({
      id: questions[i].id,
      text: questions[i].text,
      isCorrect: true,
      wordType: questions[i].wordType,
      imageUrl: questions[i].imageUrl,
      soundUrl: questions[i].soundUrl,
    });

    //get wrong answer array
    let wrongAnswers = questions
      .filter((x) => x.id !== questions[i].id)
      .map((t) => ({
        id: t.id,
        text: t.text,
        isCorrect: false,
        wordType: t.wordType,
        imageUrl: t.imageUrl,
        soundUrl: t.soundUrl,
      }));

    let maxWrongAnswer = questions.length <= 3 ? questions.length - 1 : 3;
    //get wrong answers
    for (let j = 0; j < maxWrongAnswer; j++) {
      //get wrong answer (random)
      let wrongAns = wrongAnswers[getRandomInt(0, wrongAnswers.length - 1)];
      // let a = questions[i].answers.findIndex(x => x.text === wrongAns.text) > -1;
      // 
      // eslint-disable-next-line no-loop-func
      while (questions[i].answers.findIndex((x) => wrongAns.id === x.id) > -1) {
        //if random existed then random again
        wrongAns = wrongAnswers[getRandomInt(0, wrongAnswers.length - 1)];
      }
      //push wrong answer to array
      questions[i].answers.push({ ...wrongAns, isCorrect: false });
    }
  });
  return questions;
};

export const getAnswerType = (questionType) => {
  switch (questionType) {
    case 'Listening':
      return '';
    case 'ListenAndRepeat':
      return 'RECORD';
    case 'OneCorrectQuestionText':
      return 'ONECHOICEANSWER';
    case 'OneCorrectQuestionImage':
      return 'ONECHOICEIMAGE';
    case 'OneTextMultiOptionOneCorrect':
      return 'ONECHOICEANSWER';
    case 'SpeakCorrectEnglishFromVietnamese':
      return 'RECORD';
    case 'RepeatTheWords':
      return 'RECORD';
    case 'LookWordAndImageThenListenAndRepeat':
      return 'RECORD';
    case 'SayTheWordsText':
      return 'RECORD';
    case 'SayTheWordsImage':
      return 'RECORD';
    case 'RepeatTheSentence':
      return 'RECORD';
    case 'RepeatTheSentence_A':
      return 'RECORD';
    case 'ScrambleWord':
      return 'SCRAMBLE';
    case 'MakeASentence':
      return 'MAKESENTENCE';
    case 'MatchingWordWithPicture':
      return 'MATCHING';
    case 'MatchingWordWithSound':
      return 'MATCHING';
    case 'MatchingSoundWithPicture':
      return 'MATCHING';
    case 'CompleteWord':
      return 'COMPLETE';
    case 'ListenAndFillToTheBlank':
      return 'FILLTHEBLANKSINGLE';
    case 'Grammar':
      return 'GRAMMAR';
    case 'ReadingLexileOnePerson': // Type 27
      return 'RECORD';
    case 'ReadingLexileTwoPerson': // Type 31
      return 'ReadingLexileTwoPerson';
    case 'ConversationOnePerson':
      return 'ConversationOnePerson';
    case 'TOEIC_LISTENING_READING':
      return 'TOEIC_LISTENING_READING';
      case 'IMAGE_TEXT_RECORD':
      return 'IMAGE_TEXT_RECORD';
    default: {
      return '';
    }
  }
};

export const getExampleByTitle = (unitAndCourse, questions) => {
  let { unit: unitName, course: courseName, rootName } = unitAndCourse;
  questions.forEach((item, index) => {
    if (!questions[index].examples) {
      questions[index].examples = [];
      return;
    }
    let { examples } = questions[index];
    if (typeof examples !== 'string') return;

    examples = JSON.parse(examples);
    questions[index].examples = [];
    let exampleArray = [];
    for (const key in examples) {
      if (key.includes(rootName)) {
        if (key === 'AMES') {
          for (const key1 in examples[key]) {
            exampleArray.push({ txtExample: examples[key][key1] });
          }
          questions[index].examples = exampleArray;
          break;
        } else {
          for (let i = 0; i < examples[key].length; i++) {
            let { course, unit } = examples[key][i];
            unit = parseInt(unit);
            if (course === courseName) {
              if (unit === unitName) {
                for (const key1 in examples[key][i]) {
                  if (key1.includes('sentence')) {
                    exampleArray.push({ txtExample: examples[key][i][key1] });
                  }
                }
                questions[index].examples = exampleArray;
                break;
              }
            }
          }
        }
      }
    }
  });
  return questions;
};

export const getExampleSound = (unitAndCourse, questions) => {
  let { course, unit } = unitAndCourse;
  let cloneQuestions = questions.map((x, i) => {
    if (!questions[i].examples) {
      questions[i].examples = [];
      return questions[i];
    }
    x.examples = x.examples.map((item, index) => {
      let soundUrl = '';
      let { text } = x;
      text = text.replace(/ /g, '-').replace(/\./g, '-');
      soundUrl = `https://cloud.softech.cloud/storage/Data/Vocabulary/Sounds/US_aws/${text}/${course}/${unit}/`;
      soundUrl += `sentence${index + 1}.mp3`;
      return { ...item, soundUrl };
    });
    return x;
  });
  return cloneQuestions;
};

export const resultAudio = (result) => {
  let sound = '';
  switch (result) {
    case 1:
      sound = soundTrue;
      break;
    case 2:
      sound = soundFalse;
      break;
    case 3:
      sound = soundVictory;
      break;
    case 4:
      sound = soundCountDown;
      break;
    default:
      break;
  }
  const audio = new Audio(sound);
  audio.play();
  return audio;
};
