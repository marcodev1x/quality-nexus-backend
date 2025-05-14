import axios, { AxiosRequestConfig } from "axios";
import { Testing, TestResult } from "../types/Tests";
import { findExpecationSpecialCase } from "../utils/expectation.utils";
import { testRunsInstance } from "../instances/testRuns.instance";
import { runExpectation } from "../helpers/runExpectation.helper";

export async function runTests(tests: Testing, userId: number): Promise<TestResult | Error | null> {
  const startTime = Date.now();

  const headers: Record<string, string> = {};
  tests.config.headers?.forEach((header) => {
    if (!header.key || !header.value) return;
    headers[header.key] = header.value;
  });

  if (!tests.id) return new Error("Test ID não encontrado");

  const testRunId = await testRunsInstance.createTestRun(tests.id, userId);

  const requestConfig: AxiosRequestConfig = {
    method: tests.config.method,
    url: tests.config.url,
    headers: headers,
    data: tests.config.body,
  };

  const mapExpectationReuse = tests.config.expectations?.map((expectation) => ({
    key: expectation.key,
    operator: expectation.operator,
    value: expectation.value,
  })) || [];

  try {
    const axiosTest = await axios(requestConfig);
    const results = await Promise.all(
      tests.config.expectations?.map(async (expectation) => {
        let actualValue = findExpecationSpecialCase(axiosTest, expectation.key);

        if (actualValue === null || actualValue === undefined) {
          return { ...expectation, passed: false, error: "Value not found" };
        }

        const { passed, error } = runExpectation(actualValue, expectation.operator, expectation.value);
        return { ...expectation, passed: passed ? { status: true, found: actualValue } : false, error };
      }) || []
    );

    const allPassed = results.every((result) => result.passed) ?? true;
    const duration = (Date.now() - startTime) / 1000;

    await testRunsInstance.updateTestRun(testRunId[0], duration, JSON.stringify({
      passed: allPassed,
      resolvedResults: results,
      axiosData: axiosTest.data,
      axiosStatus: axiosTest.status,
    }), allPassed ? "completed" : "failed");

    return { status: axiosTest.status, APIResponse: axiosTest.data, success: allPassed ? "All tests passed" : "Some tests failed", expectations: results, passed: allPassed };

  } catch (error: any) {
    const apiResponse = error.response?.data || { error: "Não foi possível conectar ao servidor" };
    const durationError = (Date.now() - startTime) / 1000;

    await testRunsInstance.updateTestRun(testRunId[0], durationError, JSON.stringify({
      passed: false,
      error: `Erro na execução do teste - ${error.message}`,
    }), "failed");

    return { status: error.message, APIResponse: apiResponse, success: "Test failed", expectations: mapExpectationReuse, passed: false, error: error.message };
  }
}
