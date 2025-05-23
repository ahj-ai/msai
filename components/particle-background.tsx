"use client"

import React, { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  lightMode?: boolean;
}

export function ParticleBackground({ lightMode = false }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Add dependency to the effect to update when lightMode changes
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 80
    const connectionDistance = 150
    const mouse = { x: 0, y: 0 }
    let frame = 0

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      hue: number
      originalX: number
      originalY: number
      force: number
      angle: number
      va: number

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth)
        this.y = Math.random() * (canvas?.height || window.innerHeight)
        this.originalX = this.x
        this.originalY = this.y
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.opacity = Math.random() * 0.6 + 0.3
        this.hue = Math.random() * 60 + 210 // Blue to purple range
        this.color = `hsla(${this.hue}, 80%, 50%, ${this.opacity})`
        this.force = 0
        this.angle = Math.random() * Math.PI * 2
        this.va = Math.random() * 0.02 - 0.01
      }

      update() {
        this.angle += this.va
        this.force = Math.sin(frame * 0.02) * 2

        // Oscillating movement
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxForce = 100

        if (distance < maxForce) {
          const force = (1 - distance / maxForce) * 8
          this.x -= (dx / distance) * force
          this.y -= (dy / distance) * force
        }

        // Return to original position
        this.x += (this.originalX - this.x) * 0.02
        this.y += (this.originalY - this.y) * 0.02

        // Add some random movement
        this.x += Math.sin(this.angle) * this.force
        this.y += Math.cos(this.angle) * this.force

        // Update opacity based on position
        this.opacity = Math.min(Math.max(0.2, 1 - distance / maxForce), 0.8)
        this.color = `hsla(${this.hue}, 70%, 50%, ${this.opacity})`
      }

      draw() {
        ctx!.fillStyle = this.color
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.7
            const gradient = ctx!.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            )
            gradient.addColorStop(0, `hsla(${particles[i].hue}, 80%, 50%, ${opacity})`)
            gradient.addColorStop(1, `hsla(${particles[j].hue}, 80%, 50%, ${opacity})`)

            ctx!.strokeStyle = gradient
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (ctx) {
        // Create a slightly transparent background to create trail effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(0, 0, canvas?.width || 0, canvas?.height || 0)
      }
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      drawConnections()
      frame++
      
      requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [lightMode])

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-white via-blue-50 to-indigo-50" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" style={{ opacity: 0.8 }} />
    </>
  )
}

