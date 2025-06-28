import type { AlgorithmType } from "../../../types/algorithmType";
import {
  bankersMultipleResourcesRunner,
  bankersMultipleResourcesSource,
  bankersMultipleResourcesInputExample,
  bankersMultipleResourcesOutputExample,
} from "../algorithmCode/banquero-varios";

export const banqueroVariosData: AlgorithmType = {
  id: "banquero-varios",
  name: "Algoritmo del Banquero para Varios Recursos",
  lastUpdated: "2025-06-27",
  description: `
  El Algoritmo del Banquero es una técnica de prevención de deadlocks que extiende la versión de un recurso a múltiples tipos de recursos.  
  Cada proceso declara su demanda máxima de cada recurso. Antes de conceder una solicitud, el algoritmo simula la asignación y verifica si el sistema permanece en un estado seguro.  
  Si existe una secuencia en la que todos los procesos pueden terminar sin quedar bloqueados, se concede la petición; de lo contrario, se la deniega.    
  `,
  codetype: "JavaScript",
  code: bankersMultipleResourcesRunner,
  sourceCode: bankersMultipleResourcesSource,
  inputExample: bankersMultipleResourcesInputExample,
  outputExample: bankersMultipleResourcesOutputExample,
  complexity: {
    bestCase: "O(n * m)",
    averageCase: "O(n² * m)",
    worstCase: "O(n² * m)",
  },
};
