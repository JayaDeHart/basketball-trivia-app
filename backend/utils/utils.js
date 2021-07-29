function compareAnswers(userPpg, userFgp, userYear, apiPpg, apiFgp, apiYear) {
  const ppgCorrect = userPpg == Math.round(apiPpg);
  const fgpCorrect = userFgp == Math.round(apiFgp);
  const yearCorrect = userYear == apiYear;
  const answers = [ppgCorrect, fgpCorrect, yearCorrect];
  let numCorrect = 0;
  let numIncorrect = 0;
  answers.forEach((answer) => {
    if (answer) {
      numCorrect++;
    } else {
      numIncorrect++;
    }
  });
  return {
    ppgCorrect,
    fgpCorrect,
    yearCorrect,
    numCorrect,
    numIncorrect,
  };
}

//helper function that compares user answers with api results

module.exports.compareAnswers = compareAnswers;
