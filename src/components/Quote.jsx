
import { useState, useEffect } from "react";

const frases = [
  "¡No te rindas, cada día es un progreso!",
  "El esfuerzo de hoy es el éxito de mañana.",
  "Suda hoy, sonríe mañana.",
  "Tu cuerpo puede más de lo que crees.",
  "No cuentes los días, haz que los días cuenten.",
  "La constancia vence al talento cuando el talento no se esfuerza.",
  "Transforma tu cuerpo, transforma tu mente.",
  "Cada repetición te acerca a tu objetivo.",
  "Comer sano es un acto de amor propio.",
  "No es un castigo, es tu oportunidad de mejorar.",
  "El dolor es temporal, el orgullo es para siempre.",
  "Levántate con determinación, acuéstate con satisfacción.",
  "El cambio comienza cuando decides empezar.",
  "Hazlo por ti, no por los demás.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "Tu único límite eres tú mismo.",
  "No te compares con otros, compite contigo mismo.",
  "La disciplina es el puente entre metas y logros.",
  "Pequeños pasos cada día llevan a grandes resultados.",
  "No hay atajos hacia lugares que valen la pena.",
  "Cuida tu cuerpo, es el único lugar que tienes para vivir.",
  "El sudor de hoy es la fuerza de mañana.",
  "La comida es tu combustible, elige sabiamente.",
  "Entrena duro, come limpio, vive feliz.",
  "No esperes resultados sin esfuerzo.",
  "El éxito es el resultado de la preparación y la constancia.",
  "Hoy es el primer día del resto de tu transformación.",
  "No pares hasta sentirte orgulloso.",
  "La motivación te inicia, la disciplina te mantiene.",
  "Haz que cada entrenamiento cuente.",
  "No dejes que tus excusas sean más fuertes que tus metas.",
  "Tu cuerpo escucha todo lo que tu mente dice.",
  "El cambio es incómodo, pero necesario.",
  "Sé más fuerte que tus mejores excusas.",
  "Cada comida saludable es un paso hacia tu mejor versión.",
  "El progreso es mejor que la perfección.",
  "Las grandes metas requieren grandes sacrificios.",
  "No se trata de tener tiempo, se trata de hacer tiempo.",
  "El dolor de hoy será la fuerza de mañana.",
  "No cuentes calorías, haz que cada caloría cuente.",
  "La fuerza no viene de lo que puedes hacer, viene de superar lo que pensabas imposible.",
  "Si duele, significa que está funcionando.",
  "Nada cambia si tú no cambias.",
  "El gimnasio es tu zona de crecimiento.",
  "No busques resultados rápidos, busca resultados duraderos.",
  "Cada día es una nueva oportunidad para mejorar.",
  "Los límites solo existen en tu mente.",
  "Entrena tu cuerpo, entrena tu mente.",
  "El sacrificio de hoy es el éxito de mañana.",
  "Cada esfuerzo suma, incluso si parece pequeño.",
  "Haz que tu estilo de vida hable por ti.",
  "Cree en ti y todo será posible."
];
export default function Quote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];
    setQuote(aleatoria);
  }, []);

  return <p>{quote}</p>;
}
