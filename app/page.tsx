"use client";

import React, { useEffect, useRef } from 'react';
import { ChevronRight, Brain, Zap, Target, Users, ArrowRight, Quote } from 'lucide-react';
import {Header} from '@/components/Header/Header';
import * as THREE from 'three';
import './globals.css';

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    // Load Three.js and initialize the shader background
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      initShaderBackground();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
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

    // Updated fragment shader with purple-pink gradient
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      void main( void ) {
        vec2 position = - 0.0 + 3.0 * vUv;
        float wave1 = abs( sin( position.x * position.y + time / 8.0 ) );
        float wave2 = abs( sin( position.x * position.y + time / 6.0 ) );
        float wave3 = abs( sin( position.x * position.y + time / 4.0 ) );
        
        // Purple to pink gradient
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

    // Create mesh array
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
    renderer.setClearColor(0x000000, 1); // Changed alpha from 0 to 1 for full black
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    container.appendChild(renderer.domElement);
    
    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      uniforms.time.value += delta * 2; // Slowed down from 5 to 2
      
      // Slower camera rotation
      camera.rotation.x += delta * 0.05;
      camera.rotation.z += delta * 0.05;
      
      // Slower object rotation
      meshes.forEach((object, i) => {
        object.rotation.x += 0.02; // Slowed down from 0.04
        object.rotation.z += 0.02; // Slowed down from 0.04
        object.rotation.y += delta * 0.4 * (i % 2 ? 1 : -1); // Slowed down from 0.8
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
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

  const services = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Strategy & Consulting",
      description: "Strategic guidance to integrate AI solutions that drive measurable business impact"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Custom AI Development",
      description: "Tailored AI solutions built specifically for your unique business challenges"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Topic Modeling & NLP",
      description: "Advanced natural language processing for business communications analysis"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "AI Implementation",
      description: "End-to-end deployment and integration of AI systems into your workflow"
    }
  ];

  const stats = [
    { number: "500+", label: "AI Solutions Deployed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "15+", label: "Industries Served" },
    { number: "50M+", label: "Data Points Analyzed" }
  ];

  const testimonials = [
    {
      quote: "YaaraLabs transformed our customer support with their topic modeling solution. We now process 10x more communications with better insights.",
      author: "Sarah Chen",
      role: "CTO, TechCorp"
    },
    {
      quote: "Their AI strategy helped us identify opportunities we never knew existed. ROI was evident within the first quarter.",
      author: "Michael Rodriguez",
      role: "VP Operations, GlobalTech"
    }
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
        
        {/* Blend mode overlay for better text readability */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(185, 10, 189, 0.3) 0%, rgba(83, 50, 255, 0.3) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Animated white overlay for text contrast */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'fadeIn 10s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <section className="relative z-30 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto transition-all duration-1000 opacity-100 translate-y-0">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI Solutions That Drive
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Real Business Impact
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            From strategy to implementation, we transform your business communications with advanced AI-powered topic modeling and intelligent automation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-30 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
        
        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="solutions" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Solutions</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive AI solutions designed to transform your business operations and customer communications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                  <div className="text-pink-400 mb-4 group-hover:text-purple-400 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Solution */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Topic Modeling for Business Communications
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Our advanced topic modeling system analyzes customer communications across email, chat, and ticket data using state-of-the-art language models and clustering techniques.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-200">Cross-channel intelligence and unified analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-200">Automated categorization and trend identification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-200">Human-in-the-loop verification for quality assurance</span>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <div className="bg-gray-700 rounded-lg p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-6 h-6 text-pink-400" />
                      <span className="text-white font-semibold">AI-Powered Analysis</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Email Processing</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Chat Analysis</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Ticket Classification</span>
                        <span className="text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-300">Trusted by leading companies worldwide</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-8 relative">
                  <Quote className="w-8 h-8 text-pink-400 mb-4" />
                  <p className="text-gray-200 text-lg mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{testimonial.author.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.author}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our AI solutions can drive real impact for your organization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                Schedule a Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                View Case Studies
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
                <p className="text-gray-400">AI-driven solutions for tomorrow&apos;s challenges</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Solutions</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-pink-400 transition-colors">AI Strategy</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Custom Development</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Topic Modeling</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition-colors">Implementation</a></li>
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
              <p>&copy; {new Date().getFullYear()} YaaraLabs. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;