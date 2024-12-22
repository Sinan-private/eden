import {useAdmin} from "../../Resource/Admin/admin.context.ts";
import {Box, IconButton} from "@mui/material";
import Close from "@mui/icons-material/Close";
import {IconPickerModal} from "./IconPicker/IconPickerModal.tsx";

type AdminGenericsProps = {
  onClose(): void;
  resourceId: string;
  enableKeyEdit?: boolean
}
export const AdminGenerics = ({onClose, resourceId, enableKeyEdit}: AdminGenericsProps) => {
  const {
    openIconPicker,
    handleCloseIconPicker,
    filterUsed,
    onToggleFilter,
    getActions
  } = useAdmin()
  const {
    onSelectIcon,
  } = getActions(resourceId, enableKeyEdit)
  return (
    <>
      {!!onClose &&
        <Box sx={{position: 'absolute', top: 0, right: 0}}>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="inherit"/>
          </IconButton>
        </Box>
      }
      <IconPickerModal
        openIconPicker={openIconPicker}
        handleCloseIconPicker={handleCloseIconPicker}
        filterUsed={filterUsed}
        onToggleFilter={onToggleFilter}
        onSelectIcon={onSelectIcon}
      />
    </>
  )
}
