import { db } from "../database";

export class TestRuns {
  async createTestRun(testId: number, userId: number) {
    const createTestRun = await db("test_runs").insert({
      testId,
      userId,
      duration: 0.0,
      status: "queued",
    });

    return createTestRun;
  }

  async updateTestRun(
    testRunId: number,
    duration: number,
    results: any,
    status: string,
  ) {
    return await db("test_runs").where({ id: testRunId }).update({
      duration,
      results,
      status,
    });
  }

  async testRunsById(userId: number) {
    return await db("test_runs")
      .join("tests", "test_runs.testId", "tests.id")
      .distinct("test_runs.id", "tests.*")
      .select("test_runs.*")
      .where("test_runs.userId", userId)
      .orderBy("test_runs.createdAt", "desc");
  }
}
