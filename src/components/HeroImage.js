import { useRouter } from "next/router";
function HeroImage() {
  const router = useRouter();
  return (
    <header
      id="up"
      className="bg-center bg-fixed bg-no-repeat bg-hero-pattern-sm 2xl:bg-hero-pattern xl:bg-hero-pattern-xl lg:bg-hero-pattern-lg md:bg-hero-pattern-md sm:bg-hero-pattern-sm   bg-cover  h-screen relative"
    >
      <div className="h-screen bg-opacity-50 bg-black flex items-center justify-center">
        <div className="mx-2 text-center">
          <h1 className="text-gray-100 font-extrabold text-4xl xs:text-5xl md:text-6xl">
            <span className="text-white">Selamat</span> Datang
          </h1>
          <h2 className="text-gray-200 font-extrabold text-3xl xs:text-4xl md:text-5xl leading-tight">
            Kami Melayani<span className="text-white"> Kebutuhan</span>{" "}
            <span className="text-white">Anda</span>
          </h2>
          <div className="inline-flex">
            <button
              onClick={() => router.push("/products")}
              className="p-2 my-5 mx-2 bg-rtd_green hover:bg-rtd_green-dark font-bold text-white rounded border-2 border-transparent hover:border-indigo-800 shadow-md transition duration-500 md:text-xl"
            >
              Get Products
            </button>

            <button
              onClick={() => router.push("/about")}
              className="p-2 my-5 mx-2 bg-transparent border-2 bg-indigo-200 bg-opacity-75 hover:bg-opacity-100 border-indigo-700 rounded hover:border-indigo-800 font-bold text-indigo-800 shadow-md transition duration-500 md:text-lg"
            >
              About US
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeroImage;
