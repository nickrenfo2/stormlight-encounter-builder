
export interface Enemy {
  name?: string;
  type: EnemyType,
  tier: number,
}

export type EnemyType = 'Minion' | 'Rival' | 'Boss'
