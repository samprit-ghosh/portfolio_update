import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, MeshDistortMaterial, Float, Sparkles, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

function AnimatedTorus({ color, emissive, isDesktop }) {
    const meshRef = useRef();
    useFrame(({ clock }) => {
        if (meshRef.current && isDesktop) {
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        }
    });
    return (
        <Float speed={isDesktop ? 3 : 0} rotationIntensity={isDesktop ? 0.6 : 0} floatIntensity={isDesktop ? 1.5 : 0}>
            <Torus ref={meshRef} args={[1.8, 0.5, 120, 240]}>
                <MeshDistortMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.4}
                    distort={isDesktop ? 0.5 : 0}
                    speed={isDesktop ? 2.5 : 0}
                    roughness={0.05}
                    metalness={0.95}
                />
            </Torus>
        </Float>
    );
}

const TitleWord = ({ word, index, isDesktop }) => {
    const letters = Array.from(word);
    return (
        <span className="inline-block whitespace-nowrap mr-4 last:mr-0">
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    initial={isDesktop ? { opacity: 0, y: 50, rotateX: -90 } : { opacity: 1, y: 0, rotateX: 0 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={isDesktop ? {
                        duration: 0.8,
                        delay: 0.5 + index * 0.2 + i * 0.05,
                        ease: [0.2, 0.65, 0.3, 0.9]
                    } : { duration: 0 }}
                    className={`inline-block ${index === 1 ? 'gradient-text' : ''}`}
                >
                    {letter}
                </motion.span>
            ))}
        </span>
    );
};

const MobileBackground = ({ themeColors, isDark }) => {
    const particles = useMemo(() => {
        return [...Array(35)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 8 + 12,
            delay: Math.random() * 8,
            opacity: Math.random() * 0.5 + 0.1,
            color: i % 3 === 0 ? themeColors.primary : i % 3 === 1 ? themeColors.secondary : '#ffffff'
        }));
    }, [themeColors]);

    const floatingOrbs = useMemo(() => [
        { x: '15%', y: '20%', size: 180, color: themeColors.primary, opacity: 0.15, duration: 20, delay: 0 },
        { x: '75%', y: '60%', size: 220, color: themeColors.secondary, opacity: 0.12, duration: 25, delay: 3 },
        { x: '50%', y: '35%', size: 140, color: themeColors.primary, opacity: 0.08, duration: 18, delay: 6 },
        { x: '30%', y: '75%', size: 160, color: themeColors.secondary, opacity: 0.1, duration: 22, delay: 2 },
    ], [themeColors]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Large animated gradient orbs */}
            {floatingOrbs.map((orb, i) => (
                <motion.div
                    key={`orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                        left: orb.x,
                        top: orb.y,
                        width: orb.size,
                        height: orb.size,
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                        opacity: orb.opacity,
                        filter: 'blur(40px)',
                        transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                        x: [0, 30, -20, 10, 0],
                        y: [0, -25, 15, -10, 0],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: orb.delay
                    }}
                />
            ))}

            {/* Rotating ring outlines */}
            <motion.div
                className="absolute top-1/2 left-1/2"
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: 280,
                        height: 280,
                        border: `1px solid ${isDark ? 'rgba(249,115,22,0.08)' : 'rgba(59,130,246,0.08)'}`,
                    }}
                />
            </motion.div>
            <motion.div
                className="absolute top-1/2 left-1/2"
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: 380,
                        height: 380,
                        border: `1px dashed ${isDark ? 'rgba(6,182,212,0.06)' : 'rgba(139,92,246,0.06)'}`,
                    }}
                />
            </motion.div>

            {/* Stardust particles */}
            {particles.map((p) => (
                <motion.div
                    key={`particle-${p.id}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                    initial={{ y: '-5vh', opacity: 0 }}
                    animate={{
                        y: ['0vh', '110vh'],
                        opacity: [0, p.opacity, p.opacity, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: p.delay,
                    }}
                />
            ))}

            {/* Pulsing accent dots */}
            {[
                { x: '10%', y: '30%', size: 4 },
                { x: '85%', y: '25%', size: 3 },
                { x: '70%', y: '70%', size: 5 },
                { x: '25%', y: '80%', size: 3 },
                { x: '55%', y: '15%', size: 4 },
                { x: '40%', y: '55%', size: 3 },
            ].map((dot, i) => (
                <motion.div
                    key={`dot-${i}`}
                    className="absolute rounded-full"
                    style={{
                        left: dot.x,
                        top: dot.y,
                        width: dot.size,
                        height: dot.size,
                        backgroundColor: i % 2 === 0 ? themeColors.primary : themeColors.secondary,
                        boxShadow: `0 0 ${dot.size * 4}px ${i % 2 === 0 ? themeColors.primary : themeColors.secondary}`,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: Math.random() * 4,
                    }}
                />
            ))}
        </div>
    );
};

const Hero = () => {
    const containerRef = useRef(null);
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 980);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 981px)');
        const updateDesktop = (e) => setIsDesktop(e.matches);
        
        setIsDesktop(media.matches);
        media.addEventListener('change', updateDesktop);

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            media.removeEventListener('change', updateDesktop);
            observer.disconnect();
        };
    }, []);

    const themeColors = isDark ? {
        primary: '#f97316',
        secondary: '#06b6d4',
        emissive: '#ea580c'
    } : {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        emissive: '#2563eb'
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax and scroll effects with Spring for smoothness
    const springConfig = { damping: 25, stiffness: 100, restDelta: 0.001 };

    const yRaw = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const opacityRaw = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

    const y = useSpring(yRaw, springConfig);
    const opacity = useSpring(opacityRaw, springConfig);
    const scale = useSpring(scaleRaw, springConfig);

    // Mouse tracking for subtle tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    };

    return (
        <section
            id="home"
            ref={containerRef}
            onMouseMove={isDesktop ? handleMouseMove : undefined}
            className="relative h-[125vh] md:h-screen flex items-start md:items-center justify-center overflow-hidden grid-overlay"
            style={{ background: 'var(--bg-main)' }}
        >
            {/* 3D Canvas Background (Desktop Only) */}
            {isDesktop && (
                <div className="absolute inset-0 z-0">
                    <Canvas shadows dpr={[1, 2]}>
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.4} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={themeColors.primary} castShadow />
                            <pointLight position={[-10, -10, -10]} intensity={1} color={themeColors.secondary} />
                            
                            <AnimatedTorus color={themeColors.primary} emissive={themeColors.emissive} isDesktop={isDesktop} />
                            
                            <Sparkles count={80} scale={10} size={1.5} speed={0.4} color={themeColors.primary} opacity={0.3} />
                            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                            
                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                        </Suspense>
                    </Canvas>
                </div>
            )}

            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                {/* Cinematic Glows */}
                <div className={`absolute -top-[10%] -left-[10%] ${isDesktop ? 'w-[50%] h-[50%]' : 'w-[80%] h-[80%]'} rounded-full opacity-30 blur-[120px]`} style={{ background: `radial-gradient(circle, ${themeColors.primary} 0%, transparent 70%)` }} />
                <div className={`absolute -bottom-[10%] -right-[10%] ${isDesktop ? 'w-[50%] h-[50%]' : 'w-[80%] h-[80%]'} rounded-full opacity-20 blur-[120px]`} style={{ background: `radial-gradient(circle, ${themeColors.secondary} 0%, transparent 70%)` }} />
                
                {/* Mobile-only rich animated background */}
                {!isDesktop && <MobileBackground themeColors={themeColors} isDark={isDark} />}
            </div>

            {/* Content */}
            <motion.div
                key={isDesktop ? 'desktop' : 'mobile'}
                style={{
                    y: isDesktop ? y : 0,
                    opacity: isDesktop ? opacity : 1,
                    scale: isDesktop ? scale : 1,
                    rotateX: isDesktop ? tiltX : 0,
                    rotateY: isDesktop ? tiltY : 0,
                    transformStyle: 'preserve-3d'
                }}
                className="relative z-10 text-center px-6 max-w-7xl mx-auto w-full pt-20 md:pt-0"
            >
                {/* Badge */}
                <motion.div
                    initial={isDesktop ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={isDesktop ? { duration: 0.6, ease: "easeOut" } : { duration: 0 }}
                    className="group mx-auto mb-8 w-fit"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    <div className="section-pill flex items-center gap-3 px-5 py-2.5 bg-white/80 dark:bg-white/5 dark:backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] group-hover:text-primary transition-colors" style={{ color: 'var(--text-main)' }}>
                            AVAILABLE FOR NEW PROJECTS
                        </span>
                    </div>
                </motion.div>

                {/* Name */}
                <motion.div
                    initial={isDesktop ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isDesktop ? { delay: 0.3, duration: 0.5 } : { duration: 0 }}
                    className="flex items-center justify-center gap-4 mb-4"
                    style={{ transform: 'translateZ(30px)' }}
                >
                    <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-primary/50" />
                    <h2 className="text-[10px] md:text-lg text-primary font-bold tracking-[0.4em] uppercase">
                        Samprit Ghosh
                    </h2>
                    <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-primary/50" />
                </motion.div>

                {/* Title */}
                <h1
                    className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[8rem] font-black leading-[0.95] tracking-tighter mb-8 md:mb-10 flex flex-wrap justify-center items-center"
                    style={{ perspective: '1000px', transform: 'translateZ(80px)' }}
                >
                    <TitleWord word="Full" index={0} isDesktop={isDesktop} />
                    <TitleWord word="Stack" index={1} isDesktop={isDesktop} />
                    <TitleWord word="Developer" index={2} isDesktop={isDesktop} />
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isDesktop ? { delay: 1.2, duration: 0.8 } : { duration: 0 }}
                    className="text-sm md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16 px-4 font-bold"
                    style={{ transform: 'translateZ(40px)', color: 'var(--text-main)' }}
                >
                    Crafting high-performance digital experiences with precision and purpose.
                    Specializing in robust full-stack architectures and pixel-perfect interfaces.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={isDesktop ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isDesktop ? { delay: 1.5, duration: 0.8 } : { duration: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    style={{ transform: 'translateZ(60px)' }}
                >
                    <a href="#projects" className="btn-primary min-w-[200px] flex items-center justify-center group">
                        Explore My Work
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="ml-2"
                        >
                            →
                        </motion.span>
                    </a>
                    <a href="#contact" className="btn-secondary min-w-[200px] glass">
                        Let's Talk
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <div className="w-[24px] h-[40px] md:w-[30px] md:h-[50px] rounded-full border-2 flex justify-center p-1.5 md:p-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary"
                    />
                </div>
                <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>Scroll Down</span>
            </motion.div>

            {/* Side Indicators (Desktop Only) */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 items-center text-white/20">
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="rotate-90 text-[10px] tracking-[0.5em] uppercase whitespace-nowrap">Introduction</span>
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
        </section>
    );
};

export default Hero;
