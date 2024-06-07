import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";

export const useSignOut = () => {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const signOut = () => {
    confirm({ description: "Are you sure you want to sign out?" }).then(() => {
      // Clear user session on the server side

      // Clear user session on the client side
      localStorage.removeItem("token");

      enqueueSnackbar("Logged out successfully!", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });

      // Wait 3 seconds, then redirect to the sign in page
      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);
    });
  };

  return signOut;
};
