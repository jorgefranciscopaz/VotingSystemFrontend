export type AlgorithmType = {
  id: string;
  name: string;
  lastUpdated: string;
  description: string;
  codetype: string;
  code: string;
  inputExample: string;
  outputExample: string;
  complexity?: {
    bestCase?: string;
    worstCase?: string;
    averageCase?: string;
  };
};
