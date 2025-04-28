import { expect } from "chai";
import { Expectations } from "../types/Tests";
import { isNumber } from "lodash";

// Função auxiliar para executar a expectativa com segurança de tipos
export function runExpectation(
  actual: any,
  operator: Expectations["operator"],
  expected: any,
): { passed: boolean; error?: string } {
  const stringedActual = String(actual); // Convertendo o valor atual para uma string
  try {
    switch (operator) {
      case "equal":
        expect(stringedActual).to.equal(expected);
        break;
      case "notEqual":
        expect(stringedActual).to.not.equal(expected);
        break;
      case "deepEqual":
        expect(stringedActual).to.deep.equal(expected);
        break;
      case "notDeepEqual":
        expect(stringedActual).to.not.deep.equal(expected);
        break;
      case "strictEqual":
        expect(stringedActual).to.equal(expected);
        break;
      case "notStrictEqual":
        expect(stringedActual).to.not.equal(expected);
        break;
      case "isAbove":
        expect(stringedActual).to.be.above(Number(expected));
        break;
      case "isAtLeast":
        expect(stringedActual).to.be.at.least(Number(expected));
        break;
      case "isBelow":
        expect(stringedActual).to.be.below(Number(expected));
        break;
      case "isAtMost":
        expect(stringedActual).to.be.at.most(Number(expected));
        break;
      case "isTrue":
        expect(stringedActual).to.be.true;
        break;
      case "isFalse":
        expect(stringedActual).to.be.false;
        break;
      case "isNull":
        expect(stringedActual).to.be.null;
        break;
      case "isNotNull":
        expect(stringedActual).to.not.be.null;
        break;
      case "exists":
        expect(stringedActual).to.exist;
        break;
      case "notExists":
        expect(stringedActual).to.not.exist;
        break;
      case "length.above":
        expect(stringedActual).to.have.length.above(Number(expected));
        break;

      default:
        new Error(`Operador não suportado: ${operator}`);
    }
    return { passed: true, error: undefined };
  } catch (error: any) {
    return { passed: false, error: error.message };
  }
}
