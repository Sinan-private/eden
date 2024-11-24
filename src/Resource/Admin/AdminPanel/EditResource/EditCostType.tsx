import {ReactNode} from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {IconButton, Paper, Stack, Typography} from "@mui/material";
import {Cost} from "../Cost.tsx";
import {themeColors} from "../../../assets/colors.ts";
import {ResourceCostUpdate} from "../../../genericTypes.ts";
import {ResourceKeys} from "../../../specificTypes.ts";
import {OnSetCost} from "./types.ts";

type EditCostTypeProps = {
  onDelete(): void;
  onRemove(changeKey: 'give' | 'gain' | '', resourceKey: ResourceKeys): void;
  object: ResourceCostUpdate<ResourceKeys> | null;
  onSet: OnSetCost;
  onAdd: OnSetCost;
}

export const EditCostType = (
  {
    onDelete,
    onRemove,
    object,
    onSet,
    onAdd
  }: EditCostTypeProps
) => (
  <StyledCostBox title="Cost" onDelete={onDelete}>
    <Cost
      onRemoveCost={onRemove}
      cost={object}
      onSetCost={onSet}
      onAddCost={onAdd}
    />
  </StyledCostBox>
)

type StyledCostBoxProps = {
  children: ReactNode;
  title: string;
  onDelete(): void;
}

const StyledCostBox = ({children, title, onDelete}: StyledCostBoxProps) => (
  <Paper sx={{
    mx: 2,
    mt: 2,
    p: 1,
    pl: 3,
    backgroundColor: themeColors.color1,
    borderRadius: 8,
    display: 'flex',
    position: 'relative'
  }}>
    <Stack direction="row" spacing={2} sx={{alignSelf: 'baseline'}}>

      <IconButton size="small" onClick={onDelete}>
        <DeleteOutlineIcon fontSize="inherit" />
      </IconButton>
      <Typography variant="h6" fontWeight="bold" color={themeColors.color5} sx={{mr: 2, width: 120}} align="left">
        {title}
      </Typography>
    </Stack>
    <Stack direction="row" spacing={2} alignItems="center">
      {children}
    </Stack>
  </Paper>
)
