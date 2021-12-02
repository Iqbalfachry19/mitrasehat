import Image from "next/image";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  XIcon,
} from "@heroicons/react/outline";
import { getSession, signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { useState } from "react";
import db from "../../firebase";
function Header({ action = "/products" }) {
  const [burgerStatus, setBurgerStatus] = useState(false);
  const [session] = useSession();
  const router = useRouter();
  const items = useSelector(selectItems);
  const preventDefault = (f) => (e) => {
    e.preventDefault();
    f(e);
  };
  const [query, setQuery] = useState("");
  const handleParam = (setValue) => (e) => setValue(e.target.value);
  const handleSubmit = preventDefault(() => {
    if (query.length > 0) {
      router.push({
        pathname: action,
        query: { q: query },
      });
      setQuery("");
    } else {
      router.push({ pathname: action });
      setQuery("");
    }
  });

  return (
    <header>
      <div className="flex items-center bg-rtd_green p-1 flex-grow py-2">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src="/img/Screenshot_18.png"
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500"
        >
          <input
            type="text"
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
            value={query}
            onChange={handleParam(setQuery)}
            placeholder={router.query.q || "cari produk apa?"}
          />
          <SearchIcon className="h-12 p-4" onClick={handleSubmit} />
        </form>
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div onClick={!session ? signIn : signOut} className="link">
            <p>{session ? `Hello, ${session.user.name}` : "Sign In"}</p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>
          <div onClick={() => router.push("/orders")} className="link">
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>
          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">
              Basket
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-2 pl-6 bg-rtd_green-light text-white text-sm">
        <p
          className="link flex items-center"
          onClick={() => setBurgerStatus(true)}
        >
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p onClick={() => router.push("/")} className="link">
          Home
        </p>
        <p onClick={() => router.push("/about")} className="link">
          About
        </p>
        <p onClick={() => router.push("/services")} className="link">
          Services
        </p>
        <p onClick={() => router.push("/products")} className="link">
          Products
        </p>
      </div>
      <nav
        className={`z-50 fixed top-0  bottom-0 bg-rtd_green  p-4 text-white ${
          burgerStatus ? "flex-cols" : "hidden"
        }`}
      >
        <div>
          <XIcon className="h-6 mr-1" onClick={() => setBurgerStatus(false)} />
        </div>

        <p onClick={() => router.push("/")} className="link">
          Home
        </p>

        <p onClick={() => router.push("/about")} className="link">
          About
        </p>
        <p onClick={() => router.push("/services")} className="link">
          Service
        </p>
        <p onClick={() => router.push("/products")} className="link">
          Products
        </p>
        <p onClick={() => router.push("/admin/dashboard")} className="link">
          Dashboard
        </p>
      </nav>
    </header>
  );
}

export default Header;
