import React from "react";

const DeptHero = ({ dept }) => {
  return (
    <section className="hero-glow border-b border-border">
      <div className="container-page py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {dept.name}
        </h1>
        {dept.description && (
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{dept.description}</p>
        )}
      </div>
    </section>
  );
};

export default DeptHero;
