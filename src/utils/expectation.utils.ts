import { get } from "lodash";

export const findExpecationSpecialCase = (response: any, key: string) => {
  interface SpecialCasesMap {
    [key: string]: () => any;
  }

  const specialCases: SpecialCasesMap = {
    status: () => response.status,
    statusCode: () => response.status,
    statusText: () => response.statusText,
    headers: () => response.headers,
    data: () => response.data,
    body: () => response.data,
  };

  if (key in specialCases) {
    return specialCases[key]();
  }

  // Verifica se a key tem notação para acessar arrays
  const arrayMatch = key.match(/^(.*)\[(\d+|\*)\]\.(.*)$/);
  if (arrayMatch) {
    const [, arrayPath, indexStr, propPath] = arrayMatch;
    const array = get(response.data, arrayPath);

    if (Array.isArray(array)) {
      if (indexStr === "*") {
        // Retorna array com a propriedade de cada item
        return array.map((item) => get(item, propPath));
      } else {
        // Retorna a propriedade de um item específico
        const index = parseInt(indexStr, 10);
        return array[index] ? get(array[index], propPath) : undefined;
      }
    }
  }

  let value = get(response.data, key);

  // Se não encontrou e data é um array, tenta no primeiro item
  if (value === undefined && Array.isArray(response.data)) {
    // Verifica em todos os itens do array
    for (const item of response.data) {
      const itemValue = get(item, key);
      if (itemValue !== undefined) {
        return itemValue;
      }
    }
  }

  return value;
};
