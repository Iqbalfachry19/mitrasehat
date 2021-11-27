import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroImage from "../components/HeroImage";

function products() {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>RTD Mitra Sehat</title>
      </Head>
      <Header />
      <HeroImage />
      <Footer />
    </div>
  );
}

export default products;
