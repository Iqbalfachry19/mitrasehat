import React from "react";

function Footer() {
  return (
    <footer className=" fixed bg-rtd_green-dark bottom-0 w-full   ">
      <div className="flex flex-col items-center">
        <div className="sm:w-2/3 text-center py-6">
          <p className="text-sm text-blue-700 font-bold">
            © {new Date().getFullYear()} by RTD Mitra Sehat
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
