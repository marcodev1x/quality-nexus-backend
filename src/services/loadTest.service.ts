import autocannon from "autocannon";
import { TestingLoad } from "../types/Tests.ts";

export class LoadTestService {
  async autoCannonCallback(data: TestingLoad): Promise<any> {
    // Transforma o array de headers no formato esperado pelo autocannon
    const transformedHeaders: Record<string, string> = {};

    if (Array.isArray(data.config.headers)) {
      data.config.headers.forEach((header) => {
        if (header.key) {
          transformedHeaders[header.key] = header.value || "";
        }
      });
    }

    const options = {
      url: data.config.url,
      title: data.description,
      connections: data.config.usersQt,
      duration: data.config.time,
      body: data.config.body ? JSON.stringify(data.config.body) : undefined,
      headers: transformedHeaders,
      workers: data.config.workersthreads || 1,
      method: data.config.method || "GET",
      socketPath: undefined,
      reconnect: true,
      timeout: 10,
    };

    return new Promise((resolve, reject) => {
      console.log("Iniciando teste de carga com configurações:", {
        options,
      });

      autocannon(options, (err, result) => {
        if (err) {
          console.error("Erro ao executar autocannon:", err);
          reject(err);
          return;
        }
        console.log("Teste concluído com sucesso!");
        resolve(result);
      });
    });
  }
}
