"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Google quad palette — the particle field is tinted with these only.
const PALETTE = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const PARTICLE_COUNT = 1400;
const FIELD_WIDTH = 34;
const FIELD_HEIGHT = 20;
const FIELD_DEPTH = 22;

/**
 * Pointer-reactive WebGL particle field for the landing hero.
 *
 * Deliberately scoped to the landing page: the picker, application form and
 * admin views stay completely static so nothing competes with the task at hand.
 *
 * - Honours prefers-reduced-motion (renders one static frame, no rAF loop)
 * - Pauses when the tab is hidden or the hero scrolls out of view
 * - Disposes geometry/material/renderer on unmount
 */
const HeroBackground = ({ className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Bail out entirely if WebGL is unavailable — the CSS glow still shows.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const { clientWidth, clientHeight } = container;
    const width = clientWidth || 1;
    const height = clientHeight || 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    // --- Particle field -----------------------------------------------------
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const drift = new Float32Array(PARTICLE_COUNT);
    const paletteColors = PALETTE.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH;
      positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_DEPTH;

      // Weight toward blue so the field reads as one system, not a rainbow.
      const swatch =
        paletteColors[Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 3)];
      colors[i * 3] = swatch.r;
      colors[i * 3 + 1] = swatch.g;
      colors[i * 3 + 2] = swatch.b;

      drift[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.09,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Pointer parallax ---------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      // -1..1 across the hero box
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    // --- Render loop --------------------------------------------------------
    const basePositions = positions.slice();
    const clock = new THREE.Clock();
    let frameId = null;
    let isVisible = true;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();

      // Ease the camera toward the pointer for a parallax feel.
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      camera.position.x = pointer.x * 2.6;
      camera.position.y = -pointer.y * 1.6;
      camera.lookAt(0, 0, 0);

      // Slow drift so the field breathes even when the pointer is still.
      const attribute = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const y = i * 3 + 1;
        attribute.array[y] =
          basePositions[y] + Math.sin(elapsed * 0.35 + drift[i]) * 0.35;
      }
      attribute.needsUpdate = true;

      points.rotation.y = elapsed * 0.025;

      renderer.render(scene, camera);
    };

    const animate = () => {
      renderFrame();
      frameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (frameId === null && isVisible && !prefersReducedMotion) {
        clock.getDelta(); // drop time accumulated while paused
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    if (prefersReducedMotion) {
      // One static frame — the field is still there, it just doesn't move.
      renderer.render(scene, camera);
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      container.addEventListener("pointerleave", handlePointerLeave);
      start();
    }

    // Pause when scrolled away or the tab is backgrounded.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // --- Resize -------------------------------------------------------------
    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth || 1;
      const nextHeight = container.clientHeight || 1;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
      if (prefersReducedMotion) renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // --- Teardown -----------------------------------------------------------
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      // Fades out toward the bottom so the field never hard-cuts into the
      // section below it.
      style={{
        maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
      }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
};

export default HeroBackground;
