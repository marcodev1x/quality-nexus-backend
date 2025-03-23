import { z } from "zod";

export const TestSchema = z.object({
  description: z.string({ message: "Description is required" }),
  type: z.enum(["load", "performance", "integration"], {
    message: "Invalid type",
  }),
  config: z.object(
    {
      duration: z.number().optional(),
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
      headers: z
        .array(z.object({ key: z.string(), value: z.string() }))
        .optional(),
      body: z.any().optional(),
    },
    { message: "Invalid config" },
  ),
});

export const TestSchemaUpdate = z.object({
  testId: z.number(),
  description: z.string().optional(),
  type: z
    .enum(["load", "performance", "integration"], {
      message: "Invalid type",
    })
    .optional(),
  config: z
    .object(
      {
        duration: z.number().optional(),
        method: z
          .enum(
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
          )
          .optional(),
        url: z.string().url({ message: "Invalid URL" }).optional(),
        headers: z.array(z.string()).optional(),
        body: z.any().optional(),
      },
      { message: "Invalid config" },
    )
    .optional(),
});

export const TestSchemaDelete = z.object({
  testId: z.number(),
});

export type Test = z.infer<typeof TestSchema>;
export type TestUpdate = z.infer<typeof TestSchemaUpdate>;
