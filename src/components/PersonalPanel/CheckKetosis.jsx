import { useState } from "react";

function CheckKetosis({ onClose }) {
  const preguntas = [
    { id: 1, label: "Glucosa en sangre (mg/dL)", type: "number", key: "glucosa" },
    { id: 2, label: "Cuerpos cetónicos (mmol/L)", type: "number", key: "cuerposCet" },
    { id: 3, label: "Peso (kg)", type: "number", key: "peso" },
    { id: 4, label: "Cantidad de carbohidratos consumidos hoy (g)", type: "number", key: "carbs" },
    { id: 5, label: "Horas de ayuno", type: "number", key: "ayuno" },
    { id: 6, label: "Aliento", type: "radio", key: "aliento", options: ["Normal", "Afrutado"] },
  ];

  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // cálculo simple de cetosis
    const cuerpos = parseFloat(respuestas.cuerposCet);
    if (respuestas.aliento === "Afrutado" || cuerpos > 0.5) {
      setResultado("¡Estás en cetosis!");
    } else {
      setResultado("Aún no estás en cetosis.");
    }

    console.log(respuestas);
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
