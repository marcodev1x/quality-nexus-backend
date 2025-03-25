import { db } from "../database";
import { Test, TestUpdate } from "../models/Test.model";
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
    return db("tests")
      .select("description", "type", "config")
      .where("id", testId)
      .first();
  }

  async updateTest(testId: number, data: TestUpdate) {
    const findTestById = await this.publicFindTest(testId);

    if (!findTestById) return null;

    const updateTest = await db("tests")
      .where("id", testId)
      .update({
        description: data.description || findTestById.description,
        type: data.type || findTestById.type,
        config: JSON.stringify(data.config || findTestById.config),
      });

    if (!updateTest) return null;

    return this.publicFindTest(testId);
  }

  async deleteTest(testId: number) {
    const testToDelete: Test = await this.publicFindTest(testId);

    if (!testToDelete) return null;

    await db("tests").where("id", testId).del();

    return { testId, testToDelete };
  }

  async findListsByUserId(userEmail: string) {
    const findUserByIdSecretly = await userInstance.findUserSecrettly(
      userEmail,
    );

    if (!findUserByIdSecretly) return null;

    const findLists: Test[] = await db("tests")
      .select(
        "tests.id",
        "tests.description",
        "tests.type",
        "tests.config",
        "tests.createdAt",
      )
      .join("TODO_USER", "tests.user_id", "TODO_USER.id")
      .where({
        user_id: findUserByIdSecretly.id,
      });

    return findLists;
  }
}
