// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();
let standard_url = 'http://localhost:5000';

//add login & register form
const Auth = document.createElement('div');
Auth.id = 'auth'
Auth.name = 'auth';
Auth.class = 'auth';
const username = document.createElement('input');
username.id = 'username';
username.type = 'text';
username.name = 'username';
username.placeholder = '* Username here';
const password = document.createElement('input');
password.id = 'password';
password.type = 'password';
password.name = 'password';
password.placeholder = '* Password here';
const email = document.createElement('input');
email.id = 'email';
email.type = 'text';
email.name = 'email';
email.placeholder = 'email for register';
const rname = document.createElement('input');
rname.id = 'rname';
rname.type = 'text';
rname.name = 'rname';
rname.placeholder = 'name for register';
const loginclick = document.createElement('input');
loginclick.id = 'loginclick';
loginclick.type = 'button';
loginclick.value = 'Login :)';
const placeHolder = document.createElement('button');
placeHolder.appendChild(loginclick);
const signclick = document.createElement('input');
signclick.id = 'signclick';
signclick.type = 'button';
signclick.value = 'Sign Up for free';
const placeHolder2 = document.createElement('button');
placeHolder2.appendChild(signclick);
const selectpanel1 = document.getElementsByClassName('banner')[0];
//const selectpanel1 = document.getElementById("large-feed");
Auth.appendChild(username);
Auth.appendChild(password);
Auth.appendChild(loginclick);
Auth.appendChild(email);
Auth.appendChild(rname);
Auth.appendChild(signclick);
selectpanel1.appendChild(Auth);

const descrp = document.createElement('input');
descrp.id = 'descrp';
descrp.type = 'text';
descrp.name = 'descrp';
descrp.placeholder = 'description of this image?';
const selectpanel2 = document.getElementsByClassName('nav')[0];
selectpanel2.appendChild(descrp);
const profile = document.createElement('input');
profile.id = 'profile';
profile.type = 'button';
profile.value = 'Check my profile';
const placeHolder3 = document.createElement('button');
placeHolder3.appendChild(profile);
selectpanel2.appendChild(profile);

const updateprofile = document.createElement('input');
updateprofile.id = 'updateprofile';
updateprofile.type = 'button';
updateprofile.value = 'Update my profile';
const placeHolder4 = document.createElement('button');
placeHolder4.appendChild(updateprofile);
selectpanel2.appendChild(updateprofile);

const logout = document.createElement('input');
logout.id = 'logout';
logout.type = 'button';
logout.value = 'Logout';
const placeHolder5 = document.createElement('button');
placeHolder5.appendChild(logout);
selectpanel2.appendChild(logout);

document.querySelector(".nav").style.display = 'none'; //hide berfore login
const before_content = document.getElementById('large-feed');
before_content.style.display = 'none'; //hide before login

// login validation
const login_button = document.getElementById('loginclick');
login_button.addEventListener('click', validate);
function validate() {
        let lusername = document.getElementById("username").value;
        let lpassword = document.getElementById("password").value;
	let url = standard_url + '/auth/login';
	localStorage.clear();
        if (lusername == null || lusername == "") {
            alert("Please enter the username.");
            return false;
        }
        if (lpassword == null || lpassword == "") {
            alert("Please enter the password.");
            return false;
        }
	fetch(url, {
  		method: 'POST',
  		body: JSON.stringify({
				username: lusername, 
				password: lpassword
		}), // data can be `string` or {object}!
  		headers:{
    			'Content-Type': 'application/json'
  		}
	}).then(response => response.json())
	.then(response => {
		if (response.message != null){
			alert("Please try again :(");
			//throw new Error(response.message);
		}else{
			//alert('Login Successful, welcome to instacram!');
			const auth_content = document.getElementById('auth');
			auth_content.style.display = 'none';
			const after_content = document.getElementById('large-feed');
			after_content.style.display = 'inline';
			document.querySelector(".nav").style.display = 'inline';

			localStorage.setItem('key', response.token);
			console.log(response.token);
			const feed_url = standard_url + '/user/feed';

			
			//-----show feed----------//
			let options = {
  					method: 'GET',
  					headers:{
    						'Content-Type': 'application/json',
						'Authorization' : 'Token '+window.localStorage.getItem('key')
  					}
			}
			const feed_JSON = (feed_url, options)=>fetch(feed_url, {
  				method: 'GET',
  				headers:{
    					'Content-Type': 'application/json',
					'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
			})
			.then((res) => res.json())
			const feed = feed_JSON(feed_url, options);
			if (window.localStorage.getItem('key')){
				feed
				.then(res => {
					//console.log(res.posts);
    					res.posts.reduce((parent, post) => {
        				parent.appendChild(createPostTile(post));
					//localStorage.clear();
        			return parent;
    			}, document.getElementById('large-feed'))
			})
			}
			return window.localStorage.getItem('key')
		}
	})
}

// sign up
const signup_button = document.getElementById('signclick');
signup_button.addEventListener('click', signup);
function signup() {
	let susername = document.getElementById("username").value;
        let spassword = document.getElementById("password").value;
	let semail = document.getElementById("email").value;
        let rname = document.getElementById("rname").value;
	let data = {username: susername, password: spassword, email: semail, name: rname};
	let url = standard_url + '/auth/signup';

        if (susername == null || susername == "") {
            alert("Please enter the username.");
            return false;
        }
        if (spassword == null || spassword == "") {
            alert("Please enter the password.");
            return false;
        }
	fetch(url, {
  		method: 'POST',
  		body: JSON.stringify(data), 
  	headers:{
    		'Content-Type': 'application/json'
  		}
	}).then(response => response.json())
	.then(response => {
		if (response.message != null){
			throw new Error(response.message);
		}else{
			alert('Signup Successful, welcome to instacram!');
		}
	})
	return
}


//log out
logout.onclick = function(){
	location.reload();
}

// upload an image
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', uploadImage);


// show personal profile
let modal = document.getElementById('myModal');
let btn = document.getElementById("profile");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
	let showpro_url = standard_url + '/user/';
	fetch(showpro_url, {
  				method: 'GET',
  				headers:{
    					'Content-Type': 'application/json',
					'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
		}).then(response => response.json())
		.then(response =>{
			//console.log(response);
			let usr = response.username;
			let nm = response.name;
			let email = response.email;
			let followers = response.followed_num;
			let following = response.following.length;
			let po_nb = response.posts.length;
			const p_username = document.getElementById('p_username');
			const p_name = document.getElementById('p_name');
			const p_email = document.getElementById('p_email');
			const p_followers = document.getElementById('p_followers');
			const p_following = document.getElementById('p_following')		
			const p_posts = document.getElementById('p_posts');
			p_username.innerHTML = 'Username: '+usr;
			p_name.innerHTML = 'Name: '+nm;
			p_email.innerHTML = 'E-mail: '+email;
			p_followers.innerHTML = 'Has '+followers+' followers.';
			p_following.innerHTML = 'Currently following '+following+' people.';
			p_posts.innerHTML = 'Has '+po_nb+' posts.';
	
		})
	modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//pagination


//----------------level 3--------some in helper.js--------//


/*
//Feed Interface
function get_token(){
	if (window.localStorage){
        	return window.localStorage.getItem('key')
   	}else{
       	return null
	}
}
//const login_token = get_token();
const feed_url = standard_url + '/user/feed';
let options = {
  		method: 'GET',
  		headers:{
    			'Content-Type': 'application/json',
			'Authorization' : 'Token '+get_token()
  		}
	}
const feed_JSON = (feed_url, options)=>fetch(feed_url, {
  		method: 'GET',
  		headers:{
    			'Content-Type': 'application/json',
			'Authorization' : 'Token '+get_token()
  		}
	})
	.then((res) => res.json())
const feed = feed_JSON(feed_url, options);
if (window.localStorage.getItem('key')){
	feed
	.then(res => {
//console.log(res.posts);
    	res.posts.reduce((parent, post) => {
        	parent.appendChild(createPostTile(post));
		//localStorage.clear();
        	return parent;
    	}, document.getElementById('large-feed'))
	})
};
*/

// we can use this single api request multiple times
/*
const feed = api.getFeed();

feed
.then(posts => {
    posts.reduce((parent, post) => {
        parent.appendChild(createPostTile(post));
        return parent;
    }, document.getElementById('large-feed'))
});
*/




