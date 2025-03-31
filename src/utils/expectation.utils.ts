import { get } from "lodash";

export const findExpecationSpecialCase = (response: any, key: string) => {
  // Casos especiais diretos
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

  // Função recursiva para processar chaves complexas
  const processKey = (data: any, keyPath: string): any => {
    // Verifica se a key tem notação para acessar arrays
    const arrayMatch = keyPath.match(/^(.*?)\[(\d+|\*)\]\.?(.*)$/);

    if (!arrayMatch) {
      // Sem notação de array, usa get diretamente
      return get(data, keyPath);
    }

    const [, prefix, indexStr, suffix] = arrayMatch;

    // Obtém o array no caminho especificado
    const targetArray = prefix ? get(data, prefix) : data;

    if (!Array.isArray(targetArray)) {
      return undefined;
    }

    if (indexStr === "*") {
      // Processa todos os elementos do array
      if (!suffix) {
        // Retorna todo o array se não houver sufixo
        return targetArray;
      }

      // Mapeia e processa recursivamente cada elemento do array
      return targetArray.map((item) => processKey(item, suffix));
    } else {
      // Processa um elemento específico do array
      const index = parseInt(indexStr, 10);
      if (index >= targetArray.length) {
        return undefined;
      }

      if (!suffix) {
        // Retorna o elemento inteiro se não houver sufixo
        return targetArray[index];
      }

      // Processa recursivamente o elemento específico
      return processKey(targetArray[index], suffix);
    }
  };

  // Começa o processamento com a resposta.data (ou a resposta direta se for um array)
  const dataToProcess = Array.isArray(response) ? response : response.data;
  return processKey(dataToProcess, key);
};
