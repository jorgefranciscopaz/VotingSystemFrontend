export function bankersSingleResourceRunner(input: any) {
  try {
    let processes, available, pid, request;
    if (typeof input === "string") {
      // Intentar parsear como JSON
      try {
        const parsed = JSON.parse(input);
        processes = parsed.processes;
        available = parsed.available;
        pid = parsed.pid;
        request = parsed.request;
      } catch {
        // Si no es JSON válido, intentar extraer variables usando eval
        const sandbox = {};
        const code = `
          let result;
          ${input}
          if (typeof processes !== 'undefined' && typeof available !== 'undefined' && typeof pid !== 'undefined' && typeof request !== 'undefined') {
            result = { processes, available, pid, request };
          }
          result;
        `;
        // eslint-disable-next-line no-new-func
        const extracted = Function('"use strict";' + code).call(sandbox);
        if (!extracted) throw new Error("Entrada inválida");
        ({ processes, available, pid, request } = extracted);
      }
    } else if (typeof input === "object" && input !== null) {
      ({ processes, available, pid, request } = input);
    } else {
      throw new Error("Entrada inválida");
    }

    // Lógica del algoritmo
    function isSafeState(processes: any[], available: number) {
      const n = processes.length;
      const finish = Array(n).fill(false);
      let work = available;
      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < n; i++) {
          if (!finish[i] && processes[i].need <= work) {
            work += processes[i].allocation;
            finish[i] = true;
            changed = true;
          }
        }
      }
      return finish.every((f) => f);
    }

    function requestResource(
      processes: any[],
      available: number,
      pid: string,
      request: number
    ) {
      const proc = processes.find((p: any) => p.id === pid);
      if (!proc) return "Proceso no existe";
      if (request > proc.need) return "Solicitud excede la necesidad máxima";
      if (request > available) return "No hay suficientes recursos disponibles";
      // Simula la asignación
      available -= request;
      proc.allocation += request;
      proc.need -= request;
      // Comprueba si el sistema queda en un estado seguro
      const safe = isSafeState(processes, available);
      if (!safe) {
        // Revierte la simulación si no es seguro
        available += request;
        proc.allocation -= request;
        proc.need += request;
        return "Solicitud denegada (estado inseguro)";
      }
      return "Solicitud concedida";
    }

    return requestResource(processes, available, pid, request);
  } catch (e) {
    return "Error en la entrada o ejecución: " + e;
  }
}

export const bankersSingleResourceSource = `
/**
 * Banker's Algorithm para un solo recurso en JavaScript
 */
function isSafeState(processes, available) {
  const n = processes.length;
  const finish = Array(n).fill(false);
  let work = available;

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (!finish[i] && processes[i].need <= work) {
        // Simula la finalización del proceso i
        work += processes[i].allocation;
        finish[i] = true;
        changed = true;
      }
    }
  }
  return finish.every(f => f);
}

function requestResource(processes, available, pid, request) {
  const proc = processes.find(p => p.id === pid);
  if (!proc) throw new Error('Proceso no existe');
  if (request > proc.need) return false;
  if (request > available) return false;
  // Simula la asignación
  available -= request;
  proc.allocation += request;
  proc.need -= request;
  // Comprueba si el sistema queda en un estado seguro
  const safe = isSafeState(processes, available);
  if (!safe) {
    // Revierte la simulación si no es seguro
    available += request;
    proc.allocation -= request;
    proc.need += request;
    return false; // Denegar solicitud
  }
  return true; // Conceder solicitud
}

// Ejemplo de uso
{
  "processes": [
    { "id": "P1", "max": 3, "allocation": 1, "need": 2 },
    { "id": "P2", "max": 4, "allocation": 1, "need": 3 }
  ],
  "available": 3,
  "pid": "P1",
  "request": 1
}
const granted = requestResource(processes, available, 'P1', 1);
console.log(granted ? 'Solicitud concedida' : 'Solicitud denegada');
`;

export const bankersSingleResourceInputExample = `
{
  "processes": [
    { "id": "P1", "max": 3, "allocation": 1, "need": 2 },
    { "id": "P2", "max": 4, "allocation": 1, "need": 3 }
  ],
  "available": 3,
  "pid": "P1",
  "request": 1
}
`;

export const bankersSingleResourceOutputExample = `
Solicitud concedida
`;
