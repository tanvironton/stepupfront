import Swal from "sweetalert2";

function useSweetAlert() {
  const showAlert = (options) => {
    return Swal.fire({
      ...options,
    });
  };

  const showSuccess = (
    title = "Success!",
    text = "",
    confirmButtonText = "OK"
  ) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonText,
    });
  };

  const showError = (title = "Error!", text = "", confirmButtonText = "OK") => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText,
    });
  };

  const showConfirmation = async (
    title = "Are you sure?",
    text = "You won’t be able to revert this!",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel"
  ) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });
    return result.isConfirmed; // Returns true if confirmed
  };

  return { showAlert, showSuccess, showError, showConfirmation };
}

export default useSweetAlert;
