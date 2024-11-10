import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from '@mui/material'

const styledDialog = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '344px',
  margin: 0,
  borderRadius: 'var(--border-radius)',
  padding: '16px',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
}

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
      aria-labelledby={title}
      sx={{ '.MuiPaper-root': { ...styledDialog } }}
    >
      <DialogTitle
        id="alert-dialog-title"
        padding="0 0 8px 0!important"
        fontWeight="700"
        component="h3"
        variant="h5"
      >
        {title}
      </DialogTitle>
      <DialogActions>
        {isLoading ? (
          <Button variant="contained" autoFocus disabled>
            <CircularProgress size="24px" />
          </Button>
        ) : (
          <Button variant="contained" onClick={handleYesClick} autoFocus>
            Delete
          </Button>
        )}
        <Button variant="outlined" onClick={handleNoClick}>
          Cancel
        </Button>
      </DialogActions>
    </MuiDialog>
  )
}
