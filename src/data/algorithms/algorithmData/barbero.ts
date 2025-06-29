import type { AlgorithmType } from "../../../types/algorithmType";
import {
  sleepingBarberRunner,
  sleepingBarberSource,
  sleepingBarberInputExample,
  sleepingBarberOutputExample,
} from "../algorithmCode/barbero";

export const barberoData: AlgorithmType = {
  id: "barbero-durmiente",
  name: "Algoritmo del Barbero Durmiente",
  lastUpdated: "2025-06-29",
  description: `Este algoritmo simula el problema clásico del barbero durmiente, donde un barbero atiende a clientes en una barbería con sillas limitadas. Si no hay clientes, el barbero duerme; si un cliente llega y todas las sillas están ocupadas, se va.`,
  codetype: "JavaScript",
  code: (input: any) => {
    const result = sleepingBarberRunner(input);
    return Array.isArray(result) ? result.join('\n') : result;
  },
  sourceCode: sleepingBarberSource,
  inputExample: sleepingBarberInputExample,
  outputExample: sleepingBarberOutputExample,
  complexity: {
    bestCase: "O(n)",
    averageCase: "O(n)",
    worstCase: "O(n)",
  },
};
