import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";

function About() {
  return (
    <div>
      <Head>
        <title>RTD Mitra Sehat | About</title>
      </Head>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          About US
        </h1>
        <p>
          RTD Mitra Sehat melayani service terapi detox dan produk kesehatan
          herbal yang memakai produk kesehatan kerajaan tiongkok kuno dengan
          pengolahan teknologi modern
        </p>
        <br></br>
        <h1 className="text-xl ">Kontak Kami</h1>
        <p>
          Alamat: Perum Fajar Indah Sudirman Regency Blok D8 Tangkeran Selatan -
          Pekanbaru
        </p>
        <p>Jam Buka : 08:30 - 16:00 WIB</p>
        <p>Konsultasi Dokter WA : 081932377234</p>
      </main>
      <Footer />
    </div>
  );
}

export default About;
