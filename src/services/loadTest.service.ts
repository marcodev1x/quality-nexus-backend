import autocannon from "autocannon";
import { TestingLoad } from "../types/Tests.ts";
import { testRunsInstance } from "../instances/testRuns.instance.ts";


export class LoadTestService {
  async autoCannonCallback(
    data: TestingLoad,
    userId: number,
  ): Promise<autocannon.Result | undefined> {
    const transformedHeaders: Record<string, string> = {};

    if (Array.isArray(data.config.headers)) {
      data.config.headers.forEach((header) => {
        if (header.key) {
          transformedHeaders[header.key] = header.value || "";
        }
      });
    }

    const validateFalsyBody = () => {
      if(data.config.body === "N/A" ||
        data.config.body === null ||
        data.config.body === undefined ||
        data.config.body === "" || data.config.body === 0 ||
        data.config.body === false
      ) {
        return false;
      }

      return true;
    }

    const options = {
      url: data.config.url,
      title: data.description,
      connections: data.config.usersQt,
      duration: data.config.time,
      body: validateFalsyBody() ? JSON.stringify(data.config.body) : undefined,
      headers: {
        ...(validateFalsyBody() ? { "Content-Type": "application/json" } : {}),
        ...transformedHeaders,
      },
      workers: data.config.workersthreads || 1,
      method: data.config.method || "GET",
      socketPath: undefined,
      reconnect: true,
      timeout: 10,
    };

    return new Promise(async (resolve, reject) => {
      console.log("Iniciando teste de carga com configurações:", {
        options,
      });

      const createTestRunner = await testRunsInstance.createTestRun(
        data.id ? data.id : 0,
        userId,
      );

      autocannon(options, async (err, result) => {
        if (err) {
          console.error("Erro ao executar autocannon:", err);
          reject(err);
          return;
        }
        console.log("Teste concluído com sucesso!");
        resolve(result);

        await testRunsInstance.updateTestRun(
          createTestRunner[0],
          result.duration,
          JSON.stringify(result),
          "completed",
        );
      });
    });
  }
}
