import { toast } from 'react-toastify';

//===========validate output
export const notificationMessage = (message, type = 'success') => {
  const options = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    style: {
      backgroundColor:
        type === 'success'
          ? 'green'
          : type === 'error'
            ? 'red'
            : type === 'info'
              ? 'blue'
              : type === 'warning'
                ? 'yellow'
                : '#ffffff',
    },
  };

  return type === 'success'
    ? toast.success(message, options)
    : type === 'error'
      ? toast.error(message, options)
      : type === 'info'
        ? toast.info(message, options)
        : toast.warning(message, options);
};