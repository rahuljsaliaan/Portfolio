import * as THREE from 'three'

// One shared soft-round sprite so points render as circles, not the default square.
let circleTexture: THREE.CanvasTexture | null = null

export function getCircleTexture() {
  if (circleTexture) return circleTexture
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  circleTexture = new THREE.CanvasTexture(canvas)
  return circleTexture
}
