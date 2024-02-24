import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import { Alert, Box, Button, Chip, Divider } from "@mui/material";

import useLoginModalStore from "@store/loginModal";

import useWalletOdooLogin from "@hooks/useWalletOdooLogin";

import LoginForm from "./LoginForm";
import Modal from "./Modal";

export default function LoginModal() {
  const { handleWalletOdooLogin } = useWalletOdooLogin();

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
    // @ts-expect-error Object literal may only specify known properties, and 'onConnect' does not exist in type 'UseAccountParameters<Config>'
    onConnect({ address, isReconnected }) {
      if (!isReconnected && address) {
        setIsReadyToSign(true);
      }
    },
  });

  const handleSignInClick = async () => {
    await handleWalletOdooLogin();
    handleModalClose();
  };

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <>
        {readyToSign ? (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Your wallet is connected. Log in to Odoo by signing a message with your wallet.
            </Alert>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button focusRipple variant="contained" onClick={handleSignInClick}>
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
