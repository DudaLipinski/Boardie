import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from '@mui/material'

interface Props {
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void
  handleDelete: () => void
  isLoading: boolean
  title: string
}

export const DeleteDialog = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDelete,
  isLoading,
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
          Cancel
        </Button>
        {isLoading ? (
          <Button variant="contained" autoFocus disabled>
            <CircularProgress size="24px" />
          </Button>
        ) : (
          <Button variant="contained" onClick={handleYesClick} autoFocus>
            Confirm
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  )
}
