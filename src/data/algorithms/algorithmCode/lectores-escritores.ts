export function readersWritersRunner(input: any) {
  try {
    let events: string[];

    if (typeof input === "string") {
      const parsed = JSON.parse(input);
      events = parsed.events;
    } else {
      ({ events } = input);
    }

    let readers = 0;
    let writer = false;
    const outputLog: string[] = [];

    for (const event of events) {
      if (event === "read") {
        if (!writer) {
          readers++;
          outputLog.push(`Lectura permitida (lectores actuales: ${readers})`);
          readers--; // Simula que termina de leer
        } else {
          outputLog.push("Lectura bloqueada (escritor activo)");
        }
      } else if (event === "write") {
        if (readers === 0 && !writer) {
          writer = true;
          outputLog.push("Escritura permitida");
          writer = false; // Simula que termina de escribir
        } else {
          outputLog.push("Escritura bloqueada (lectores o escritor activo)");
        }
      } else {
        outputLog.push(`Evento desconocido: ${event}`);
      }
    }

    return outputLog.join("\n");
  } catch (e) {
    return ["Error de ejecución: " + e];
  }
}

export const readersWritersSource = `
/**
 * Algoritmo de Lectores y Escritores (preferencia a lectores)
 * Simulación secuencial de eventos
 */
let readers = 0;
let writer = false;
const log = [];

for (const event of events) {
  if (event === "read") {
    if (!writer) {
      readers++;
      log.push("Lectura permitida");
      readers--;
    } else {
      log.push("Lectura bloqueada");
    }
  } else if (event === "write") {
    if (readers === 0 && !writer) {
      writer = true;
      log.push("Escritura permitida");
      writer = false;
    } else {
      log.push("Escritura bloqueada");
    }
  }
}
`;

export const readersWritersInputExample = `
{
  "events": ["read", "read", "write", "read", "write"]
}
`;

export const readersWritersOutputExample = `
[
  "Lectura permitida (lectores actuales: 1)",
  "Lectura permitida (lectores actuales: 1)",
  "Escritura bloqueada (lectores o escritor activo)",
  "Lectura permitida (lectores actuales: 1)",
  "Escritura permitida"
]
`;
