import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreePieChart = ({ data }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = '';

    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth || 300;
    const height = 300;
    
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2, 10, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(5, 10, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const group = new THREE.Group();
    scene.add(group);

    const total = Object.values(data).reduce((a, b) => a + b, 0);
    let currentAngle = 0;
    const colors = [
        0x00f0ff,
        0xffffff,
        0x0088ff,
        0xaaaaaa
    ];
    const keys = Object.keys(data);

    keys.forEach((key, i) => {
        const val = data[key];
        const angle = (val / total) * Math.PI * 2;
        const safeAngle = isNaN(angle) ? 0 : angle;
        
        const geometry = new THREE.CylinderGeometry(3, 3, 1, 32, 1, false, currentAngle, safeAngle);
        const material = new THREE.MeshStandardMaterial({
            color: colors[i % colors.length],
            metalness: 0.6,
            roughness: 0.2,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = i * 0.1; 
        group.add(mesh);
        
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
        mesh.add(line);

        currentAngle += safeAngle;
    });
    
    const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    let frameId;
    const animate = () => {
        frameId = requestAnimationFrame(animate);
        group.rotation.y += 0.005;
        group.rotation.x = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
        renderer.render(scene, camera);
    };
    animate();

    return () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
        if(mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [data]);

  return <div ref={mountRef} className="w-full h-[300px]" />;
};

export default ThreePieChart;
