import React from "react";
import { useTranslation } from "react-i18next";
import KetoRecipeGrid from "./KetoRecipeGrid";
import tortillaImg from "@/assets/tortilla_de_pimientos_y_espinacas_1.jpg";
import ensaladaImg from "@/assets/Ensalada_Aguacate.jpg";
import pureColiflor from "@/assets/Pure_Coliflor.jpg";
import calabacinImg from "@/assets/Calabacin.jpg";

const KetoRecipesPage = () => {
  const { t } = useTranslation();

 
  const recetas = [
    {
      image: tortillaImg,
      title: t("recipes_page.recipe_1.title"),
      description: t("recipes_page.recipe_1.description"),
      ingredients: t("recipes_page.recipe_1.ingredients", { returnObjects: true }),
    },
    {
      image: ensaladaImg,
      title: t("recipes_page.recipe_2.title"),
      description: t("recipes_page.recipe_2.description"),
      ingredients: t("recipes_page.recipe_2.ingredients", { returnObjects: true }),
    },
    {
      image: pureColiflor,
      title: t("recipes_page.recipe_3.title"),
      description: t("recipes_page.recipe_3.description"),
      ingredients: t("recipes_page.recipe_3.ingredients", { returnObjects: true }),
    },
    {
      image: calabacinImg,
      title: t("recipes_page.recipe_4.title"),
      description: t("recipes_page.recipe_4.description"),
      ingredients: t("recipes_page.recipe_4.ingredients", { returnObjects: true }),
    },
  ];

  return <KetoRecipeGrid recipes={recetas} />;
};

export default KetoRecipesPage;