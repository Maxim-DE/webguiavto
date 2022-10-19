import ReactDOM from 'react-dom';
import React from "react";
import SnackBar from '.';

const triggerSnackbar = (title, message, messageType, duration) => {
    const validMessageTypes = ['error', 'info', 'warning', 'success'];
    if (!validMessageTypes.includes(messageType)) {
        throw Error("Invalid snackbar message type");
    }
    ReactDOM.render(
        <SnackBar messageType={messageType} timer={duration} title={title} message={message} />,
        document.getElementById('snackbar-fixed-container')
    );
}

export const showErrorMessage = (title, message, duration) => {
    triggerSnackbar(title, message, 'error', duration);
}

export const showInfoMessage = (title, message, duration) => {
    triggerSnackbar(title, message, 'info', duration);
}

export const showSuccessMessage = (title, message, duration) => {
    triggerSnackbar(title, message, 'success', duration);
}

export const showWarningMessage = (title, message, duration) => {
    triggerSnackbar(title, message, 'warning', duration);
}