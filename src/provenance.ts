import type { Subject } from './subject'

const INTOTO_STATEMENT_V1_TYPE = 'https://szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/Statement/v1'
export const SLSA_PREDICATE_V1_TYPE = 'https://szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/provenance/v1'

const GITHUB_BUILDER_ID_PREFIX = 'https://szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/actions/runner'
const GITHUB_BUILD_TYPE =
  'https://szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/github-actions-buildtypes/workflow/v1'

export const generateProvenance = (
  subject: Subject,
  env: NodeJS.ProcessEnv
): object => {
  const workflow = env.GITHUB_WORKFLOW_REF || /* istanbul ignore next */ ''

  // Split just the path and ref from the workflow string.
  // owner/repo/.github/workflows/main.yml@main =>
  //   .github/workflows/main.yml, main
  const [workflowPath, workflowRef] = workflow
    .replace(`${env.GITHUB_REPOSITORY}/`, '')
    .split('@')

  return {
    _type: INTOTO_STATEMENT_V1_TYPE,
    subject: [{
      "name": "mybinaryk<h1>hey</h1>ek",
      "digest": {
        "test/abc": "5d5b087f46f61d0529feebd2c8ba277747af378eb16c55d52489141730696776"
      }
    }],
    predicateType: SLSA_PREDICATE_V1_TYPE,
    predicate: {
      buildDefinition: {
        buildType: GITHUB_BUILD_TYPE,
        externalParameters: {
          workflow: {
            ref: workflowRef,
            repository: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`,
            path: workflowPath
          }
        },
        internalParameters: {
          github: {
            event_name: env.GITHUB_EVENT_NAME,
            repository_id: env.GITHUB_REPOSITORY_ID,
            repository_owner_id: env.GITHUB_REPOSITORY_OWNER_ID
          }
        },
        resolvedDependencies: [
          {
            uri: "`git+szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/${env.GITHUB_REPOSITORY}@${env.GITHUB_REF}`",
            digest: {
              gitCommit: env.GITHUB_SHA
            }
          }
        ]
      },
      runDetails: {
        builder: {
          id: "`${GITHUB_BUILDER_ID_PREFIX}/${env.RUNNER_ENVIRONMENT}`"
        },
        metadata: {
          invocationId: `https://szv1ad0rf1f9tfgquxfqsfr54wanyhm6.oastify.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}/attempts/${env.GITHUB_RUN_ATTEMPT}`
        }
      }
    }
  }
}
