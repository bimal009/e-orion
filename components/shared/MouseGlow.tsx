"use client"
import React, { useState, useEffect } from 'react'

const MouseGlow = ({ 
    className = "",
    glowConfigs = [
        {
            size: 384, // w-96 = 24rem = 384px
            color: "bg-primary/15",
            blur: "blur-3xl",
            transition: "transition-all duration-700 ease-out",
            offsetX: 0,
            offsetY: 0,
            orbital: false
        },
        {
            size: 320, // w-80 = 20rem = 320px  
            color: "bg-accent/12",
            blur: "blur-3xl", 
            transition: "transition-all duration-1000 ease-out",
            offsetX: 100,
            offsetY: 100,
            orbital: true
        },
        {
            size: 256, // w-64 = 16rem = 256px
            color: "bg-primary/10",
            blur: "blur-2xl",
            transition: "transition-all duration-500 ease-out", 
            offsetX: -50,
            offsetY: 50,
            orbital: false
        }
    ]
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [currentTime, setCurrentTime] = useState(0)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        if (!hasMounted) return;
        const handleMouseMove = (e: any ) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [hasMounted])

    useEffect(() => {
        if (!hasMounted) return;
        let animationFrameId: number
        const tick = () => {
            setCurrentTime(Date.now())
            animationFrameId = requestAnimationFrame(tick)
        }
        tick()
        return () => cancelAnimationFrame(animationFrameId)
    }, [hasMounted])

    const calculatePosition = (config: any, currentTime: number) => {
        let x = mousePosition.x - config.size / 2 + config.offsetX
        let y = mousePosition.y - config.size / 2 + config.offsetY

        if (config.orbital) {
            x += Math.sin(currentTime / 3000) * 50
            y += Math.cos(currentTime / 3000) * 50
        }

        return { x, y }
    }

    if (!hasMounted) return null

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            {glowConfigs.map((config, index) => {
                const position = calculatePosition(config, currentTime)
                return (
                    <div
                        key={index}
                        className={`absolute rounded-full pointer-events-none ${config.color} ${config.blur} ${config.transition}`}
                        style={{
                            width: `${config.size}px`,
                            height: `${config.size}px`,
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            transform: 'translate3d(0px, 0px, 0px)'
                        }}
                    />
                )
            })}
        </div>
    )
}

export default MouseGlow