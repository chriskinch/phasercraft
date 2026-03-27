import type Player from '@entities/Player/Player';
import type Enemy from '@entities/Enemy/Enemy';
import type { AssignResourceType } from '@entities/Resources/AssignResource';

/**
 * Interface for entities that can cast spells (Player or Enemy)
 * Provides the minimum required properties for spell casting
 */
export interface SpellCaster {
  resource: AssignResourceType;
  isCritical(): boolean;
  clearLastPrimedSpell?: () => void;
  x: number;
  y: number;
  health: AssignResourceType;
}

/**
 * Interface for entities that can be damaged (have health)
 */
export interface Damageable {
  health: AssignResourceType;
  x: number;
  y: number;
}

/**
 * Interface for entities that can be healed
 */
export interface Healable {
  health: AssignResourceType;
  x: number;
  y: number;
}

/**
 * Interface for entities with physics bodies (for movement/collision spells)
 */
export interface PhysicsEntity {
  body: Phaser.Physics.Arcade.Body;
  x: number;
  y: number;
}

/**
 * Type guard to check if a target is damageable
 */
export function isDamageable(target: unknown): target is Damageable {
  return (
    target !== null &&
    typeof target === 'object' &&
    'health' in target &&
    'x' in target &&
    'y' in target
  );
}

/**
 * Type guard to check if a target is healable
 */
export function isHealable(target: unknown): target is Healable {
  return isDamageable(target); // Same requirements for now
}

/**
 * Type guard to check if a target has a physics body
 */
export function hasPhysicsBody(target: unknown): target is PhysicsEntity {
  return (
    target !== null &&
    typeof target === 'object' &&
    'body' in target &&
    'x' in target &&
    'y' in target
  );
}

/**
 * Type guard to check if a target is a Player
 */
export function isPlayer(target: unknown): target is Player {
  return (
    target !== null &&
    typeof target === 'object' &&
    'name' in target &&
    (target as { name: string }).name === 'player'
  );
}

/**
 * Type guard to check if a target is an Enemy
 */
export function isEnemy(target: unknown): target is Enemy {
  return (
    target !== null &&
    typeof target === 'object' &&
    'monster' in target &&
    'alive' in target
  );
}

/**
 * Type guard to check if target has position coordinates
 */
export function hasPosition(target: unknown): target is { x: number; y: number } {
  return (
    target !== null &&
    typeof target === 'object' &&
    'x' in target &&
    'y' in target &&
    typeof (target as { x: unknown }).x === 'number' &&
    typeof (target as { y: unknown }).y === 'number'
  );
}
