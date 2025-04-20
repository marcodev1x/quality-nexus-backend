import axios, { AxiosRequestConfig } from "axios";
import { Testing, TestResult } from "../types/Tests";
import { findExpecationSpecialCase } from "../utils/expectation.utils";
import { testRunsInstance } from "../instances/testRuns.instance";
import { runExpectation } from "../helpers/runExpectation.helper";

export async function runTests(
  tests: Testing,
  userId: number,
): Promise<TestResult | Error | null> {
  const startTime = Date.now();

  const headers: Record<string, string> = {};
  tests.config.headers?.forEach((header) => {
    headers[header.key] = header.value;
  });

  if (!tests.id) return new Error("Test ID não encontrado");

  // Store the test run ID returned from createTestRun
  const testRunId = await testRunsInstance.createTestRun(tests.id, userId);

  const requestConfig: AxiosRequestConfig = {
    method: tests.config.method,
    url: tests.config.url,
    headers: headers,
    data: tests.config.body,
  };

  const mapExpectationReuse =
    tests.config.expectations?.map((expectation) => ({
      key: expectation.key,
      operator: expectation.operator,
      value: expectation.value,
    })) || [];

  try {
    const axiosTest = await axios(requestConfig);

    // Expectations
    const results = tests.config.expectations?.map(async (expectation) => {
      let actualValue = findExpecationSpecialCase(axiosTest, expectation.key);

      if (actualValue === null || actualValue === undefined) {
        return {
          status: axiosTest.status,
          TestResponse: axiosTest.data,
          key: expectation.key,
          operator: expectation.operator,
          value: expectation.value,
          passed: false,
          error: "Value not found",
        };
      }

      const { passed, error } = runExpectation(
        actualValue,
        expectation.operator,
        expectation.value,
      );

      return {
        key: expectation.key,
        operator: expectation.operator,
        value: expectation.value,
        passed: passed ? { status: true, found: actualValue } : false,
        error,
      };
    });

    const resolvedResults = results ? await Promise.all(results) : [];
    const allPassed = resolvedResults.every((result) => result.passed) ?? true;

    const duration = (Date.now() - startTime) / 1000;

    console.log({ resolvedResults, allPassed, tests, duration, testRunId });

    // Use the stored testRunId instead of tests.id
    await testRunsInstance.updateTestRun(
      testRunId[0],
      duration,
      JSON.stringify({ passed: allPassed, resolvedResults }),
      allPassed ? "completed" : "failed",
    );

    return {
      status: axiosTest.status,
      APIResponse: axiosTest.data,
      success: allPassed ? "All tests passed" : "Some tests failed",
      expectations: resolvedResults || [],
      passed: allPassed,
    };
  } catch (error: any) {
    console.log(error);
    const apiResponse =
      error && error.response && error.response.data
        ? error.response.data
        : { error: "Não foi possível conectar ao servidor" };

    const durationError = (Date.now() - startTime) / 1000;

    await testRunsInstance.updateTestRun(
      testRunId[0],
      durationError,
      JSON.stringify({
        passed: false,
        error: `Erro na execução do teste - ${error.message}`,
      }),
      "failed",
    );

    return {
      status: error.message,
      APIResponse: apiResponse,
      success: "Test failed",
      expectations: mapExpectationReuse || "Sem expects",
      passed: false,
      error: error.message,
    };
  }
}
