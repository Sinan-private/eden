import {observer} from "mobx-react";
import {Box} from "@/components/ui";

export const EarthContent = observer(() => {
  return (
    <div className="flex justify-end pr-4">
      <Box className="min-w-[240px]" variant="default">
        Earth here
      </Box>
    </div>
  )
})