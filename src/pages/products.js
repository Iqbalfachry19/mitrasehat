import { json } from "micro";
import { getSession } from "next-auth/client";
import Head from "next/head";
import db from "../../firebase";
import Banner from "../components/Banner";
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";

export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>RTD Mitra Sehat | Products</title>
      </Head>
      <Header />
      <main className="max-w-screen-2xl mx-auto">
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { q } = context.query;
  if (q === undefined) {
    const product = await db.collection("products").get();
    const products = await Promise.all(
      product.docs.map(async (product) => ({
        id: product.id,
        title: product.data().title,
        price: product.data().price,
        image: product.data().image,
        description: product.data().description,
        category: product.data().category,
      }))
    ).catch((error) => {
      console.log(error);
    });
    return {
      props: {
        products,
        session,
      },
    };
  } else {
    const product = await db
      .collection("products")
      .where("title", "==", q)
      .get();
    const products = await Promise.all(
      product.docs.map(async (product) => ({
        id: product.id,
        title: product.data().title,
        price: product.data().price,
        image: product.data().image,
        description: product.data().description,
        category: product.data().category,
      }))
    ).catch((error) => {
      console.log(error);
    });
    return {
      props: {
        products,
        session,
      },
    };
  }
}
