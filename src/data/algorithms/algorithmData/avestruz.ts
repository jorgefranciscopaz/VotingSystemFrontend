import type { AlgorithmType } from "../../../types/algorithmType";
import { avestruzRunner, avestruzInputExample, avestruzOutputExample, avestruzSource } from "../algorithmCode/avestruz";

export const avestruzData: AlgorithmType = {
  id: "avestruz",
  name: "Problema del Avestruz",
  lastUpdated: "2025-06-27",
  description: `En informática , el algoritmo del avestruz es una estrategia que 
  consiste en ignorar problemas potenciales basándose en su extrema rareza.
   Recibe su nombre del efecto avestruz , que se define como «meter la cabeza en la arena y 
   fingir que no hay problema». Se utiliza cuando parece que la situación se puede gestionar 
   de forma más rentable permitiendo que el problema persista en lugar de intentar prevenirlo.
    `,
  codetype: "JavaScript",
  code: avestruzRunner,
  sourceCode: avestruzSource,
  inputExample: avestruzInputExample,
  outputExample: avestruzOutputExample,
  complexity: {
    bestCase: `O(1)`,
    worstCase: `O(1)`,
    averageCase: `O(?)`,
  },
};
