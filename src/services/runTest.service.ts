import axios, { AxiosRequestConfig } from "axios";
import { expect } from "chai";
import { Expectations, Testing, TestResult } from "../types/Tests";
import { findExpecationSpecialCase } from "../utils/expectation.utils";
import { testRunsInstance } from "../instances/testRuns.instance";

// Função auxiliar para executar a expectativa com segurança de tipos
function runExpectation(
  actual: any,
  operator: Expectations["operator"],
  expected: any,
): { passed: boolean; error?: string } {
  try {
    switch (operator) {
      case "equal":
        expect(actual).to.equal(expected);
        break;
      case "notEqual":
        expect(actual).to.not.equal(expected);
        break;
      case "deepEqual":
        expect(actual).to.deep.equal(expected);
        break;
      case "notDeepEqual":
        expect(actual).to.not.deep.equal(expected);
        break;
      case "strictEqual":
        expect(actual).to.equal(expected);
        break;
      case "notStrictEqual":
        expect(actual).to.not.equal(expected);
        break;
      case "isAbove":
        expect(actual).to.be.above(Number(expected));
        break;
      case "isAtLeast":
        expect(actual).to.be.at.least(Number(expected));
        break;
      case "isBelow":
        expect(actual).to.be.below(Number(expected));
        break;
      case "isAtMost":
        expect(actual).to.be.at.most(Number(expected));
        break;
      case "isTrue":
        expect(actual).to.be.true;
        break;
      case "isFalse":
        expect(actual).to.be.false;
        break;
      case "isNull":
        expect(actual).to.be.null;
        break;
      case "isNotNull":
        expect(actual).to.not.be.null;
        break;
      case "exists":
        expect(actual).to.exist;
        break;
      case "notExists":
        expect(actual).to.not.exist;
        break;
      case "length.above":
        expect(actual).to.have.length.above(Number(expected));
        break;

      default:
        new Error(`Operador não suportado: ${operator}`);
    }
    return { passed: true, error: undefined };
  } catch (error: any) {
    return { passed: false, error: error.message };
  }
}

export async function runTests(
  tests: Testing,
): Promise<TestResult | Error | null> {
  const startTime = Date.now();

  const headers: Record<string, string> = {};
  tests.config.headers?.forEach((header) => {
    headers[header.key] = header.value;
  });

  if (!tests.id) return new Error("Test ID não encontrado");

  // Store the test run ID returned from createTestRun
  const testRunId = await testRunsInstance.createTestRun(tests.id);

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

      if (actualValue === null) {
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

      if (actualValue === undefined) {
        return {
          status: axiosTest.status,
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
        passed: passed ? { status: true, found: actualValue } : null,
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
    const apiResponse =
      error && error.response && error.response.data
        ? error.response.data
        : { error: "Não foi possível conectar ao servidor" };

    await testRunsInstance.updateTestRun(
      testRunId[0],
      0,
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
