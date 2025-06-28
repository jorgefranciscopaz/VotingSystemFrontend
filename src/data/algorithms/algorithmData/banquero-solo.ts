import type { AlgorithmType } from "../../../types/algorithmType";
import {
  bankersSingleResourceRunner,
  bankersSingleResourceSource,
  bankersSingleResourceInputExample,
  bankersSingleResourceOutputExample,
} from "../algorithmCode/banquero-solo";

export const banqueroSoloData: AlgorithmType = {
  id: "banquero-solo",
  name: "Algoritmo del Banquero para Un Recurso",
  lastUpdated: "2025-06-27",
  description: `El Algoritmo del Banquero (Banker's Algorithm), desarrollado por Edsger Dijkstra, 
  es un método de evitación de deadlocks que gestiona la asignación de un único tipo de recurso. 
  Cada proceso declara su máxima demanda de unidades que necesitará. 
  Antes de conceder una solicitud, el algoritmo simula la asignación y verifica si el sistema permanece en un estado seguro.
  Si existe una secuencia en la que todos los procesos pueden terminar sin quedar bloqueados, 
  se concede la petición; de lo contrario, se la deniega.
  Si la solicitud mantiene el estado seguro, se concede; de lo contrario, el proceso debe esperar.`,
  codetype: "JavaScript",
  code: bankersSingleResourceRunner,
  sourceCode: bankersSingleResourceSource,
  inputExample: bankersSingleResourceInputExample,
  outputExample: bankersSingleResourceOutputExample,
  complexity: {
    bestCase: "O(n)",
    averageCase: "O(n^2)",
    worstCase: "O(n^2)",
  },
};
