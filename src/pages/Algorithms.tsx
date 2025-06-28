import { useState, useEffect } from "react";
import "./Algorithms.css";
import Navbar from "../components/Navbar";
import { algorithmsData } from "../data/algorithms";
import type { AlgorithmId } from "../data/algorithms";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const Algorithms = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmId>("avestruz");
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [highlightedCode, setHighlightedCode] = useState("");

  const algorithms = [
    { id: "avestruz", name: "Algoritmo del Avestruz" },
    {
      id: "banquero-solo",
      name: "Algoritmo del Banquero para un solo Recurso",
    },
    {
      id: "banquero-varios",
      name: "Algoritmo del Banquero para Varios Recursos",
    },
    { id: "filosofos", name: "Problema de los Filosofos Comelones" },
    { id: "lectores-escritores", name: "Problema de Lectores Escritores" },
    { id: "barbero", name: "Problema del Barbero Durmiente" },
  ];

  const currentAlgorithm = algorithmsData[selectedAlgorithm];

  //TODO: Implementar el algoritmo
  const handleRunAlgorithm = () => {
    try {
      setOutputData(currentAlgorithm.code(inputData));
    } catch (error) {
      setOutputData(`Error: ${error}`);
    }
  };

  // Resaltar sintaxis cuando cambie el algoritmo seleccionado
  useEffect(() => {
    const html = Prism.highlight(
      currentAlgorithm.sourceCode,
      Prism.languages.javascript,
      "javascript"
    );
    setHighlightedCode(html);
  }, [currentAlgorithm]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    //TODO: Implementar la notificación de que se copió
  };

  return (
    <div>
      <Navbar />
      <div className="algorithms-container">
        {/* Sidebar */}
        <div className="algorithms-sidebar">
          <div className="sidebar-header">
            <h2>Algoritmos</h2>
            <p>Sistemas Operativos</p>
          </div>
          <nav className="sidebar-nav">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                className={`sidebar-item ${
                  selectedAlgorithm === algorithm.id ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedAlgorithm(algorithm.id as AlgorithmId)
                }
              >
                {algorithm.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="algorithms-main">
          <div className="algorithm-header">
            <h1>{currentAlgorithm.name}</h1>
            <h3>Última actualización: {currentAlgorithm.lastUpdated}</h3>
          </div>

          <div className="algorithm-content">
            <div className="content-section">
              <h3>Descripción del Algoritmo</h3>
              <div
                className="description-content"
                dangerouslySetInnerHTML={{
                  __html: currentAlgorithm.description,
                }}
              />
            </div>

            <div className="content-section">
              <h3>Implementación en {currentAlgorithm.codetype}</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>{currentAlgorithm.codetype}</span>
                  <button
                    className="copy-button"
                    onClick={() => handleCopyCode(currentAlgorithm.sourceCode)}
                  >
                    Copiar
                  </button>
                </div>
                <pre className="code-content">
                  <code
                    className={`language-${currentAlgorithm.codetype}`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  />
                </pre>
              </div>
            </div>

            <div className="content-section">
              <h3>Ejecutar Algoritmo</h3>
              <div className="execution-panel">
                <div className="input-section">
                  <label>Entrada:</label>
                  <textarea
                    placeholder={currentAlgorithm.inputExample}
                    className="input-textarea"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                  />
                </div>
                <button className="run-button" onClick={handleRunAlgorithm}>
                  Ejecutar
                </button>
                <div className="output-section">
                  <label>Salida:</label>
                  <div className="output-display">
                    {outputData ? (
                      <pre>{outputData}</pre>
                    ) : (
                      <p>El resultado aparecerá aquí...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {currentAlgorithm.complexity ? (
              <div className="content-section">
                <h3>Complejidad</h3>
                <div className="complexity-info">
                  <div className="complexity-item">
                    <strong>Mejor caso:</strong>{" "}
                    {currentAlgorithm.complexity?.bestCase}
                  </div>
                  <div className="complexity-item">
                    <strong>Caso promedio:</strong>{" "}
                    {currentAlgorithm.complexity?.averageCase}
                  </div>
                  <div className="complexity-item">
                    <strong>Peor caso:</strong>{" "}
                    {currentAlgorithm.complexity?.worstCase}
                  </div>
                </div>
              </div>
            ) : (
              <div className="content-section">
                <h3>Complejidad</h3>
                <p>No hay complejidad definida</p>
              </div>
            )}

            <div className="content-section">
              <h3>Información Adicional</h3>
              <div className="additional-info">
                <div className="info-item">
                  <strong>Ejemplo de entrada:</strong>
                  <pre className="example-code">
                    {currentAlgorithm.inputExample}
                  </pre>
                </div>
                <div className="info-item">
                  <strong>Ejemplo de salida:</strong>
                  <pre className="example-code">
                    {currentAlgorithm.outputExample}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algorithms;
