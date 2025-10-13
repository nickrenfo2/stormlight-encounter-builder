
export interface Enemy {
  type: EnemyType,
  tier: number,
}

export type EnemyType = 'Minion' | 'Rival' | 'Boss'
