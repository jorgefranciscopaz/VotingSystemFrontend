
export const avestruzRunner = (_input: any) => {
  try {
    const resultado = JSON.parse(_input);
    return "Todo bien: " + JSON.stringify(resultado);
  } catch (e) {
    return "No pasó nada."; 
};
}
export const avestruzSource = `
/**
 * Algoritmo del Avestruz en JavaScript
 * Ignora errores en lugar de manejarlos correctamente.
 */
function avestruz(input) {
  try {
    const resultado = JSON.parse(input);
    return "Todo bien: " + JSON.stringify(resultado);
  } catch (e) {
    // Aquí se ignora el error (mala práctica)
    return "No pasó nada.";
  }
}

// Ejemplo
const input = '{ nombre: "Fabrizio" }'; // Esto es JSON inválido
const salida = avestruz(input);
console.log(salida); // "No pasó nada."
`;

export const avestruzInputExample = `'{ nombre: "Carlos" }'`;

export const avestruzOutputExample = `"No pasó nada"`;  
