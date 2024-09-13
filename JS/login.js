const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
let user;

////////////////////////////////// TRIGGER ON CLICK ANIMATION ////////////////////////////////////////////////////////

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

//////////////////////////////////// ALERT BOX LIBRARY //////////////////////////////////////////////////////

function errorAlert(message) {
    return Swal.fire({
        title: 'Petit problème',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}

function loadingAlert(message) {
    return Swal.fire({
        title: message,
        html: 'Please wait',
        backdrop: `
    rgba(0,0,123,0.4)
    url("https://sweetalert2.github.io/images/nyan-cat.gif")
    left top
    no-repeat
  `,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        },
    });
}

function successAlert(message) {
    return Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 4500,
        showConfirmButton: false
    })
}


///////////////////////////////////// MANAGE REQUESTS RESPONSES /////////////////////////////////////////////////////

async function sign_in() {
    const emailInput = document.forms["signInForm"]["emailInput"].value
    const passwordInput = document.forms["signInForm"]["passwordInput"].value

    try {

        const loading = loadingAlert('Connexion à ton compte en cours...')

        const value = await sign_in_mutation(emailInput, passwordInput)

        loading.close()

        if (value === "UNAUTHORIZED") {
            errorAlert('Ton email ou ton mot de passe est erroné !')
        } else if (value.signIn.status === "ok") {
            successAlert('Connexion à ton compte réussie')
                .then(() => {
                        document.cookie = 'refreshToken=' + value.signIn.refreshToken;
                        document.cookie = 'user=' + emailInput;
                        window.location.replace("/pizzaFIST/totp.html")
                    }
                )
        }
    } catch {

    }

}

async function sign_up() {
    const firstNameInput = document.forms["signUpForm"]["firstNameInput"].value
    const lastNameInput = document.forms["signUpForm"]["lastNameInput"].value
    const emailInput = document.forms["signUpForm"]["emailInput"].value
    const passwordInput = document.forms["signUpForm"]["passwordInput"].value


    try {

        const loading = loadingAlert('Création de compte en cours...')

        const value = await create_account_mutation(firstNameInput, lastNameInput, emailInput, passwordInput)

        loading.close()

        if (value === "ERROR") {
            errorAlert('Il y a un souci dans les champs que tu as remplis')
        } else if (value.createAccount.status === "ok") {
            successAlert('Création de ton compte réussi, tu vas pouvoir te connecter')
                .then(() => {
                        window.location.replace("/pizzaFIST/login.html")
                    }
                )
        }

    } catch {

    }

}

//////////////////////////////////////// REQUESTS GRAPHQL //////////////////////////////////////////////////

async function create_account_mutation(firstName, lastName, email, password) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation createAccount($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
                    createAccount(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
                       status
                    }
                }`,
            operationName: "createAccount",
            variables: {
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName": lastName
            }
        })
    })
    let result = await results.json();

    if (result.data.createAccount !== null) {
        return result.data
    } else {
        return "ERROR"
    }
}

async function sign_in_mutation(email, password) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation signIn($email: String!, $password: String!) {
                    signIn(email: $email, password: $password) {
                       status
                       refreshToken
                    }
                }`,
            operationName: "signIn",
            variables: {
                "email": email,
                "password": password
            }
        })
    })

    let result = await results.json();

    if (result.data !== null) {
        return result.data
    } else {
        return "UNAUTHORIZED"
    }
}