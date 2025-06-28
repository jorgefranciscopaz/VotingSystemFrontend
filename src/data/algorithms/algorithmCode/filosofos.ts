
export const filosofosRunner = (input: any) => {
  try {
    const n = 5;
    const tenedores = Array(n).fill(false); // false = disponible

    const filosofos = input.filosofos || [0, 1, 2, 3, 4];
    const logs: string[] = [];

    filosofos.forEach((id: number) => {
      const izq = id;
      const der = (id + 1) % n;

      logs.push(`Filósofo ${id} intenta tomar tenedor ${izq} y ${der}`);

      if (!tenedores[izq] && !tenedores[der]) {
        tenedores[izq] = true;
        tenedores[der] = true;
        logs.push(`Filósofo ${id} está comiendo `);
        tenedores[izq] = false;
        tenedores[der] = false;
        logs.push(`Filósofo ${id} soltó los tenedores ${izq} y ${der}`);
      } else {
        logs.push(`Filósofo ${id} no puede comer ahora `);
      }
    });

    return logs.join("\n");
  } catch (e) {
    return "Error en la ejecución: " + e;
  }
};

export const filosofosSource = `
/**
 * Problema de los Filósofos Comiendo 
 * Cada filósofo necesita dos tenedores (izquierdo y derecho) para comer.
 * Esta simulación evita deadlock simplemente negando comer si no hay ambos disponibles.
 */

function filosofosComiendo(input) {
  const n = 5;
  const tenedores = Array(n).fill(false); // false = disponible
  const filosofos = input.filosofos || [0, 1, 2, 3, 4];
  const logs = [];

  filosofos.forEach(id => {
    const izq = id;
    const der = (id + 1) % n;
    logs.push(\`Filósofo \${id} intenta tomar tenedor \${izq} y \${der}\`);

    if (!tenedores[izq] && !tenedores[der]) {
      tenedores[izq] = true;
      tenedores[der] = true;
      logs.push(\`Filósofo \${id} está comiendo. \`);
      tenedores[izq] = false;
      tenedores[der] = false;
      logs.push(\`Filósofo \${id} soltó los tenedores \${izq} y \${der}\`);
    } else {
      logs.push(\`Filósofo \${id} no puede comer ahora.\`);
    }
  });

  return logs.join("\\n");
}
`;

export const filosofosInputExample = `
{
  "filosofos": [0, 1, 2, 3, 4]
}
`;

export const filosofosOutputExample = `
Filósofo 0 intenta tomar tenedor 0 y 1
Filósofo 0 está comiendo 
Filósofo 0 soltó los tenedores 0 y 1
Filósofo 1 intenta tomar tenedor 1 y 2
Filósofo 1 no puede comer ahora 
...
`;