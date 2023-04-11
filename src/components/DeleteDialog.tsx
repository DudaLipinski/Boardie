import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
} from '@mui/material'

interface Props {
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void
  handleDelete: () => void
  title: string
}

export const DeleteDialog = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDelete,
  title,
}: Props) => {
  const handleNoClick = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen)
  }

  const handleYesClick = () => {
    handleDelete()
  }

  return (
    <MuiDialog
      open={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ width: 'inherit' }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button variant="outlined" onClick={handleNoClick}>
          No
        </Button>
        <Button variant="contained" onClick={handleYesClick} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </MuiDialog>
  )
}
