import {
  Autocomplete,
  Box, Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  Grid, IconButton,
  List,
  ListItem,
  ListItemText, type Palette, type PaletteColor,
  Paper, Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography, useTheme
} from "@mui/material";
import {type ReactNode, useMemo, useState} from "react";
import * as _ from "lodash";
import type {Enemy, EnemyType} from "../types.ts";
import {getCurrentThreatLevel, getThreat, getTotalThreat} from "../utils/utils.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import {namedEnemies} from "../utils/named-enemies.ts";

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
        {/*Party Column*/}
        <Grid size={12}>

          {/*Party Stats*/}
          <Grid container spacing={2}>
            <Grid container size={6}>
              <Grid size={12}>
                <Typography variant="h4" sx={{marginBottom: 2}}>
                  Party:
                </Typography>
              </Grid>
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
            <Grid size={6}>

              {/*Threat Details*/}
              <Box sx={{marginTop: 2}}>
                <Box sx={{textAlign: 'center'}}>
                  <Typography variant="h5" sx={{marginBottom: 2}}>Threat:</Typography>
                </Box>
                <Grid sx={{textAlign: 'center'}}>
                  <Stack direction="row" spacing={1} sx={{alignItems: 'center', justifyContent: 'center'}}>
                    <ThreatIndicator type={'easy'}>{partySize * .5}</ThreatIndicator>
                    <ThreatIndicator type={'medium'}>{partySize}</ThreatIndicator>
                    <ThreatIndicator type={'hard'}>{partySize * 1.5}</ThreatIndicator>
                  </Stack>
                </Grid>
                <Box sx={{textAlign: 'center'}}>
                    {
                      <ThreatIndicator type={getCurrentThreatLevel(partySize, getTotalThreat(partyTier, enemies))}>
                        <Typography variant="h5">
                          {getTotalThreat(partyTier, enemies)}
                        </Typography>
                      </ThreatIndicator>
                    }
                </Box>
              </Box>
            </Grid>
          </Grid>


        </Grid>

        {/*Add Enemy column*/}
        <Grid size={6}>
          <Box sx={{textAlign: 'center'}}>
            {/*<Typography variant="h4" sx={{marginBottom: 2}}>Add Enemy:</Typography>*/}
            <Box>
              <Typography variant="h4" sx={{marginBottom: 2}}>Generic Enemy:</Typography>
              <EnemyMaker onCreate={handleAddEnemies}/>
            </Box>
            <Box sx={{marginTop: 2}}>
              <Typography variant="h4" sx={{marginBottom: 2}}>Named Enemy:</Typography>
              {/*<NamedEnemyList />*/}
              <NamedEnemyAdder partyTier={partyTier} onAdd={handleAddEnemies}/>
            </Box>
          </Box>
        </Grid>

        {/*Enemies List Column*/}
        <Grid size={6}>
          <Typography variant="h4" sx={{marginBottom: 2}}>Encounter Enemies:</Typography>
          <Box sx={{marginBottom: 2}}>
            <CurrentEnemyList enemies={enemies} partyTier={partyTier} onChange={handleUpdateEnemies}/>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

}

interface ThreatIndicatorProps {
  type: 'easy' | 'medium' | 'hard',
  children: ReactNode
}
function ThreatIndicator(props: ThreatIndicatorProps) {
  const theme = useTheme();
  const paletteMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  };
  // @ts-ignore
  const palette: PaletteColor = theme.palette[paletteMap[props.type]];

  return (
    <Paper sx={{
      padding: 1,
      minWidth:'30px',
      backgroundColor: palette.main,
      color: palette.contrastText}}>
      {props.children}
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
                    <Grid size={4}>
                      {enemy.type}
                    </Grid>
                    <Grid size={4}>
                      {enemy.name || ''}
                    </Grid>
                    <Grid size={2}>
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


interface EnemyAdderProps {
  onCreate: (enemy: Enemy) => void;
}

function EnemyMaker(props: EnemyAdderProps){
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
    props.onCreate({
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

interface  NamedEnemyAdderProps {
  partyTier: number;
  onAdd: (enemy: Enemy) => void;
}
function NamedEnemyAdder(props: NamedEnemyAdderProps) {
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const handleSelection = (selected) => {
    setEnemy(selected);
  };

  return (
    <Paper sx={{padding: 2}}>
      <NamedEnemyList onSelect={handleSelection} />
      {
        enemy && <Box sx={{marginTop: 2}}>
                  <Grid container spacing={2}>
                      <Grid size={2}>
                          T{enemy.tier}
                      </Grid>
                      <Grid size={6}>
                        {enemy.type}
                      </Grid>
                      <Grid size={4}>
                        {getThreat(props.partyTier, enemy)}
                      </Grid>
                      <Grid size={12}>
                        <Button variant="contained" onClick={() => props.onAdd(enemy)}>Add</Button>
                      </Grid>
                  </Grid>
              </Box>
      }
    </Paper>
  )
}

interface NamedEnemyListProps {
  onSelect: (selected: Enemy) => void;
}
function NamedEnemyList(props: NamedEnemyListProps) {
  // const [selected, setSelected] = useState<Enemy>(_.find(namedEnemies, {name: 'Guard'}));
  const [selected, setSelected] = useState<Enemy | null>(null);

  const handleSelection = (e, newVal) => {
    if(!newVal) {
      return;
    }
    setSelected(newVal);
    props.onSelect(newVal);
  }
  return (
    <Box>
      <Autocomplete
        autoHighlight
        renderInput={(params) => <TextField {...params} label="Enemy" />}
        options={namedEnemies}
        value={selected}
        onChange={handleSelection}
        getOptionLabel={(option) => option.name || ''}
      />
    </Box>
  )
}