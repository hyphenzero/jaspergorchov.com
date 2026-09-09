declare module 'three/examples/jsm/modifiers/SubdivisionModifier' {
  import * as THREE from 'three'
  export class SubdivisionModifier {
    constructor(subdivisions?: number)
    modify(geometry: THREE.BufferGeometry): void
  }
}
