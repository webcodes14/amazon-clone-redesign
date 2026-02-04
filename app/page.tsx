import { getProducts } from "@/lib/products";

const Home = async () => {
  const data = await getProducts();

  console.log(data[0].category);

  return (
    <>
      
    </>
  )
}

export default Home;
