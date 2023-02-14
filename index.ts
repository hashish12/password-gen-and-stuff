import './style.css';
import { fromEvent, pipe } from 'rxjs'; 
import { map, tap, take } from 'rxjs/operators';


const getChars = function(startChar, endChar){
    let charArray = [];
    for(let i = startChar.charCodeAt(); i<=endChar.charCodeAt(); i++)
        charArray.push(String.fromCharCode(i))
    
    return charArray;
}


const a_z = getChars('a', 'z');
const A_Z = getChars('A', 'Z');
const digits = getChars('0', '9');
const specialChars = getChars('!', '/').concat(getChars(':', '@')).concat(getChars('[', '`')).concat(getChars('{', '~'));


/**
 * evaluates the strength of the given password, according to a simple strength meter.
 * 
 * @param {*} password the password to evaluate
 */
const calcStrength = function(password){
    let strength = 0;
    if(password.length >= 8)
        strength += 1;
    
    if(/[0-9]/.test(password))
        strength += 1;
    
    if(/[a-z]/.test(password))
        strength += 1;
    
    if(/[A-Z]/.test(password))
        strength += 1;
    
    for(let char of specialChars){
        if(password.indexOf(char) > -1){
            strength += 1;
            break;
        }
    }

    return strength;
}


/**
 * make a random permutation of the string given.
 * 
 * @param {*} password the password to shuffle
 */
const shuffle = function(password){
    let shuffled = "";

    while(password){
        let i = Math.floor(Math.random()*password.length);
        shuffled += password[i];
        password = password.slice(0,i) + password.slice(i+1);
    }

    return shuffled;
}


const generatePassword = function(){
    let password = "";
    
    password += a_z[Math.floor(Math.random() * a_z.length)];
    password += a_z[Math.floor(Math.random() * a_z.length)];

    password += A_Z[Math.floor(Math.random() * A_Z.length)];
    password += A_Z[Math.floor(Math.random() * A_Z.length)];

    password += digits[Math.floor(Math.random() * digits.length)];
    password += digits[Math.floor(Math.random() * digits.length)];

    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    return shuffle(password);
}

const button = document.getElementById('button');
const password$ = fromEvent(button, 'click').pipe(
  take(5),
  map( () => generatePassword() )
);

// DOM elements
const inputField = document.getElementById('password');
const clipboardButton = document.getElementById('clipboard');
const tooltipSpan = document.getElementById('tooltip');
const inputVerify = document.getElementById('input-verify');


password$.subscribe(password => {
  (inputField as HTMLInputElement).value = `${password}`;
  (inputVerify as HTMLInputElement).value = '';
})

// binding events
clipboardButton.addEventListener('click', () => {
  const password = (inputField as HTMLInputElement).value;

  (inputField as HTMLInputElement).select();
  document.execCommand('cut');

  tooltipSpan.innerHTML = 'copied!';

});

// restore tooltip default text
clipboardButton.addEventListener('mouseleave', () => {
  tooltipSpan.innerHTML = 'copy to clipboard';
});
