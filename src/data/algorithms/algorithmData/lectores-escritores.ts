import type { AlgorithmType } from "../../../types/algorithmType";
import {
  readersWritersRunner,
  readersWritersSource,
  readersWritersInputExample,
  readersWritersOutputExample,
} from "../algorithmCode/lectores-escritores";

export const lectoresEscritoresData: AlgorithmType = {
  id: "lectores-escritores",
  name: "Algoritmo de Lectores y Escritores (Preferencia Lectores)",
  lastUpdated: "2025-06-27",
  description: `Este algoritmo maneja el acceso concurrente a un recurso compartido simulando eventos de lectura y escritura. Da preferencia a los lectores: múltiples lecturas pueden ocurrir simultáneamente si no hay un escritor activo. Sin embargo, un escritor solo puede acceder si no hay lectores ni otros escritores activos.`,
  codetype: "JavaScript",
  code: readersWritersRunner,
  sourceCode: readersWritersSource,
  inputExample: readersWritersInputExample,
  outputExample: readersWritersOutputExample,
  complexity: {
    bestCase: "O(n)",
    averageCase: "O(n)",
    worstCase: "O(n)",
  },
};
