const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

async function sign_in() {
    const emailInput = document.forms["signInForm"]["emailInput"].value
    const passwordInput = document.forms["signInForm"]["passwordInput"].value

    await sign_in_mutation(emailInput, passwordInput)
        .then(value => {
            if (value === "UNAUTHORIZED") {
                console.log("oupsi")
                window.location.replace("/pizzaFIST/login.html")
            }
            if (value.signIn.status === "ok") {
                console.log(value)
                window.location.replace("/pizzaFIST/index.html")
            }
        })

}

function sign_up() {
    const firstNameInput = document.forms["signUpForm"]["firstNameInput"].value
    const lastNameInput = document.forms["signUpForm"]["lastNameInput"].value
    const emailInput = document.forms["signUpForm"]["emailInput"].value
    const passwordInput = document.forms["signUpForm"]["passwordInput"].value

    create_account_mutation(firstNameInput, lastNameInput, emailInput, passwordInput)

    console.log("aurevoir")
}

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

    return result.data
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

    console.log(result.data)
    if(result.data !== null) {
        return result.data
    } else {
        return "UNAUTHORIZED"
    }


}