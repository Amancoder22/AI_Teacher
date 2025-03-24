import React from "react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="mr-2 text-xl text-primary-500">
                  <i className="fas fa-robot"></i>
                </div>
                <span className="font-bold text-gray-800">AI Teacher Assistant</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mt-1">Making learning fun and interactive!</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-gray-600 hover:text-primary-500 transition">Help</a>
            <a href="#" className="text-gray-600 hover:text-primary-500 transition">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-primary-500 transition">Terms</a>
            <a href="#" className="text-gray-600 hover:text-primary-500 transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
