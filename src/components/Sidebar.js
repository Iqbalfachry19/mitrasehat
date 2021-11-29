import { useRouter } from "next/router";
import React from "react";

function Sidebar() {
  const router = useRouter();
  return (
    <div className="flex flex-col ">
      <div
        onClick={() => router.push("/admin/dashboard")}
        className="button cursor-pointer"
      >
        <p>Dashboard</p>
      </div>
      <div
        onClick={() => router.push("/admin/create")}
        className="button cursor-pointer"
      >
        <p>Tambah Produk</p>
      </div>
    </div>
  );
}

export default Sidebar;
