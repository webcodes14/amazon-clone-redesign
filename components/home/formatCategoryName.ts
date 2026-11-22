const formatCategoryName = (category: string) =>
    category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export default formatCategoryName;
