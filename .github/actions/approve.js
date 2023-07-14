/* eslint-env node */

const { Octokit } = require('@octokit/action');

try {
  const octokit = new Octokit();

  // event payload
  const payload = require(process.env.GITHUB_EVENT_PATH);
  const approvedComments = ['LGTM', 'Approved', 'Ready for merge'];
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  const isOwnerComment = payload.comment.author_association === 'OWNER';
  const isApprovedComment = approvedComments.includes(payload.comment.body);

  if (isOwnerComment && isApprovedComment) {
    const { data } = await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: payload.pull_request.number,
      event: 'APPROVE',
    });

    console.log(data);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
