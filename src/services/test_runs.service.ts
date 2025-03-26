import { db } from "../database";

export class TestRuns {
  async createTestRun(testId: number) {
    const createTestRun = await db("test_runs").insert({
      testId,
      duration: 0.0,
      status: "queued",
    });

    return createTestRun;
  }

  async updateTestRun(testRunId: number, duration: number, status: string) {
    const updateTestRun = await db("test_runs")
      .where({ id: testRunId })
      .update({
        duration,
        status,
      });
    return updateTestRun;
  }
}
