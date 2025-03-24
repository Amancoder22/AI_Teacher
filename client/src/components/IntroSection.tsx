import React from "react";

const IntroSection = () => {
  return (
    <section className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <div 
          className="w-24 h-24 md:w-32 md:h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 text-4xl md:text-5xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <i className="fas fa-graduation-cap"></i>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Learn Anything with AI</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Enter a topic you'd like to learn about, select your grade level, and our AI teacher will create a personalized lecture just for you!
      </p>
    </section>
  );
};

export default IntroSection;
