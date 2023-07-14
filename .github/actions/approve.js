const { Octokit } = require('octokit');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
  const payload = require(process.env.GITHUB_EVENT_PATH);

  // Define the specific comments that trigger approval
  const approvedComments = ['LGTM', 'Approved', 'Ready for merge'];

  // Check if the comment was made by the repository owner and matches an approved comment
  const isOwnerComment =
    payload.comment.user.login === payload.repository.owner.login;
  const isApprovedComment = approvedComments.includes(payload.comment.body);

  if (isOwnerComment && isApprovedComment) {
    // Approve the pull request
    await octokit.pulls.createReview({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.issue.number,
      event: 'APPROVE',
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
