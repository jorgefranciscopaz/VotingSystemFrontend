import type { AlgorithmType } from "../../../types/algorithmType";
import { filosofosRunner, filosofosInputExample, filosofosOutputExample, filosofosSource } from "../algorithmCode/filosofos";

export const filosofosData: AlgorithmType = {
  id: "filosofos",
  name: "Problema de los Filosofos Comelones",
  lastUpdated: "2025-06-27",
  description: ` El problema de los 5 filósofos presenta una situación hipotética
   donde cinco filósofos se sientan alrededor de una mesa
    redonda, cada uno con un plato de pasta y un tenedor
     entre cada par de filósofos adyacentes. 
     La dificultad radica en permitir que cada filósofo alterne entre dos estados, 
     pensamiento y comer, sin que se produzcan bloqueos mutuos mientras intentan 
     adquirir los tenedores adyacentes necesarios para comer. 
  `,
  codetype: "JavaScript",
  code: filosofosRunner,
  sourceCode: filosofosSource,
  inputExample: filosofosInputExample,
  outputExample: filosofosOutputExample,
  complexity: {
    bestCase: `O(n)`,
    worstCase: `O(n)`,
    averageCase: `O(n)`,
  },
};
