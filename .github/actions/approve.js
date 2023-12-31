/* eslint-env node */

const { Octokit } = require('@octokit/action');

async function run() {
  const octokit = new Octokit();

  // event payload
  const payload = require(process.env.GITHUB_EVENT_PATH);
  const approvedComments = ['Approved!'];
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  const isOwnerComment = payload.comment.author_association === 'OWNER';
  const isApprovedComment = approvedComments.includes(payload.comment.body);

  if (isOwnerComment && isApprovedComment) {
    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: payload.issue.number,
      event: 'APPROVE',
    });
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
