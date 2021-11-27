import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
function services() {
  return (
    <div>
      <Head>
        <title>RTD Mitra Sehat | Services</title>
      </Head>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Our Services
        </h1>
        <p>RTD Mitra Sehat melayani terapi :</p>
        <ul className="flex-row">
          <li className="list-disc">
            Pengukuran Tekanan Darah
            <span className="float-right">Rp.5.000/cek</span>
          </li>
          <li className="list-disc">
            Cek Kolesterol <span className="float-right">Rp.25.000/cek</span>
          </li>
          <li className="list-disc">
            Asam Urat <span className="float-right">Rp.20.000/cek</span>
          </li>
          <li className="list-disc">
            Gula Darah <span className="float-right">Rp.20.000/cek</span>
          </li>
          <li className="list-disc">
            Cek Kesehatan Akupuntur{" "}
            <span className="float-right">Rp.10.000/cek</span>
          </li>
          <li className="list-disc">
            Terapi Akupuntur Elektro{" "}
            <span className="float-right">Rp.25.000/15 menit</span>
          </li>
          <li className="list-disc">
            Terapi Matras Photon Bio Energy{" "}
            <span className="float-right">Rp.50.000/1 jam</span>
          </li>
          <li className="list-disc">
            Totok Aura Wajah{" "}
            <span className="float-right">Rp.100.000/treatment</span>
          </li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default services;
