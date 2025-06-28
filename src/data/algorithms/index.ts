import { avestruzData } from "./algorithmData/avestruz";
import { banqueroSoloData } from "./algorithmData/banquero-solo";
import { banqueroVariosData } from "./algorithmData/banquero-varios";
import { filosofosData } from "./algorithmData/filosofos";
import { lectoresEscritoresData } from "./algorithmData/lectores-escritores";
import { barberoData } from "./algorithmData/barbero";

export const algorithmsData = {
  avestruz: avestruzData,
  "banquero-solo": banqueroSoloData,
  "banquero-varios": banqueroVariosData,
  filosofos: filosofosData,
  "lectores-escritores": lectoresEscritoresData,
  barbero: barberoData,
};

export type AlgorithmId = keyof typeof algorithmsData;
