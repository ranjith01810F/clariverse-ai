"use client";

import React, { useEffect, useRef } from 'react';
import { Brain, Mail, MessageSquare, Ticket, TrendingUp, ArrowRight, Database, Settings, Shield, Zap } from 'lucide-react';
import {Header} from '@/components/Header/Header';
import * as THREE from 'three';
import './globals.css';

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      initShaderBackground();
    };
    document.head.appendChild(script);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const initShaderBackground = () => {
    if (!containerRef.current || !window.THREE) return;

    const container = containerRef.current;
    const scene = new window.THREE.Scene();
    const clock = new window.THREE.Clock();
    
    const camera = new window.THREE.OrthographicCamera( 
      window.innerWidth / -2, 
      window.innerWidth / 2, 
      window.innerHeight / 2, 
      window.innerHeight / -2, 
      -5000, 
      5000 
    );
    camera.position.set(30, 30, 30);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);

    const cubeSize = 80;
    const geometry = new window.THREE.BoxGeometry(1, cubeSize * 4, 1);
    
    const uniforms = {
      time: { value: 1.0 }
    };

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      void main( void ) {
        vec2 position = - 0.0 + 3.0 * vUv;
        float wave1 = abs( sin( position.x * position.y + time / 8.0 ) );
        float wave2 = abs( sin( position.x * position.y + time / 6.0 ) );
        float wave3 = abs( sin( position.x * position.y + time / 4.0 ) );
        
        float red = mix(0.7, 1.0, wave1) * wave2;
        float green = mix(0.2, 0.4, wave2) * wave3;
        float blue = mix(0.7, 0.9, wave3) * wave1;
        
        gl_FragColor = vec4( red, green, blue, 0.8 );
      }
    `;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const material = new window.THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true
    });

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 2000; i++) {
      const mesh = new window.THREE.Mesh(geometry, material);
      mesh.position.z = i * 4 - cubeSize * 50;
      mesh.rotation.z = i * 0.01;
      scene.add(mesh);
      meshes.push(mesh);
    }

    const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    container.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      uniforms.time.value += delta * 2;
      
      camera.rotation.x += delta * 0.05;
      camera.rotation.z += delta * 0.05;
      
      meshes.forEach((object, i) => {
        object.rotation.x += 0.02;
        object.rotation.z += 0.02;
        object.rotation.y += delta * 0.4 * (i % 2 ? 1 : -1);
      });
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('product-features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const productFeatures = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Analysis",
      description: "Automatically categorize and prioritize emails to streamline customer support"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Chat Insights",
      description: "Extract key insights from chat conversations to enhance customer engagement"
    },
    {
      icon: <Ticket className="w-8 h-8" />,
      title: "Ticket Management",
      description: "Smart ticket classification for faster resolution and better resource allocation"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trend Detection",
      description: "Identify emerging trends and issues across all communication channels"
    }
  ];

  const businessBenefits = [
    { icon: <Database className="w-6 h-6" />, title: "Cross-Channel Intelligence", description: "Unified analysis across email, chat, and ticket data" },
    { icon: <Settings className="w-6 h-6" />, title: "Automated Categorization", description: "Efficient routing and prioritization of customer issues" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Trend Identification", description: "Early detection of emerging problems and opportunities" },
    { icon: <Brain className="w-6 h-6" />, title: "Knowledge Discovery", description: "Surface insights missed in manual review processes" },
    { icon: <Shield className="w-6 h-6" />, title: "Quality Assurance", description: "Human verification ensures reliable outputs" },
    { icon: <Zap className="w-6 h-6" />, title: "Scalable Processing", description: "Handle growing volumes of customer communications" }
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#010101' }}>
      {/* Three.js Shader Background */}
      <div className="banner fixed inset-0 flex flex-col items-center justify-center text-center z-0 overflow-hidden" style={{ minHeight: '100vh' }}>
        <div 
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: '100vh' }}
        />
        
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(185, 10, 189, 0.3) 0%, rgba(83, 50, 255, 0.3) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
        
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'fadeIn 10s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Navigation Bar - Public version without sidebar */}
      <Header transparent={true} isLoggedIn={false} />

      {/* Hero Section */}
      <section className="relative z-30 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto transition-all duration-1000 opacity-100 translate-y-0">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transform Your Business
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              with AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            YaaraLabs&apos; Topic Modeling Platform empowers businesses to unlock actionable insights from customer communications, driving efficiency and growth
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
              Request a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToFeatures}
              className="text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Discover Features
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-30 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
        {/* Product Features */}
        <section id="product-features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose Our Platform?</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our Topic Modeling Platform leverages advanced AI to analyze customer communications, providing businesses with the tools to make data-driven decisions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productFeatures.map((feature, index) => (
                <div key={index} className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                  <div className="text-pink-400 mb-4 group-hover:text-purple-400 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Value Propositions */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Business Value Propositions</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                This system delivers comprehensive business benefits through sophisticated automated analysis 
                with human oversight for quality control and actionable insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessBenefits.map((benefit, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-all duration-300">
                  <div className="text-pink-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your AI Journey Today
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              See how YaaraLabs can transform your customer communications and drive business success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                Schedule a Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                Explore Case Studies
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">Y</span>
                  </div>
                  <span className="text-white text-lg ml-2 font-semibold">YaaraLabs</span>
                </div>
                <p className="text-gray-400">Empowering businesses with AI-driven insights</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Email Analysis</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Chat Insights</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Ticket Management</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Trend Detection</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-pink-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Case Studies</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>contact@yaaralabs.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>San Francisco, CA</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} YaaraLabs. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;