import autocannon from "autocannon";
import { TestingLoad } from "../types/Tests.ts";

export class LoadTestService {
  async autoCannonCallback(data: TestingLoad): Promise<any> {
    autocannon(
      {
        url: data.config.url,
        connections: data.config.usersQt,
        duration: data.config.duration,
        body: data.config.body || null,
        headers: data.config.headers || null,
        method: data.config.method,
      },
      (err, result) => {
        if (err) {
          console.error("Error running autocannon:", err);
          return err;
        }
        console.log("Autocannon result:", result);
        return result;
      },
    );
  }
}
