interface Header {
  key: string;
  value: string;
}

export interface Expectations {
  key: string;
  operator:
    | "equal"
    | "notEqual"
    | "deepEqual"
    | "notDeepEqual"
    | "strictEqual"
    | "notStrictEqual"
    | "deepStrictEqual"
    | "notDeepStrictEqual"
    | "isAbove"
    | "isAtLeast"
    | "isBelow"
    | "isAtMost"
    | "isTrue"
    | "isNotTrue"
    | "isFalse"
    | "isNotFalse"
    | "isNull"
    | "isNotNull"
    | "isNaN"
    | "isNotNaN"
    | "exists"
    | "notExists"
    | "isUndefined"
    | "isDefined"
    | "isFunction"
    | "isNotFunction"
    | "isObject"
    | "isNotObject"
    | "isArray"
    | "isNotArray"
    | "isString"
    | "isNotString"
    | "isNumber"
    | "isNotNumber"
    | "isBoolean"
    | "isNotBoolean"
    | "typeOf"
    | "notTypeOf"
    | "instanceOf"
    | "notInstanceOf"
    | "include"
    | "notInclude"
    | "deepInclude"
    | "notDeepInclude"
    | "nestedInclude"
    | "notNestedInclude"
    | "deepNestedInclude"
    | "notDeepNestedInclude"
    | "ownInclude"
    | "notOwnInclude"
    | "deepOwnInclude"
    | "notDeepOwnInclude"
    | "match"
    | "notMatch"
    | "property"
    | "notProperty"
    | "deepProperty"
    | "notDeepProperty"
    | "propertyVal"
    | "notPropertyVal"
    | "deepPropertyVal"
    | "notDeepPropertyVal"
    | "lengthOf"
    | "hasAnyKeys"
    | "hasAllKeys"
    | "containsAllKeys"
    | "doesNotHaveAnyKeys"
    | "doesNotHaveAllKeys"
    | "throws"
    | "doesNotThrow"
    | "changes"
    | "doesNotChange"
    | "increases"
    | "doesNotIncrease"
    | "decreases"
    | "doesNotDecrease"
    | "length.above";
  value?: any;
}

export interface Config {
  duration?: string;
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "HEAD"
    | "OPTIONS"
    | "TRACE"
    | "CONNECT";
  url: string;
  headers?: Header[];
  body?: any;
  expectations?: Expectations[];
}

export interface Testing {
  id?: number;
  description: string;
  type: "load" | "performance" | "integration";
  config: Config;
}

export interface TestingLoad {
  id?: number;
  description: string;
  type: "load" | "performance" | "integration";
  config: LoadConfig;
}

export interface LoadConfig {
  duration?: string;
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "HEAD"
    | "OPTIONS"
    | "TRACE"
    | "CONNECT";
  url: string;
  headers?: {
    key: string;
    value: string;
  }[];
  body?: any;
  usersQt?: number;
  time?: number;
  workersthreads?: number;
}

export interface TestResult {
  id?: number;
  status?: number;
  success: string;
  expectations: Expectations[];
  passed: boolean;
  actualValue?: any;
  error?: string;
  APIResponse?: any;
}
