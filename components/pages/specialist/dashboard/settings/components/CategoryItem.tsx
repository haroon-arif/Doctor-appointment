import clsx from "clsx";
import React from "react";

interface CategoryItem {
  index: number;
  setSelectedCategory: any;
  selectedCategory: any;
  item: any;
}

/**
 * CategoryItem component displays a single category with its name
 * It handles the selection of the category and may trigger a function passed via props to update the parent state.
 *
 * @param {Object} param0 - The props for the component.
 * @param {Object} param0.category - The category object containing category details.
 * @param {Function} param0.onSelect - Function to call when the category is selected.
 *
 * @returns {JSX.Element} Rendered category item.
 */
const CategoryItem = ({
  index,
  setSelectedCategory,
  selectedCategory,
  item,
}: CategoryItem) => {
  return (
    <div
      key={index}
      onClick={() => setSelectedCategory(item)}
      className={clsx(
        "relative py-3 px-4 text-[14px] cursor-pointer",
        "flex items-center justify-start self-stretch",
        "hover:text-accent",
        "transition-all duration-300 overflow-hidden",
        selectedCategory.id == item.id
          ? "font-semibold text-accent"
          : "font-medium text-500",
        " max-lg:w-[25%]"
      )}
    >
      <span className="relative z-10 max-lg:mx-auto">{item.name}</span>

      {/* Sliding Background */}
      <span
        className={clsx(
          "w-full absolute inset-0 bg-background-lite rounded-xl transition-all duration-300 ease-in-out",
          selectedCategory.id == item.id ? "left-0" : "-left-full"
        )}
      />
    </div>
  );
};

export default CategoryItem;
