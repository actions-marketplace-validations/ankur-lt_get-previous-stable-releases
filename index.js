const core = require('@actions/core');
const _ = require('lodash');
const axios = require('axios');

try {
  let user = core.getInput('user');
  let repoName = core.getInput('repoName');
  let accessToken = core.getInput('accessToken');
  let stable = core.getBooleanInput('stable')
  let githubApi = 'https://api.github.com'

  let firstSet = false
  let secondSet = false
  let thirdSet = false

  console.log('Received arguments::', user, repoName, accessToken, stable);

  axios.get(`${githubApi}/repos/${user}/${repoName}/releases`, {
    headers: {
      'Authorization': `token ${accessToken}`
    }
  })
  .then(function (response) {
    // console.log("Previous releases: ", _.get(response, 'data'));

    _.isArray(_.get(response, 'data')) && _.forEach(_.get(response, 'data'), (release) => {
      if ((stable === true && !release.prerelease) || (stable === false)) {
        if (!firstSet) {
          core.setOutput('previousTag', release.tag_name)
          console.log("Set previousTag as::", release.tag_name)
          firstSet = true
        }
        else if(!secondSet) {
          core.setOutput('previousSecondTag', release.tag_name)
          console.log("Set previousSecondTag as::", release.tag_name)

          secondSet = true
        }
        else if(!thirdSet) {
          core.setOutput('previousThirdTag', release.tag_name)
          console.log("Set previousThirdTag as::", release.tag_name)

          thirdSet = true
        }
      }

      if (firstSet && secondSet && thirdSet) {
        return
      }
    });

  })
  .catch(function (error) {
    console.log(error);
    core.setFailed(error);
  })


} catch (error) {
  core.setFailed(error.message);
}
