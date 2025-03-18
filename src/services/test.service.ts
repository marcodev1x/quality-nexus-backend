import { db } from "../database";
import { Test } from "../models/Test.model";
import { userInstance } from "../instances/user.instance";

export class TestService {
  async createTest(test: Test, userEmail: string) {
    if (!userEmail) return null;
    const { id } = await userInstance.findUserSecrettly(userEmail);

    if (!id) return null;

    const createTest = await db("tests").insert({
      ...test,
      user_id: id,
    });

    if (!createTest) return null;

    return this.publicFindTest(createTest[0]);
  }

  async publicFindTest(testId: number) {
    return await db("tests")
      .select("description", "type", "config")
      .where("id", testId)
      .first();
  }
}
