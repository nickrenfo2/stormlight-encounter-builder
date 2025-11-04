import type {Enemy} from "../types.ts";
import * as _ from "lodash";


const threatBase = {
  Minion: .5,
  Rival: 1,
  Boss: 4,
}

export function getThreat(partyTier: number, enemy: Enemy): number {
  console.log('partyTier:', partyTier);
  console.log('enemy:', enemy);
  const tierDelta = enemy.tier - partyTier;
  const threatMult = Math.pow(2, tierDelta);
  return threatBase[enemy.type] * threatMult;
}

export function getTotalThreat(partyTier: number, enemies: Enemy[]): number {
  return _.sum(_.map(enemies, (enemy: Enemy) => getThreat(partyTier, enemy)))
}


export type ThreatLevel = 'easy' | 'medium' | 'hard';

export function getCurrentThreatLevel(partySize: number, totalThreat: number): ThreatLevel {
  if (totalThreat <= partySize * .5) {
    return 'easy';
  } else if (totalThreat >= partySize * 1.5) {
    return 'hard';
  }
  return 'medium';
}