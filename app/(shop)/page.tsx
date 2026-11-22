
import FeaturedProductCarousel, {
  type FeaturedProduct,
} from "@/components/home/FeaturedProductCarousel";
import { getProducts } from "@/lib/products";
import type { Product } from "@/types";

const electronicsCategoryOrder = [
  "laptops",
  "computers",
  "smartphones",
  "tablets",
  "mobile-accessories",
];

type CategorizedFeaturedProduct = FeaturedProduct & {
  category: string;
};

const getBestRatedProductsByCategory = (products: Product[]): FeaturedProduct[] => {
  const bestByCategory = new Map<string, CategorizedFeaturedProduct>();

  for (const product of products) {
    const categoryKey = product.category.trim().toLowerCase();
    const reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const ratings = reviews
      .map((review) => review.rating)
      .filter((rating) => Number.isFinite(rating) && rating >= 0 && rating <= 5);

    if (!categoryKey || ratings.length === 0) {
      continue;
    }

    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const currentBest = bestByCategory.get(categoryKey);

    if (
      currentBest &&
      (averageRating < currentBest.averageRating ||
        (averageRating === currentBest.averageRating && reviews.length <= currentBest.reviewCount))
    ) {
      continue;
    }

    bestByCategory.set(categoryKey, {
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      averageRating,
      reviewCount: reviews.length,
    });
  }

  const getCategoryPriority = (category: string) => {
    const index = electronicsCategoryOrder.indexOf(category.toLowerCase());
    return index === -1 ? electronicsCategoryOrder.length : index;
  };

  return [...bestByCategory.values()].sort((first, second) => {
    const priorityDifference = getCategoryPriority(first.category) - getCategoryPriority(second.category);
    return priorityDifference || first.category.localeCompare(second.category);
  }).map(({ title, thumbnail, category, averageRating, reviewCount }) => ({
    title,
    thumbnail,
    category,
    averageRating,
    reviewCount,
  }));
};

const HomePage = async () => {
  const products = await getProducts();
  const featuredProducts = getBestRatedProductsByCategory(products);

  return <FeaturedProductCarousel products={featuredProducts} />;
};

export default HomePage;
