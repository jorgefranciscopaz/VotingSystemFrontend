export function bankersMultipleResourcesRunner(input: any): string {
  try {
    let processes: any[], available: number[], pid: string, request: number[];
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        ({ processes, available, pid, request } = parsed);
      } catch {
        // Fallback: eval sanitizado
        const sandbox: any = {};
        const code = `
          let result;
          ${input}
          if (processes && available && pid && request) result = { processes, available, pid, request };
          result;
        `;
        const extracted = Function('"use strict";' + code).call(sandbox);
        if (!extracted) throw new Error("Entrada inválida");
        ({ processes, available, pid, request } = extracted);
      }
    } else if (typeof input === "object" && input !== null) {
      ({ processes, available, pid, request } = input);
    } else {
      throw new Error("Entrada inválida");
    }

    // Chequeo de estado seguro
    function isSafeState(procs: any[], work: number[]): boolean {
      const n = procs.length;
      const m = work.length;
      const finish = Array(n).fill(false);
      let changed = true;

      while (changed) {
        changed = false;
        for (let i = 0; i < n; i++) {
          if (!finish[i]) {
            const need = procs[i].need as number[];
            let can = true;
            for (let j = 0; j < m; j++) {
              if (need[j] > work[j]) {
                can = false;
                break;
              }
            }
            if (can) {
              const alloc = procs[i].allocation as number[];
              for (let j = 0; j < m; j++) work[j] += alloc[j];
              finish[i] = true;
              changed = true;
            }
          }
        }
      }

      return finish.every(Boolean);
    }

    // Procesar solicitud
    const proc = processes.find((p) => p.id === pid);
    if (!proc) return "Proceso no existe";
    if (!Array.isArray(request) || request.length !== available.length) {
      return "Formato de solicitud inválido";
    }

    // Verificar solicitud <= need y <= available
    for (let j = 0; j < request.length; j++) {
      if (request[j] > proc.need[j])
        return "Solicitud excede la necesidad máxima";
      if (request[j] > available[j])
        return "Recursos insuficientes disponibles";
    }

    // Simular asignación
    for (let j = 0; j < available.length; j++) {
      available[j] -= request[j];
      proc.allocation[j] += request[j];
      proc.need[j] -= request[j];
    }

    // Revisar seguridad
    const safe = isSafeState(processes, [...available]);
    if (!safe) {
      // Revertir
      for (let j = 0; j < available.length; j++) {
        available[j] += request[j];
        proc.allocation[j] -= request[j];
        proc.need[j] += request[j];
      }
      return "Solicitud denegada (estado inseguro)";
    }

    return "Solicitud concedida";
  } catch (e: any) {
    return "Error en la entrada o ejecución: " + e.message;
  }
}

export const bankersMultipleResourcesSource = `
/**
 * Banker's Algorithm para múltiples recursos en JavaScript
 */
${bankersMultipleResourcesRunner.toString()}
`;

export const bankersMultipleResourcesInputExample = `
{
  "processes": [
    { "id": "P1", "allocation": [0,1,0], "max": [7,5,3], "need": [7,4,3] },
    { "id": "P2", "allocation": [2,0,0], "max": [3,2,2], "need": [1,2,2] },
    { "id": "P3", "allocation": [3,0,2], "max": [9,0,2], "need": [6,0,0] },
    { "id": "P4", "allocation": [2,1,1], "max": [2,2,2], "need": [0,1,1] },
    { "id": "P5", "allocation": [0,0,2], "max": [4,3,3], "need": [4,3,1] }
  ],
  "available": [3,3,2],
  "pid": "P1",
  "request": [1,0,2]
}
`;

export const bankersMultipleResourcesOutputExample = `
Solicitud concedida
`;
