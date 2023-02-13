import jwt_decode from "jwt-decode";


const API = {
    login: async (email, password) => {
        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/login`, {
            method: "POST",
            body: formData,
        });

    },
    signUp: async (name, email, password) => {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/signup`, {
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

    },

    logOut: () => {
      window.localStorage.removeItem("accessToken");
    },

    addTurbine: async (turbineName, turbineLatitude, turbineLongitude, turbineHeight, turbineModel) => {

        let token = window.localStorage.getItem('accessToken');
        let headers = new Headers();
        let formData = new FormData();
        formData.append('turbineName', turbineName);
        formData.append('turbineLatitude', turbineLatitude);
        formData.append('turbineLongitude', turbineLongitude);
        formData.append('turbineHeight', turbineHeight);
        formData.append('turbineModel', turbineModel);

        headers.append("Authorization", `Bearer ${token}`)
        console.log(formData)
        return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/add_turbine_to_profile`, {headers, method:'POST', body:formData})


    },

    getUserTurbines: async () => {
        let token = window.localStorage.getItem('accessToken');
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`)
        return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/get_user_turbines`, {headers, method:'GET'})
    },

    getTurbineModels: async () => {
      return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines`)
        .then(data => data.json())
        .then(items => items.map(opt => ({ label: opt.display_name, value: opt.modelId })));
    },

    predictCustomTurbine: async (formData) => {
      return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbine_prediction`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
    },

    predictSavedTurbine: async (formData) => {
      let token = window.localStorage.getItem('accessToken');
      return fetch(`${process.env.REACT_APP_BACKEND}/api/v1/saved_turbine_prediction`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
    },
}

export default API;
