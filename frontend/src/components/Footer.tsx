import React from "react";

const Footer = () => {
  return (
    <footer className="w-full text-center p-4 mt-8 border-t">
      <p className="text-sm text-gray-500">© {new Date().getFullYear()} ALIPT - Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
