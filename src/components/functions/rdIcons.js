const BASE_ICON = {
  LISTEN: require('assets/icon/listen_32x32.png'),
  LOOK: require('assets/icon/look_2.png'),
  MATCH: require('assets/icon/match_32x32.png'),
  NEWWORD: require('assets/icon/newword.png'),
  SPEAK: require('assets/icon/speak_2_32x32.png'),
  WRITE: require('assets/icon/write.png'),
};

function AssignmentIcons(questionType) {
  switch (questionType) {
    case 'Listening':
      return [BASE_ICON.LOOK, BASE_ICON.LISTEN];

    case 'ListenAndRepeat':
      return [BASE_ICON.LISTEN, BASE_ICON.SPEAK];

    case 'OneCorrectQuestionText':
      return [BASE_ICON.LISTEN, BASE_ICON.MATCH];

    case 'OneCorrectQuestionImage':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'SpeakCorrectEnglishFromVietnamese':
      return [BASE_ICON.LOOK, BASE_ICON.SPEAK];

    case 'LookWordAndImageThenListenAndRepeat':
      return [BASE_ICON.LOOK, BASE_ICON.LISTEN, BASE_ICON.SPEAK];

    case 'SayTheWordsText':
      return [BASE_ICON.LOOK, BASE_ICON.SPEAK];

    case 'SayTheWordsImage':
      return [BASE_ICON.LOOK, BASE_ICON.SPEAK];

    case 'OneTextMultiOptionOneCorrect':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'RepeatTheWords':
      return [BASE_ICON.LOOK, BASE_ICON.LISTEN, BASE_ICON.SPEAK];

    case 'RepeatTheSentence':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.SPEAK];
    case 'ScrambleWord':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];
    case 'MakeASentence':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];
    case 'MatchingWordWithPicture':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'MatchingWordWithSound':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'MatchingSoundWithPicture':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'CompleteWord':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'ListenAndFillToTheBlank':
      return [BASE_ICON.LISTEN, BASE_ICON.WRITE];

    case 'Grammar':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    //For A
    case 'OneCorrectQuestionImage_A':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.MATCH];
    case 'RepeatTheSentence_A':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.SPEAK];
    case 'ScrambleWordForSS_A':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.MATCH];
    case 'CompleteWordForSS_A':
      return [BASE_ICON.LISTEN, BASE_ICON.LOOK, BASE_ICON.MATCH];

    //ForSS
    case 'ScrambleWordForSS':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];
    case 'CompleteWordForSS':
      return [BASE_ICON.LOOK, BASE_ICON.MATCH];

    case 'ConversationOnePerson':
      return [BASE_ICON.SPEAK, BASE_ICON.LOOK, BASE_ICON.LISTEN];

    case 'IMAGE_TEXT_RECORD':
      return [BASE_ICON.SPEAK, BASE_ICON.LOOK];

    default:
      return [BASE_ICON.SPEAK, BASE_ICON.LOOK,BASE_ICON.LISTEN];
  }
}

export default AssignmentIcons;


