import React from "react";
import KetoRecipeGrid from "./KetoRecipeGrid";
import tortillaImg from "@/assets/tortilla_de_pimientos_y_espinacas_1.jpg";
import ensaladaImg from "@/assets/Ensalada_Aguacate.jpg";
import pureColiflor from "@/assets/Pure_Coliflor.jpg";
import calabacinImg from "@/assets/Calabacin.jpg";

const KetoRecipesPage = () => {
  const recetas = [
    {
      image: tortillaImg,
      title: "Tortilla Keto de Queso y Espinaca",
      description: "Una tortilla esponjosa, rica en proteínas y baja en carbohidratos.",
      ingredients: ["2 huevos", "1 taza de espinacas", "50g de queso rallado", "1 cda de mantequilla", "Sal y pimienta al gusto"],
    },
    {
      image: ensaladaImg,
      title: "Ensalada de Aguacate Keto",
      description: "Fresca y deliciosa, perfecta para un almuerzo ligero.",
      ingredients: ["1 aguacate", "1 tomate", "Aceite de oliva", "Sal y pimienta", "Limón al gusto"],
    },
     {
      image: pureColiflor,
      title: "Pure de Coliflor con Mantequilla Dorada",
      description: "Con la combinación perfecta de coliflor cremoso, cebollas doradas, queso cheddar que se derrite en la boca y deliciosa mantequilla dorada, esta receta de puré de coliflor bajo en carbohidratos es imposible que salga mal. ¡Y además es exquisita!.",
      ingredients: ["2 (220 g) cebollas amarillas finamente picadas", "3 cda. mantequilla para freír ", "1,4 kg coliflor", "360 ml crema (o nata) para montar", "300 g (650 ml) queso cheddar rallado", "1 cdta. sal marina", "½ cdta. pimienta negra molida", "180 g mantequilla", "Limón al gusto"],
    },

    {
      image: calabacinImg,
      title: "Espaguetis de calabacín bajos en carbos a la boloñesa",
      description: "¿Echas de menos la pasta? Esta misma noche puedes disfrutar de un plato de pasta sin los carbohidratos, con una pizca de umami y un toque de ajo. ¡No volverás a echar de menos un buen plato de espaguetis con boloñesa!",
      ingredients: ["1 (110 g) cebolla amarilla", "1 diente de ajo ", "85 g (200 ml) ramas de apio", "700 g carne picada (molida)", "85 g mantequilla o aceite de oliva", "2 cda. concentrado de tomate", "400 g (400 ml) tomates picados", "1 cdta. sal", "¼ cdta. pimienta", "1 cda. orégano seco o albahaca seca", "1 cda. salsa Worcester", "agua (opcional)"],
    },

    


    
  ];

  return <KetoRecipeGrid recipes={recetas} />;
};

export default KetoRecipesPage;
