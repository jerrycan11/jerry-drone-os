/**
 * Test Fixtures: Waypoints
 * 
 * Pre-defined waypoint data for navigation testing.
 */

export interface Waypoint {
  id: string;
  x: number;
  y: number;
  z: number;
  speed?: number;
  holdTime?: number;
  action?: string;
}

/**
 * Simple square patrol pattern.
 */
export const SQUARE_PATROL: Waypoint[] = [
  { id: 'wp-1', x: 0, y: 0, z: 10 },
  { id: 'wp-2', x: 100, y: 0, z: 10 },
  { id: 'wp-3', x: 100, y: 100, z: 10 },
  { id: 'wp-4', x: 0, y: 100, z: 10 },
  { id: 'wp-5', x: 0, y: 0, z: 10, action: 'LAND' }
];

/**
 * Survey grid pattern with altitude changes.
 */
export const SURVEY_GRID: Waypoint[] = [
  { id: 'survey-1', x: 0, y: 0, z: 20, speed: 5 },
  { id: 'survey-2', x: 50, y: 0, z: 20, speed: 5 },
  { id: 'survey-3', x: 50, y: 10, z: 20, speed: 2 },
  { id: 'survey-4', x: 0, y: 10, z: 20, speed: 5 },
  { id: 'survey-5', x: 0, y: 20, z: 20, speed: 2 },
  { id: 'survey-6', x: 50, y: 20, z: 20, speed: 5 },
  { id: 'survey-7', x: 50, y: 30, z: 20, speed: 2 },
  { id: 'survey-8', x: 0, y: 30, z: 20, speed: 5 },
  { id: 'survey-home', x: 0, y: 0, z: 5, action: 'LAND' }
];

/**
 * Inspection mission with hold points.
 */
export const INSPECTION_MISSION: Waypoint[] = [
  { id: 'inspect-1', x: 0, y: 0, z: 5 },
  { id: 'inspect-2', x: 10, y: 0, z: 15, holdTime: 5000, action: 'PHOTO' },
  { id: 'inspect-3', x: 20, y: 0, z: 15, holdTime: 5000, action: 'PHOTO' },
  { id: 'inspect-4', x: 30, y: 0, z: 15, holdTime: 5000, action: 'PHOTO' },
  { id: 'inspect-home', x: 0, y: 0, z: 5, action: 'LAND' }
];

/**
 * Geofence test waypoints - some inside, some outside bounds.
 */
export const GEOFENCE_TEST_WAYPOINTS = {
  inside: [
    { id: 'inside-1', x: 10, y: 10, z: 10 },
    { id: 'inside-2', x: 40, y: 40, z: 20 },
    { id: 'inside-3', x: 25, y: 25, z: 15 }
  ],
  outside: [
    { id: 'outside-1', x: -10, y: 10, z: 10 },
    { id: 'outside-2', x: 60, y: 10, z: 10 },
    { id: 'outside-3', x: 10, y: 60, z: 10 }
  ],
  boundary: { minX: 0, maxX: 50, minY: 0, maxY: 50 }
};

/**
 * Creates a circular pattern of waypoints.
 */
export function createCircularPattern(
  centerX: number,
  centerY: number,
  radius: number,
  altitude: number,
  pointCount: number = 8
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  
  for (let i = 0; i < pointCount; i++) {
    const angle = (2 * Math.PI * i) / pointCount;
    waypoints.push({
      id: `circle-${i + 1}`,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      z: altitude
    });
  }
  
  // Return to start
  waypoints.push({ ...waypoints[0], id: 'circle-home' });
  
  return waypoints;
}

/**
 * Creates a lawn-mower pattern for area coverage.
 */
export function createLawnmowerPattern(
  startX: number,
  startY: number,
  width: number,
  height: number,
  lineSpacing: number,
  altitude: number
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  let id = 1;
  let direction = 1; // 1 = right, -1 = left
  
  for (let y = startY; y <= startY + height; y += lineSpacing) {
    if (direction === 1) {
      waypoints.push({ id: `lawn-${id++}`, x: startX, y, z: altitude });
      waypoints.push({ id: `lawn-${id++}`, x: startX + width, y, z: altitude });
    } else {
      waypoints.push({ id: `lawn-${id++}`, x: startX + width, y, z: altitude });
      waypoints.push({ id: `lawn-${id++}`, x: startX, y, z: altitude });
    }
    direction *= -1;
  }
  
  // Return to origin
  waypoints.push({ id: 'lawn-home', x: startX, y: startY, z: altitude, action: 'LAND' });
  
  return waypoints;
}
