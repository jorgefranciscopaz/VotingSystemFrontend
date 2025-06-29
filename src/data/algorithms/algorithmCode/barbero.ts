export function sleepingBarberRunner(input: any) {
  try {
    let events: string[];

    if (typeof input === "string") {
      const parsed = JSON.parse(input);
      events = parsed.events;
    } else {
      ({ events } = input);
    }

    let waitingChairs = 3;
    let occupiedChairs = 0;
    let barberSleeping = true;
    const outputLog: string[] = [];

    for (const event of events) {
      if (event === "arrival") {
        if (barberSleeping) {
          barberSleeping = false;
          outputLog.push("Cliente llegó y despertó al barbero.");
        } else if (occupiedChairs < waitingChairs) {
          occupiedChairs++;
          outputLog.push(`Cliente llegó y se sienta en la sala de espera (ocupadas: ${occupiedChairs}).`);
        } else {
          outputLog.push("Cliente llegó pero no había sillas disponibles, se fue.");
        }
      } else if (event === "haircut_done") {
        if (occupiedChairs > 0) {
          occupiedChairs--;
          outputLog.push("Barbero termina con un cliente y atiende al siguiente.");
        } else {
          barberSleeping = true;
          outputLog.push("Barbero termina y no hay clientes, se duerme.");
        }
      } else {
        outputLog.push(`Evento desconocido: ${event}`);
      }
    }

    return outputLog;
  } catch (e) {
    return ["Error de ejecución: " + e];
  }
}

export const sleepingBarberSource = `
let waitingChairs = 3;
let occupiedChairs = 0;
let barberSleeping = true;
const log = [];

for (const event of events) {
  if (event === "arrival") {
    if (barberSleeping) {
      barberSleeping = false;
      log.push("Cliente llegó y despertó al barbero.");
    } else if (occupiedChairs < waitingChairs) {
      occupiedChairs++;
      log.push("Cliente se sienta en la sala de espera.");
    } else {
      log.push("Cliente se fue, no hay sillas disponibles.");
    }
  } else if (event === "haircut_done") {
    if (occupiedChairs > 0) {
      occupiedChairs--;
      log.push("Barbero atiende al siguiente cliente.");
    } else {
      barberSleeping = true;
      log.push("Barbero se duerme.");
    }
  }
}`;

export const sleepingBarberInputExample = `
{
  "events": ["arrival", "arrival", "arrival", "arrival", "arrival", "haircut_done", "haircut_done", "haircut_done", "haircut_done"]
}`;

export const sleepingBarberOutputExample = `
[
    "Cliente llegó y despertó al barbero."
    "Cliente llegó y se sienta en la sala de espera (ocupadas: 1)."
    "Cliente llegó y se sienta en la sala de espera (ocupadas: 2)."
    "Cliente llegó y se sienta en la sala de espera (ocupadas: 3)."
    "Cliente llegó pero no había sillas disponibles, se fue."
    "Barbero termina con un cliente y atiende al siguiente."
    "Barbero termina con un cliente y atiende al siguiente."
    "Barbero termina con un cliente y atiende al siguiente."
    "Barbero termina y no hay clientes, se duerme."
]`
