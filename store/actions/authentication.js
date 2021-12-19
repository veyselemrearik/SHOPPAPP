export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCg3ysJ6JzZjqeB32sv-C36OSzGODZTfJ4',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Hata oluştu!'
            if (errorId === 'EMAIL_EXISTS') {
                message = 'Girmiş olduğunuz email ile kayıt bulunmakta'
            }
            throw new Error(message)
        }
        const resData = await response.json();
        console.log(resData);
        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId })
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCg3ysJ6JzZjqeB32sv-C36OSzGODZTfJ4',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Hata oluştu!'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Böyle bir email bulunamadı!'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'Yanlış şifre girdiniz.'
            }
            throw new Error(message)
        }
        const resData = await response.json();
        console.log(resData);
        dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId })
    }
}