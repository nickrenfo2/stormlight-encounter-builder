import {
  Box, Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  Grid, IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import {useState} from "react";
import * as _ from "lodash";
import type {Enemy, EnemyType} from "../types.ts";
import {getThreat, getTotalThreat} from "../utils/utils.ts";
import DeleteIcon from "@mui/icons-material/Delete";

// Formula: PC:NPC
// Easy = 2:1, Medium = 1:1, Hard = 2:3
// PC = 1
// Minion = .5, Rival = 1, Boss = 4
// Threat Multiplier: Equal Tier: 1x, Higher Tier: 2xΔ, Lower tier: .5xΔ

export default function CombatEncounterBuilder() {
  const [partySize, setPartySize] = useState<number>(4);
  const [partyTier, setPartyTier] = useState<number>(1);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  const handlePartySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(isNaN(_.toNumber(e.target.value))){
      return;
    }
    setPartySize(_.toNumber(e.target.value));
  }
  const handlePartyTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(isNaN(_.toNumber(e.target.value))){
      return;
    }
    setPartyTier(_.toNumber(e.target.value));
  }

  const handleAddEnemies = (enemy: Enemy) => {
    setEnemies([...enemies, enemy]);
  };

  const handleUpdateEnemies = (newEnemies: Enemy[], change: any) => {
    setEnemies(newEnemies);
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={4}>
          <Typography variant="h4" sx={{marginBottom: 2}}>
            Party:
          </Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="Party Size"
                value={partySize}
                onChange={handlePartySizeChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Party Tier"
                value={partyTier}
                onChange={handlePartyTierChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={3}>
          <Box sx={{textAlign: 'center'}}>
            <Typography variant="h4" sx={{marginBottom: 2}}>Target:</Typography>
          </Box>
          <Grid container sx={{textAlign: 'center'}}>
            <Grid size={4}>Easy: {partySize * .5}</Grid>
            <Grid size={4}>Medium: {partySize}</Grid>
            <Grid size={4}>Hard: {partySize * 1.5}</Grid>
          </Grid>
          <Box sx={{textAlign: 'center'}}>
            <Typography variant="h5">
              {
                getTotalThreat(partyTier, enemies)
              }
            </Typography>
          </Box>
        </Grid>
        <Grid size={5}>
          <Box sx={{textAlign: 'center'}}>
            <Typography variant="h4" sx={{marginBottom: 2}}>Enemies:</Typography>
            <Box sx={{marginBottom: 2}}>
              <CurrentEnemyList enemies={enemies} partyTier={partyTier} onChange={handleUpdateEnemies}/>
            </Box>
            <Box>
              <EnemyAdder onAddEnemy={handleAddEnemies} partyTier={partyTier}/>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

}


interface EnemyAdderProps {
  onAddEnemy: (enemy: Enemy) => void;
}

function EnemyAdder(props: EnemyAdderProps){
  const [enemyType, setEnemyType] = useState<EnemyType>('Rival');
  const [enemyTier, setEnemyTier] = useState<number>(1);

  const handleTypeChange = (e, newType: EnemyType | null) => {
    if(!newType) {
      return;
    }
    setEnemyType(newType);
  }
  const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(_.toNumber(e.target.value))) {
      return;
    }
    setEnemyTier(_.toNumber(e.target.value));
  };

  const handleAdd = () => {
    props.onAddEnemy({
      type: enemyType,
      tier: enemyTier,
    });
  };

  return (
    <Paper sx={{padding:2}}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <ToggleButtonGroup
            value={enemyType}
            exclusive
            onChange={handleTypeChange}
          >
            <ToggleButton value="Minion">Minion</ToggleButton>
            <ToggleButton value="Rival">Rival</ToggleButton>
            <ToggleButton value="Boss">Boss</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid size={12}>
          <TextField
            label="Tier"
            onChange={handleTierChange}
            value={enemyTier}
          />
        </Grid>
        <Grid size={12}>
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

interface CurrentEnemyListProps {
  enemies: Enemy[],
  partyTier: number,
  onChange: (newEnemies: Enemy[], change: any) => void
}

function CurrentEnemyList(props: CurrentEnemyListProps) {
  const {enemies, partyTier} = props;

  const handleDelete = (ind) => () => {
    const removed = enemies[ind];
    const newList = [..._.slice(enemies, 0, ind), ..._.slice(enemies, ind + 1)];
    props.onChange(newList, {changeType: "Delete", item: removed});
  };

  return (
    <Paper sx={{padding: 2}}>
      <List>
        {
          _.map(enemies, (enemy: Enemy, idx) => {
            return (
              <ListItem key={idx} secondaryAction={
                <IconButton edge="end" onClick={handleDelete(idx)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText>
                  <Grid container>
                    <Grid size={2}>
                      T{enemy.tier}
                    </Grid>
                    <Grid size={6}>
                      {enemy.type}
                    </Grid>
                    <Grid size={4}>
                      {getThreat(partyTier, enemy)}
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            )
          })
        }
      </List>
    </Paper>
  )
}