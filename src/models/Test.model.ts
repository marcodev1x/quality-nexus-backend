import { z } from "zod";

const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "TRACE",
  "CONNECT",
] as const;

const expectationOperators = [
  "equal",
  "notEqual",
  "deepEqual",
  "notDeepEqual",
  "strictEqual",
  "notStrictEqual",
  "deepStrictEqual",
  "notDeepStrictEqual",
  "isAbove",
  "isAtLeast",
  "isBelow",
  "isAtMost",
  "isTrue",
  "isNotTrue",
  "isFalse",
  "isNotFalse",
  "isNull",
  "isNotNull",
  "isNaN",
  "isNotNaN",
  "exists",
  "notExists",
  "isUndefined",
  "isDefined",
  "isFunction",
  "isNotFunction",
  "isObject",
  "isNotObject",
  "isArray",
  "isNotArray",
  "isString",
  "isNotString",
  "isNumber",
  "isNotNumber",
  "isBoolean",
  "isNotBoolean",
  "typeOf",
  "notTypeOf",
  "instanceOf",
  "notInstanceOf",
  "include",
  "notInclude",
  "deepInclude",
  "notDeepInclude",
  "nestedInclude",
  "notNestedInclude",
  "deepNestedInclude",
  "notDeepNestedInclude",
  "ownInclude",
  "notOwnInclude",
  "deepOwnInclude",
  "notDeepOwnInclude",
  "match",
  "notMatch",
  "property",
  "notProperty",
  "deepProperty",
  "notDeepProperty",
  "propertyVal",
  "notPropertyVal",
  "deepPropertyVal",
  "notDeepPropertyVal",
  "lengthOf",
  "hasAnyKeys",
  "hasAllKeys",
  "containsAllKeys",
  "doesNotHaveAnyKeys",
  "doesNotHaveAllKeys",
  "throws",
  "doesNotThrow",
  "changes",
  "doesNotChange",
  "increases",
  "doesNotIncrease",
  "decreases",
  "doesNotDecrease",
  "lenght.above",
] as const;

export const expectationSchema = z.object({
  key: z.string(),
  operator: z.enum(expectationOperators),
  value: z.any().optional(),
});

export const configSchema = z.object({
  method: z.enum(httpMethods),
  url: z.string().url({ message: "Invalid URL" }),
  duration: z.string().optional(),
  headers: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  body: z.any().optional(),
  expectations: z.array(expectationSchema).optional(),
});

export const TestSchema = z.object({
  id: z.number().optional(),
  duration: z.string().optional(),
  description: z.string({ message: "Description is required" }),
  type: z.enum(["load", "performance", "integration"], {
    message: "Invalid type",
  }),
  config: configSchema,
});

export const TestSchemaUpdate = z.object({
  testId: z.number(),
  description: z.string().optional(),
  type: z.enum(["load", "performance", "integration"]).optional(),
  config: configSchema.partial(),
});

export const TestSchemaDelete = z.object({
  testId: z.number(),
});

export const testingSchema = z.object({
  description: z.string(),
  type: z.enum(["load", "performance", "integration"]),
  config: configSchema,
});

export type Test = z.infer<typeof TestSchema>;
export type TestUpdate = z.infer<typeof TestSchemaUpdate>;
