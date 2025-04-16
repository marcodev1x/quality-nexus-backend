import { expect } from "chai";
import { Expectations } from "../types/Tests";

// Função auxiliar para executar a expectativa com segurança de tipos
export function runExpectation(
  actual: any,
  operator: Expectations["operator"],
  expected: any,
): { passed: boolean; error?: string } {
  try {
    switch (operator) {
      case "equal":
        expect(actual).to.equal(expected);
        break;
      case "notEqual":
        expect(actual).to.not.equal(expected);
        break;
      case "deepEqual":
        expect(actual).to.deep.equal(expected);
        break;
      case "notDeepEqual":
        expect(actual).to.not.deep.equal(expected);
        break;
      case "strictEqual":
        expect(actual).to.equal(expected);
        break;
      case "notStrictEqual":
        expect(actual).to.not.equal(expected);
        break;
      case "isAbove":
        expect(actual).to.be.above(Number(expected));
        break;
      case "isAtLeast":
        expect(actual).to.be.at.least(Number(expected));
        break;
      case "isBelow":
        expect(actual).to.be.below(Number(expected));
        break;
      case "isAtMost":
        expect(actual).to.be.at.most(Number(expected));
        break;
      case "isTrue":
        expect(actual).to.be.true;
        break;
      case "isFalse":
        expect(actual).to.be.false;
        break;
      case "isNull":
        expect(actual).to.be.null;
        break;
      case "isNotNull":
        expect(actual).to.not.be.null;
        break;
      case "exists":
        expect(actual).to.exist;
        break;
      case "notExists":
        expect(actual).to.not.exist;
        break;
      case "length.above":
        expect(actual).to.have.length.above(Number(expected));
        break;

      default:
        new Error(`Operador não suportado: ${operator}`);
    }
    return { passed: true, error: undefined };
  } catch (error: any) {
    return { passed: false, error: error.message };
  }
}
