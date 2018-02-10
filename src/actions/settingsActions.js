

export const getUserConnection = (connectionType) => {
    return {
        type: 'APP_CONNECTION',
        payload: connectionType
    }
}