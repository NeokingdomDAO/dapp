import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import { Alert, Box, Button, Chip, Divider } from "@mui/material";

import useLoginModalStore from "@store/loginModal";

import useLogout from "@hooks/useLogout";
import useWalletOdooLogin from "@hooks/useWalletOdooLogin";

import LoginForm from "./LoginForm";
import Modal from "./Modal";

export default function LoginModal() {
  const { handleWalletOdooLogin } = useWalletOdooLogin();
  const { logout } = useLogout();

  const { modalOpen, handleModalClose, readyToSign, setIsReadyToSign } = useLoginModalStore(
    (state) => ({
      modalOpen: state.isLoginModalOpen,
      handleModalOpen: state.handleOpenLoginModalFromLink,
      handleModalClose: state.closeLoginModal,
      readyToSign: state.isReadyToSign,
      setIsReadyToSign: state.setIsReadyToSign,
    }),
    shallow,
  );

  useAccount({
    onConnect({ address, isReconnected }) {
      if (!isReconnected && address) {
        setIsReadyToSign(true);
      }
    },
    onDisconnect() {
      logout(true);
    },
  });

  const handleClick = async () => {
    await handleWalletOdooLogin();
    handleModalClose();
  };

  return (
    <Modal open={modalOpen} setOpen={handleModalClose}>
      <>
        {readyToSign ? (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              As your wallet is connected, you can now sign in to odoo signing a message with it.
            </Alert>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button focusRipple variant="contained" onClick={() => handleClick()}>
                Sign in
              </Button>
              <Divider sx={{ pt: 4, mb: 4 }}>
                <Chip label="Or" />
              </Divider>
              <Button variant="outlined" onClick={() => setIsReadyToSign(false)}>
                Go back
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ pt: 3 }}>
            <LoginForm onLoggedIn={handleModalClose} />
          </Box>
        )}
      </>
    </Modal>
  );
}