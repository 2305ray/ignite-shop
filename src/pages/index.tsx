import { HomeContainer, Produtos } from "../styles/pages/home";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Stripe from "stripe";
import Link from "next/link";

interface ProductType {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface HomeProps {
  products: ProductType[];
}

export default function Home({ products }: HomeProps) {
  console.log(products);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          <Link href={`/product/${product.id}`} key={product.id}>
            <Produtos className="keen-slider__slide">
              <Image
                src={product.imageUrl}
                width={520}
                height={480}
                alt={product.name}
                priority
              ></Image>

              <footer>
                <strong>{product.name}</strong>
                <span>
                  {" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price / 100)}
                </span>
              </footer>
            </Produtos>
          </Link>
        );
      })}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  console.log("Stripe products response:", response);
  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount, //vai vir em centavos
    };
  });
  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // a cada tanto tempo (2horas) vai recriar a versão estática da página
  };
};
