import React from "react";

const DeptHero = ({ dept, eyebrow }) => {
  return (
    <section className="hero-glow border-b border-white/5">
      <div className="container-page py-20 text-center">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {dept.name}
        </h1>
        {dept.description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dept.description}
          </p>
        )}
      </div>
    </section>
  );
};

export default DeptHero;
