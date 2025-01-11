"use client";

import clsx from "clsx";
import React from "react";

// Import components and utilities
import CategoryItem from "./CategoryItem";

// Define types
interface Category {
  id: string;
  name: string;
}

/**
 * MainCategories component that displays a list of main categories
 * and allows the user to select a category.
 *
 * @param {Object} props - Component properties
 * @param {Category[]} props.categories - An array of category objects to be displayed.
 * @param {function} props.setSelectedCategory - A function to update the selected category state.
 * @param {Category} props.selectedCategory - The currently selected category object.
 *
 * @returns {JSX.Element} The rendered component displaying the main
 * categories.
 */
const MainCategories = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}: {
  categories: Category[];
  setSelectedCategory: any;
  selectedCategory: Category | null;
}) => {
  return (
    <div
      className={clsx(
        "w-[20rem] ",
        "flex flex-col items-start justify-start gap-6",
        "max-lg:w-full"
      )}
    >
      <div className={clsx("text-700 text-xl font-bold")}>Treatments</div>

      <div
        className={clsx(
          "w-64 p-[4px] rounded-2xl",
          "flex flex-col items-start justify-start gap-[10px]",
          "max-lg:w-full max-lg:flex-row"
        )}
      >
        {categories.map((item: any, index: number) => (
          <CategoryItem
            index={index}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default MainCategories;
