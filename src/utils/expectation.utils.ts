import { get } from "lodash";

export const findExpecationSpecialCase = (response: any, key: string) => {
  if (key === "status") {
    return response.status;
  }
  if (key === "headers") {
    return response.headers;
  }
  if (key === "data") {
    return response.data;
  }
  if (key === "body") {
    return response.data;
  }
  if (key === "statusCode") {
    return response.status;
  }
  if (key === "statusText") {
    return response.statusText;
  }

  let value = get(response.data, key);

  if (Array.isArray(response.data) && value === undefined) {
    value = get(response.data[0], key);
  }
  return value;
};
