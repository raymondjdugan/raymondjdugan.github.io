'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2022-01-06T23:36:17.929Z',
        '2022-01-07T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// Creating the date for each deposit/Withdrawal
const formatMovementDate = function (date, locale) {
    // Calculating how many days have passed since current day
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

    // Calling the calDayPassed function and saving the result
    const daysPassed = calcDaysPassed(date, new Date());

    // Checking conditions of daysPassed and returning output
    if (daysPassed === 0) return 'Today'
    if (daysPassed === 1) return 'Yesterday'
    if (daysPassed <= 7) return `${daysPassed} days ago`
    return new Intl.DateTimeFormat(locale).format(date);
}

// Formatting currency
const formatCurrency = function (account, currency) {
    // Returning the formatted currency dependent on the current account and locale
    return new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(currency)
}

// Displaying the individual deposits/withdrawals
const displayMovements = function (account, sort = false) {
    // Setting the html to blank
    containerMovements.innerHTML = '';
    // Checking if the movements have been sorted and sorting or unsorting them
    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

    movs.forEach(function (mov, i) {

        // Checking to see if it is a withdrawal or deposit
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        // Setting the date
        const date = new Date(account.movementsDates[i]);
        // Setting the display date from the return of formatMovementDate
        const displayDate = formatMovementDate(date, account.locale);

        // Setting the format of currency from the return of formatCurrency
        const currency = formatCurrency(account, mov);

        // Setting up the html display
        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${currency}</div>
        </div>`;

        // Inserting the html into the browser
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function (account) {
    // Calculating the overall balance of the account
    account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

    // Displaying the balance in the browser
    labelBalance.textContent = formatCurrency(account, account.balance);
};

const calcDisplaySummary = function (acc) {
    //Calculating the deposits
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    // Displaying the deposits in the browser
    labelSumIn.textContent = formatCurrency(acc, incomes);

    //Calculating the withdrawals
    const withdrawals = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + Math.abs(mov), 0);

    // Displaying the withdrawals in the browser
    labelSumOut.textContent = formatCurrency(acc, withdrawals);

    //Calculating interest
    const interest = acc.movements
        .filter(deposit => deposit > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);

    // Displaying the interest in the browser
    labelSumInterest.textContent = formatCurrency(acc, interest);
};

// Creating the Login Usernames
const createUsernames = function (accounts) {
    // Iterating each account
    accounts.forEach(function (account) {
        // Setting a new object property 'username'
        account.username = account.owner
            .toLowerCase()
            .split(' ')
            .map(name => name.at(0))
            .join('');
    });
};
// Calling the function to create the account username
createUsernames(accounts);

// Updating the UI
const updateUI = function (account) {
    //Display movements
    displayMovements(account);

    //Display balance
    calcDisplayBalance(account);

    //Display summary
    calcDisplaySummary(account);
};

// Logout Timer
const startLogoutTimer = function () {
    // Set time to 5 min
    let time = 300;
    // Setting variable to callback function
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        //In each call, print remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;
        // When 0 seconds, stop timer and log user out
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = '0';
        }
        // Decrease 1 sec
        time--;
    }

    // Starting timer
    tick();

    // Call timer every second
    const timer = setInterval(tick, 1000);

    // Returning the timer
    return timer;
}

///////////////////////////////////////
// Event handlers
// Setting the current account and timer variables
let currentAccount, timer;

// Login Functionality
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();

    // Setting the current account
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );

    // Checking the credentials of the current account
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI and Message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`;

        // Showing the UI
        containerApp.style.opacity = '100';

        //Set current Date and Time and their options
        const now = new Date();
        const dateOptions = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }

        // Displaying the current date and time for the overall account
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, dateOptions).format(now);

        //Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Start logout timer
        if (timer) clearInterval(timer);
        timer = startLogoutTimer();

        // Update UI
        updateUI(currentAccount);
    }
});

// Transferring Money Functionality
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';
    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // Transferring Funds
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
        // Reset timer
        clearInterval(timer);
        timer = startLogoutTimer();
        //Updating UI
        updateUI(currentAccount);
    }
});

//Loan feature
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    // Saving the amount input to a variable
    const amount = Math.floor(inputLoanAmount.value);
    // Checking to see if any deposit is 10% greater than the amount
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        setTimeout(function () {
            // Add loan
            currentAccount.movements.push(amount);
            // Add current date for loan
            currentAccount.movementsDates.push(new Date().toISOString());
            //Update UI
            updateUI(currentAccount);
            //Reset timer
            clearInterval(timer);
            timer = startLogoutTimer();
        }, 2500)
    }

    //Clearing the field
    inputLoanAmount.value = '';
});

//Sort
// Setting default if sorted value
let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();

    // Calling the function to sort
    displayMovements(currentAccount, !sorted);

    //Changing the sorted value
    sorted = !sorted;
});

//Deleting accounts
btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    // Checking the account credentials
    if (
        currentAccount.username === inputCloseUsername.value &&
        currentAccount.pin === Number(inputClosePin.value)
    ) {
        //Finding the index of the account to be deleted from the accounts array
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );

        //Deleting the account
        accounts.splice(index, 1);

        //Hiding the UI
        containerApp.style.opacity = '0';
    }

    //Clearing the fields
    inputCloseUsername.value = inputClosePin.value = '';
});



















































