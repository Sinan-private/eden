import {observer} from "mobx-react";
import {Box} from "@mui/material";
import {Card} from "./Card.ts";

export const PlayerManager = observer(() => {
  const onClick = () => {
  }
  // trade([{key: 'behemoth_hp', max: 20}], [{key: 'behemoth_acid', value: 100}], 10).tradeIfPossible()
  return (
    <Box p={2}>
      <Card>
      Player main
      <button onClick={onClick}>test level up</button>
      </Card>
    </Box>
  )
})