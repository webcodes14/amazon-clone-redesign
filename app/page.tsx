import { getProducts } from "@/lib/products";
import ThemeBtn from "@/components/theme/ThemeBtn";

const Home = async () => {
  const data = await getProducts();

  console.log(data[0]);

  return (
    <>
      <ThemeBtn></ThemeBtn>
    </>
  )
}

export default Home;
