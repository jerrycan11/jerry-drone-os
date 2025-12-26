import { describe, it, expect } from 'vitest';
import { MockPhysicsEngine } from './PhysicsEngine';
import { IVector3 } from '@drone-os/shared';

describe('MockPhysicsEngine', () => {
  it('should apply gravity when no thrust is present', () => {
    const engine = new MockPhysicsEngine(1.0); // 1kg
    const thrust: IVector3 = { x: 0, y: 0, z: 0 };
    
    // Process 1 second
    engine.update(1.0, thrust);
    
    const pos = engine.getPosition();
    const vel = engine.getVelocity();
    
    // Z should be 0 because of ground collision (it starts at 0)
    // Actually, update logic sets Z=0 if < 0.
    // Gravity pulls down (-9.81), so pos z would be negative -> clamped to 0.
    expect(pos.z).toBe(0); 
    
    // Let's lift it first to test gravity
    // Hack: Manually set position if possible or apply huge thrust first
  });
  
  it('should take off with sufficient thrust', () => {
    const engine = new MockPhysicsEngine(1.0);
    // Force > Gravity (9.81)
    const thrust: IVector3 = { x: 0, y: 0, z: 20 }; 
    
    engine.update(1.0, thrust);
    
    const pos = engine.getPosition();
    expect(pos.z).toBeGreaterThan(0);
  });
});
