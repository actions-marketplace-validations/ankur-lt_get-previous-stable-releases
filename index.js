const core = require('@actions/core');
const _ = require('lodash');
const axios = require('axios');

try {
  let user = core.getInput('user');
  let repoName = core.getInput('repoName');
  let accessToken = core.getInput('accessToken')
  let githubApi = 'https://api.github.com'

  let firstSet = false
  let secondSet = false
  let thirdSet = false

  console.log('Received::', user, repoName, accessToken);

  axios.get(`${githubApi}/repos/${user}/${repoName}/releases`, {
    headers: {
      'Authorization': `token ${accessToken}`
    }
  })
  .then(function (response) {
    console.log(_.get(response, 'data'));

    _.isArray(_.get(response, 'data')) && _.forEach(_.get(response, 'data'), (release) => {
      if (!release.prerelease) {
        if (!firstSet) {
          core.setOutput('previousStableTag', release.tag_name)
          console.log("Set previousStableTag as::", release.tag_name)
          firstSet = true
        }
        else if(!secondSet) {
          core.setOutput('previousSecondStableTag', release.tag_name)
          console.log("Set previousSecondStableTag as::", release.tag_name)

          secondSet = true
        }
        else if(!thirdSet) {
          core.setOutput('previousThirdStableTag', release.tag_name)
          console.log("Set previousThirdStableTag as::", release.tag_name)

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
