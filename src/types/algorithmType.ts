export type AlgorithmType = {
  id: string;
  name: string;
  lastUpdated: string;
  description: string;
  codetype: "JavaScript" | "C++";
  code: string;
  inputExample: string;
  outputExample: string;
  complexity?: {
    bestCase?: string;
    worstCase?: string;
    averageCase?: string;
  };
};
