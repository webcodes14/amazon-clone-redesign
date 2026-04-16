import { getProducts } from "@/lib/products";

const HomePage = async () => {
  const data = await getProducts();

  console.log(data[0]);

  return (
    <>
      
    </>
  )
}

export default HomePage;
