import jwt_decode from "jwt-decode";


const API = {
    login: async (email, password, err) => {
        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/login`, {
            method: "POST",
            body: formData,
        });

    },

    isLoggedIn: async () => {
        let token = window.localStorage.getItem('accessToken');
        if (token) {
            console.log(token);
            let decoded = jwt_decode(token);
            console.log(decoded);

            return (Date.now() / 1000) < decoded['exp'];
        }
        else {
            return false;
        }

    }


}

export default API;