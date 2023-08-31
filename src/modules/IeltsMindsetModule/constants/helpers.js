export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const compare = (a, b) => {
    var noA = parseInt(a.no);
    var noB = parseInt(b.no);

    let comparison = 0;
    if (noA > noB) {
        comparison = 1;
    } else if (noA < noB) {
        comparison = -1;
    }
    return comparison;
}

export const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//ckeditor configs
export const editorConfiguration = {
    toolbar: [
        'Heading',
        'bold',
        'underline',
        'italic',
        'Strikethrough',
        'Alignment',
        'FontSize',
        'FontColor',
        'FontFamily',
        'Highlight',
        'HorizontalLine',
    ]
};



      // try {
      //   const response = await dynamicApiAxios.execute.post('', {
      //     sqlCommand: '[dbo].[p_AMES247_RESOURCES_IELTS_Question_Insert]',
      //     parameters: {
      //       Book: 'IELTS',
      //       Lesson: body.lesson,
      //       Unit: body.unit,
      //       Exercise: body.exercise,
      //       ExerciseName: body.exerciseName,
      //       QuestionType: body.questionType,
      //       QuestionsText: body.questionText,
      //       QuestionJson: JSON.stringify(body.questions),
      //     }
      //   });
      // } catch (error) {
      //   console.log(error);
      //   return message.error('An error has occurred while updating !');
      // }
      // message.success("Update successful");
      // onReset();
      // return;