import TestRail, { AddResultsForCases, AddAttachment } from "@dlenroc/testrail"
import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult } from "@playwright/test/reporter"
let logger = console.log;

/**
 * Mapping status within Playwright & TestRail
 */
const StatusMap = new Map<string, number>([
	["failed", 5],
	["passed", 1],
	["skipped", 3],
	["timedOut", 5],
	["interrupted", 5],
])
/**
 * Initialise TestRail API credential auth
 */
const executionDateTime = Date().toString().slice(4, 25)

const api = new TestRail({
	// host: process.env.TESTRAIL_HOST as string,
	host: "https://worldmarket.testrail.io/",
	// password: process.env.TESTRAIL_PASSWORD as string,
	password: "111Acute$$",
	// username: process.env.TESTRAIL_USERNAME as string
	username: "vyshnav.chavala@worldmarket.com"
})

// const runName = process.env.TESTRAIL_RUN_NAME + " - Created On " + executionDateTime
// const projectId = parseInt(process.env.TESTRAIL_PROJECT_ID as string)
// const suiteId = parseInt(process.env.TESTRAIL_SUITE_ID as string)

const runName = "Test Playwright"
const projectId = 9;
const suiteId = 1;
const runId = 671;

const testResults: AddResultsForCases[] = []

class TestRailReporter implements Reporter {
	async onBegin?(config: FullConfig, suite: Suite) {
		if (!runId) {
			logger("No Existing 'TESTRAIL_RUN_ID' provided by user...")
			logger("Automatically creating a run...")
			await addTestRailRun(projectId)

		} else {
			logger("Existing Test Run with ID " + runId + " will be used")
		}
	}

	// async onTestEnd(test: TestCase, result: TestResult) {
	// 	logger(`Test Case Completed : ${test.title} Status : ${result.status}`);
	// 	const testCaseMatches = await getTestCaseName(test.title);
	// 	if (testCaseMatches != null) {
	// 		testCaseMatches.forEach(testCaseMatch => {
	// 			const testId = parseInt(testCaseMatch.substring(1), 10);
	// 			if (result.status != "skipped") {
	// 				const testComment = setTestComment(result, test);
	// 				const attachments = result.attachments.map(a => a.path); // Assuming attachment paths are here
	// 				const payload: AddResultsForCases = {
	// 					case_id: testId,
	// 					status_id: StatusMap.get(result.status),
	// 					comment: testComment,
	// 					attachments: attachments // Ensure this is correctly formatted for TestRail API
	// 				};
	// 				testResults.push(payload);
	// 			}
	// 		});
	// 	}
	// 	// result.stderr;
	// 	// result.errors
	// 	// logger("Updating test status for the following TestRail Run ID: " + runId)
	// 	// updateResultCases(runId, testResults)
	// }


	async onTestEnd(test: TestCase, result: TestResult) {
		logger(`Test Case Completed : ${test.title} Status : ${result.status}`);
		const testCaseMatches = await getTestCaseName(test.title);
		if (testCaseMatches != null) {
			for (const testCaseMatch of testCaseMatches) {
				const testId = parseInt(testCaseMatch.substring(1), 10);
				if (result.status != "skipped") {
					const testComment = setTestComment(result, test);
					// Assuming screenshots are saved on failure, find the relevant attachment
					const screenshotAttachment = await result.attachments.find(a => a.name === 'screenshot');
					console.log(screenshotAttachment?.path)
	
					// if (screenshotAttachment && screenshotAttachment.path) {
					// 	// Upload the screenshot to TestRail and associate it with the test case
					// 	try {
					// 		await api.addAttachmentToCase(testId , {
					// 			screenshotAttachment,
					// 		})
					// 		logger(`Screenshot uploaded for case ID: ${testId}`);
					// 	} catch (error) {
					// 		logger(`Failed to upload screenshot attachment: ${error}`);
					// 	}
					// }
	
					const payload: AddResultsForCases = {
						case_id: testId,
						status_id: StatusMap.get(result.status),
						comment: testComment,
						attachments: screenshotAttachment // Pass the attachment IDs to TestRail
						// Attachments are handled separately, so they might not be part of this payload
					};
					await testResults.push(payload);
					// await logger("Updating test status for the following TestRail Run ID: " + runId)
					// await updateResultCases(runId, testResults)
				}
			}
			// // Assuming you want to update the test run with results immediately after each test
			// if (testResults.length > 0) {
			// 	logger("Updating test status for the following TestRail Run ID: " + runId);
			// 	await updateResultCases(runId, testResults);
			// 	testResults.length = 0; // Clear the array after updating to avoid duplicate updates
			// }
			
		}
	}


	async onEnd(result: FullResult): Promise<void> {
		//const runId = parseInt(runId as string)
		logger("Updating test status for the following TestRail Run ID: " + runId)
		await updateResultCases(runId, testResults)
		
	}

	onError(error: TestError): void {
		logger(error.message)
	}

	
}
/**
 * Get list of matching Test IDs
 */
async function getTestCaseName(testname: string) {
	const testCaseIdRegex = /\bC(\d+)\b/g
	const testCaseMatches = [testname.match(testCaseIdRegex)]

	if (testCaseMatches[0] != null) {
		testCaseMatches[0].forEach((testCaseMatch) => {
			const testCaseId = parseInt(testCaseMatch.substring(1), 10)
			logger("Matched Test Case ID: " + testCaseId)
		})
	}
	else {
		logger("No test case matches available")
	}
	return testCaseMatches[0]
}

/**
 * Create TestRail Test Run ID
 * @param projectId
 * @returns
 */
async function addTestRailRun(projectId: number) {
	return await api.addRun(projectId, {
		include_all: true,
		name: runName,
		suite_id: suiteId,
	}).then(
		(res) => {
			logger("New TestRail run has been created: " + process.env.TESTRAIL_HOST +
				"/index.php?/runs/view/" + res.id)
			// runId = (res.id).toString()
		},
		(reason) => {
			logger("Failed to create new TestRail run: " + reason)
		})
}

/**
 * Add Test Result for TestSuite by Test Case ID/s
 * @param api
 * @param runId
 * @param caseId
 * @param status
 */
async function addResultForSuite(api: TestRail, runId: number, caseId: number, status: number, comment: string) {
	await api.addResultForCase(runId, caseId, {
		status_id: status,
		comment: comment
	}).then((res) => { logger("Updated status for caseId " + caseId + " for runId " + runId) },
		(reason) => { logger("Failed to call Update Api due to " + JSON.stringify(reason)) })
}
/**
 * Set Test comment for TestCase Failed | Passed
 * Enhance this function to include more detailed information for failures.
 * @param result
 * @param test
 * @returns
 */
// function setTestComment(result: TestResult, test : TestCase): string {
//     if (result.status !== "passed") {
//         // Example of a more detailed error message. Customize according to your needs.
//         const errorMessage = result.errors;
//         const stackTrace = result.errors;
//         return `Test failed: ${errorMessage}\nStack trace: ${stackTrace}\nSee attached screenshot for more details.`;
//     } else {
//         return `Test Passed in ${result.duration} ms`;
//     }
// }

function setTestComment(result: TestResult, test: TestCase): string {
    if (result.status !== "passed") {
        let errorMessage = '';
        let stackTrace = '';

        result.errors.forEach((error, index) => {
            errorMessage += `Error ${index + 1}: ${error.message}` + (result.errors.length > 1 ? "\n" : "");
            stackTrace += `Stack ${index + 1}: ${error.stack}` + (result.errors.length > 1 ? "\n" : "");
        });

        // Return a formatted string containing all error messages and stack traces
       // return `Test failed: ${errorMessage}\nStack trace: ${stackTrace}\nSee attached screenshot for more details.`;
		return `Test failed: ${errorMessage}\nStack trace: ${stackTrace}`;

    } else {
        return `Test Passed in ${result.duration} ms`;
    }
}

/**
 * Update TestResult for Multiple Cases
 * @param api
 * @param runId
 * @param payload
 */
async function updateResultCases(runId: number, payload: any) {
	await api.addResultsForCases(runId, {
		results: payload,
	}).then(
		(result) => {
			logger("Updated test results for Test Run: " + "https://worldmarket.testrail.io" +
				"/index.php?/runs/view/" + runId)
		},
		(reason) => {
			logger("Failed to update test results: " + JSON.stringify(reason))
		})
}

export default TestRailReporter;
