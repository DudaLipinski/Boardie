import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
} from '@mui/material'

interface Props {
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void
  handleDeleteMatch: () => void
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}

export const DeleteDialog = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteMatch,
  setAnchorEl,
}: Props) => {
  const handleNoClick = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen)
    setAnchorEl(null)
  }

  const handleYesClick = () => {
    handleDeleteMatch()
    setAnchorEl(null)
  }

  return (
    <MuiDialog
      open={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ width: 'inherit' }}
    >
      <DialogTitle id="alert-dialog-title">{'Delete this match?'}</DialogTitle>
      <DialogActions>
        <Button onClick={handleNoClick}>No</Button>
        <Button onClick={handleYesClick} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </MuiDialog>
  )
}
