import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export const ModalCustom = ({ children, btnText, btnClass }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    heigth: 200,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2.5
  };
  

  return (
    <div id='mod'>
      <button className={btnClass} onClick={handleOpen}>{btnText}</button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-desscription"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 250,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {children}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalCustom