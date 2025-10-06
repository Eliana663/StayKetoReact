import { useState } from "react";

function CheckKetosis({ onClose }) {
  const preguntas = [
    { id: 1, label: "Glucosa en sangre (mg/dL)", type: "number", key: "glucosa" },
    { id: 2, label: "Cuerpos cetónicos (mmol/L)", type: "number", key: "cuerposCet" },
    { id: 3, label: "Aliento", type: "radio", key: "aliento", options: ["Normal", "Afrutado"] },
    { id: 4, label: "Micción", type: "radio", key: "miccion", options: ["Normal", "Frecuente"] },
    { id: 5, label: "Congestión Nasal", type: "radio", key: "congestion", options: ["Si", "No"] },
  ];

  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const cuerpos = parseFloat(respuestas.cuerposCet);
    const glucosa = respuestas.glucosa;
    const aliento = respuestas.aliento;
    const miccion = respuestas.miccion; 
    const congestion = respuestas.congestion;
    

   if (!isNaN(cuerpos) && cuerpos > 0.5) {
        setResultado("¡Enhorabuena! ¡Estás en cetosis!"); 
      } else if (!isNaN(glucosa) && glucosa <= 80) {
        setResultado("¡Probablemente estás en cetosis!"); 
      } else if (
        aliento === "Afrutado" ||
        miccion === "Frecuente" ||
        congestion === "Si"
      ) {
        setResultado("Podrías estar entrando en cetosis"); 
      } else {
        setResultado("Aún no estás en cetosis"); 
      }
    
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginTop: "1rem" }}>
      <h2>Formulario de cetosis</h2>

      <form onSubmit={handleSubmit}>
        {preguntas.map((p) => (
          <div key={p.id} style={{ marginBottom: "0.5rem" }}>
            <label>{p.label}:</label>
            {p.type === "radio" ? (
              <div>
                {p.options.map((opt) => (
                  <label key={opt} style={{ marginRight: "1rem" }}>
                    <input
                      type="radio"
                      name={p.key}
                      value={opt}
                      checked={respuestas[p.key] === opt}
                      onChange={(e) =>
                        setRespuestas({ ...respuestas, [p.key]: e.target.value })
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={p.type}
                value={respuestas[p.key] || ""}
                onChange={(e) =>
                  setRespuestas({ ...respuestas, [p.key]: e.target.value })
                }
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <button type="submit" style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>
            Verificar
          </button>
          <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cerrar formulario
          </button>
        </div>
      </form>

      {resultado && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{resultado}</p>}
    </div>
  );
}

export default CheckKetosis;
