import { z } from "zod";

export const TestSchema = z.object({
  description: z.string({ message: "Description is required" }),
  type: z.enum(["load", "performance", "integration"], {
    message: "Invalid type",
  }),
  config: z.object(
    {
      duration: z.number({ message: "Duration is required" }),
      method: z.enum(
        [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "PATCH",
          "HEAD",
          "OPTIONS",
          "TRACE",
          "CONNECT",
        ],
        { message: "Invalid method" },
      ),
      url: z
        .string({ message: "URL is required" })
        .url({ message: "Invalid URL" }),
      headers: z.record(z.string()).optional(),
      body: z.any().optional(),
    },
    { message: "Invalid config" },
  ),
});

export type Test = z.infer<typeof TestSchema>;
