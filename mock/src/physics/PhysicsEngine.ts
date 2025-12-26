import { IVector3 } from '@drone-os/shared';

export class MockPhysicsEngine {
  private position: IVector3 = { x: 0, y: 0, z: 0 };
  private velocity: IVector3 = { x: 0, y: 0, z: 0 };
  private acceleration: IVector3 = { x: 0, y: 0, z: 0 };
  private lastTick = Date.now();
  
  // Phase 21: Obstacles for Lidar
  private obstacles: { minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number }[] = [];
  
  private readonly GRAVITY = 9.81;
  private readonly DRAG_COEFFICIENT = 0.1;
  private mass: number = 1.0;

  constructor(mass: number = 1.0) {
    this.mass = mass;
  }

  public addObstacle(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): void {
      this.obstacles.push({ minX, maxX, minY, maxY, minZ, maxZ });
  }

  // Simplified Raycast. Returns distance to first hit or -1.
  public raycast(origin: IVector3, direction: IVector3, maxRange: number): number {
      // Normalize direction (assuming it is roughly normalized or we do it here)
      // For simplicity, we just check if the ray intersects any AABB.
      // Ray-AABB intersection algorithm (Slopes).
      
      let closestDist = maxRange + 1;
      let hit = false;
      
      // Normalize Dir
      const mag = Math.sqrt(direction.x*direction.x + direction.y*direction.y + direction.z*direction.z);
      const dx = direction.x / mag;
      const dy = direction.y / mag;
      const dz = direction.z / mag;

      for (const obs of this.obstacles) {
          // Slab method
          let tmin = -Infinity, tmax = Infinity;

          const checkAxis = (originVal: number, dirVal: number, boxMin: number, boxMax: number) => {
              if (Math.abs(dirVal) < 1e-6) {
                  // Ray is parallel to slab. No hit if origin not inside.
                  if (originVal < boxMin || originVal > boxMax) return { t0: -Infinity, t1: -Infinity, parallelOut: true }; // Parallel and OUT
                  return { t0: -Infinity, t1: Infinity, parallelOut: false };
              }
              const t1 = (boxMin - originVal) / dirVal;
              const t2 = (boxMax - originVal) / dirVal;
              return { t0: Math.min(t1, t2), t1: Math.max(t1, t2), parallelOut: false };
          };

          const xCheck = checkAxis(origin.x, dx, obs.minX, obs.maxX);
          if (xCheck.parallelOut) continue;
          tmin = Math.max(tmin, xCheck.t0);
          tmax = Math.min(tmax, xCheck.t1);

          const yCheck = checkAxis(origin.y, dy, obs.minY, obs.maxY);
          if (yCheck.parallelOut) continue;
          tmin = Math.max(tmin, yCheck.t0);
          tmax = Math.min(tmax, yCheck.t1);
          
          const zCheck = checkAxis(origin.z, dz, obs.minZ, obs.maxZ);
          if (zCheck.parallelOut) continue;
          tmin = Math.max(tmin, zCheck.t0);
          tmax = Math.min(tmax, zCheck.t1);

          if (tmax >= tmin && tmin >= 0 && tmin < closestDist) {
              closestDist = tmin;
              hit = true;
          }
      }

      return hit ? closestDist : -1;
  }

  public update(deltaTimeSeconds: number, thrustVector: IVector3): void {
    // 1. Calculate gravity force (downward on Z axis, assuming Z is up)
    // Adjust frame of reference if needed, assuming simple Local ENU (East-North-Up)
    const gravityForce: IVector3 = { x: 0, y: 0, z: -this.GRAVITY * this.mass };

    // 2. Drag force (simplified: -C * v^2 * direction)
    const speedSquared = this.velocity.x**2 + this.velocity.y**2 + this.velocity.z**2;
    const speed = Math.sqrt(speedSquared);
    const dragMagnitude = this.DRAG_COEFFICIENT * speedSquared;
    
    const dragForce: IVector3 = {
      x: speed > 0 ? -(this.velocity.x / speed) * dragMagnitude : 0,
      y: speed > 0 ? -(this.velocity.y / speed) * dragMagnitude : 0,
      z: speed > 0 ? -(this.velocity.z / speed) * dragMagnitude : 0,
    };

    // 3. Total Force
    // Thrust vector is assumed to be already rotated to world frame by the caller (or we can handle attitude here later)
    const netForce: IVector3 = {
      x: thrustVector.x + gravityForce.x + dragForce.x,
      y: thrustVector.y + gravityForce.y + dragForce.y,
      z: thrustVector.z + gravityForce.z + dragForce.z,
    };

    // 4. Update Acceleration (F = ma => a = F/m)
    this.acceleration = {
      x: netForce.x / this.mass,
      y: netForce.y / this.mass,
      z: netForce.z / this.mass,
    };

    // 5. Update Velocity (v = v0 + at)
    this.velocity.x += this.acceleration.x * deltaTimeSeconds;
    this.velocity.y += this.acceleration.y * deltaTimeSeconds;
    this.velocity.z += this.acceleration.z * deltaTimeSeconds;

    // 6. Update Position (p = p0 + vt)
    // Simple Euler integration
    this.position.x += this.velocity.x * deltaTimeSeconds;
    this.position.y += this.velocity.y * deltaTimeSeconds;
    this.position.z += this.velocity.z * deltaTimeSeconds;
    
    // Ground collision constraint
    if (this.position.z < 0) {
        this.position.z = 0;
        this.velocity.z = 0;
        this.acceleration.z = 0;
    }
  }

  public getPosition(): IVector3 { return { ...this.position }; }
  public getVelocity(): IVector3 { return { ...this.velocity }; }
  public getAcceleration(): IVector3 { return { ...this.acceleration }; }
}
