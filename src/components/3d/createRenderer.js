import * as THREE from 'three';

// Returns a WebGL renderer, or null when the browser has no WebGL (old GPU, locked-down machine,
// headless test). Callers skip the 3D layer instead of crashing the whole app.
export const createRenderer = (options = {}) => {
  try {
    return new THREE.WebGLRenderer({ alpha: true, antialias: true, ...options });
  } catch (error) {
    console.warn('WebGL unavailable, skipping 3D view:', error?.message || error);
    return null;
  }
};
