/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

let standard_url = 'http://localhost:5000';

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });
    const ttl = createElement('h2', post.meta.author, { class: 'post-title'});
    ttl.id = 'ttl';
    section.appendChild(ttl);

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,'+post.src,  class: 'post-image' }));
	section.appendChild(createElement('p',  post.meta.description_text, { class: 'post-description' }));

	let convert_options = {weekday:'long', year: 'numeric', month:'long', day:'numeric'}
	let convert = new Date(parseFloat(post.meta.published*1000)).toLocaleDateString('en-US', convert_options);

	//console.log(convert);
	section.appendChild(createElement('p', convert, { class: 'post-pub' }));
	section.appendChild(createElement('p', 'Comments ('+post.comments.length + ') '+'\t'+'Likes ('+post.meta.likes.length +') ', { class: 'post-commentslikes' }));
	
	let give_likes = createElement('button', 'I Like it!', { class: 'post-tolike' });
	section.appendChild(give_likes);
	let likes_form = createElement('div');
	give_likes.onclick = function(){
		//--------show who liked this picture---------/
		post.meta.likes.forEach(function(element,index){
			let idx = element;
			//console.log(idx);
			let getid_url = standard_url + '/user/?id=' + idx;
			fetch(getid_url, {
  				method: 'GET',
  				headers:{
    					'Content-Type': 'application/json',
					'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
			}).then(response => response.json())
			.then(response => {
				let usr = response.username;
				if (usr == ""){
					usr = 'No user likes this post yet';
				}else{
					usr = 'Liked by '+usr+'!';
				}
				likes_form.appendChild(createElement('p', usr));
			})
				give_likes.disabled = 'true'; //avoid mutiple clicks
			})
		
		section.appendChild(likes_form);
		//------likes others' picture-------//
		let this_id = post.id;
		//console.log(this_id);
		let postlike_url = standard_url + '/post/like?id='+this_id;
		fetch(postlike_url, {
  				method: 'PUT',
  				headers:{
    					'Content-Type': 'application/json',
					'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
		}).then(response => response.json())
		.then(response =>{
			if (response.message == 'success'){
					alert ('Thanks for the like!');
			}else{
					alert ('Something wrong:(');
			}
		})
	}

	//-------show comments---------//
	let show_comments = createElement('button', 'Show all comments', { class: 'post-showcomments' })
	section.appendChild(show_comments);
	let comments_form = createElement('div');
	show_comments.onclick = function(){
		post.comments.forEach(function(element,index){
			let time = new Date(parseFloat(element.published*1000));
			let str = element.comment + ' - By ' + element.author + ' at ' + time.toLocaleDateString('en-US',convert_options);
			comments_form.appendChild(createElement('p', str))
		})	
			show_comments.disabled = 'true'; //avoid mutiple clicks
		};
		section.appendChild(comments_form);

	//--------give comments--------------//
	let give_comments_btn = createElement('button', 'leave my comment', { class: 'post-leavecomment-btn' });
	let give_comments = createElement('input', { class: 'post-leavecomment' });
	give_comments.type = 'text';
	give_comments.id = 'post-leavecomment';
	give_comments.style = 'width: 465px;height:32px;background-color: white;color: black;border: 2px solid #e7e7e7;margin: 4px 2px;';
	give_comments.placeholder= 'Say something...';
	section.appendChild(give_comments);
	section.appendChild(give_comments_btn);
	let given_comment_form = createElement('div');
	give_comments_btn.onclick = function(){
		let comm = document.getElementById("post-leavecomment").value;
		//console.log(comm);
		let comm_id = post.id;
		let comm_date= (new Date).getTime();
		//console.log(comm_date);
		let postlike_url = standard_url + '/post/comment?id='+comm_id;
		fetch(postlike_url, {
  				method: 'PUT',
				body: JSON.stringify({
				author: 'auto', 
				published: comm_date,
				comment: comm
				}),
  				headers:{
    					'Content-Type': 'application/json',
					'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
		}).then(response => response.json())
		.then(response =>{
			//console.log(response);
			if (response.message == 'success'){
					alert ('Comment successfully!');
			}else{
					alert ('Something wrong:(');
			}
		})
	}
	//---------click to show info--------------//

	let modal2 = document.getElementById('myModal2');
	let btn2 = ttl;
	let span2 = document.getElementsByClassName("close2")[0];
	btn2.onclick = function() {
		let userdd = post.meta.author;
		//console.log(userdd);
		let showpro_url = standard_url + '/user/?username='+userdd;
		//console.log(showpro_url)
		fetch(showpro_url, {
  					method: 'GET',
  					headers:{
    						'Content-Type': 'application/json',
						'Authorization' : 'Token '+window.localStorage.getItem('key')
  					}
			}).then(response => response.json())
			.then(response =>{
				//console.log(response);
				let usr2 = response.username;
				let nm2 = response.name;
				let email2 = response.email;
				let followers2 = response.followed_num;
				let following2 = response.following.length;
				let po_nb2 = response.posts.length;
				//let posts_pic = response.posts; //posts pic
				const p_username2 = document.getElementById('p_username2');
				const p_name2 = document.getElementById('p_name2');
				const p_email2 = document.getElementById('p_email2');
				const p_followers2 = document.getElementById('p_followers2');
				const p_following2 = document.getElementById('p_following2')		
				const p_posts2 = document.getElementById('p_posts2');
				//const p_pics2 = document.getElementById('p_pics2');
				p_username2.innerHTML = 'Username: '+usr2;
				p_name2.innerHTML = 'Name: '+nm2;
				p_email2.innerHTML = 'E-mail: '+email2;
				p_followers2.innerHTML = 'Has '+followers2+' followers.';
				p_following2.innerHTML = 'Currently following '+following2+' people.';
				p_posts2.innerHTML = 'Has '+po_nb2+' posts.';
	
			})
		modal2.style.display = "block";
	}
	span2.onclick = function() {
	    modal2.style.display = "none";
	}
	window.onclick = function(event) {
	    if (event.target == modal2) {
		modal2.style.display = "none";
	    }
	}

	//-----------------------------------------//
    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export async function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
	//from stackoverflow
	function getBase64(file, onLoadCallback) {
    		return  new Promise(function(resolve, reject) {
			const reader = new FileReader();
			reader.onload = function(){ resolve(reader.result); };
			reader.onerror = reject;
        		reader.readAsDataURL(file);
		});
	}
	let promising = getBase64(file);
	let des = document.getElementById("descrp").value;
	if (des == ""){
		des = 'Non-titled'; //avoid showing no information
	}else{
		des = des; //keep the description
	}
	promising.then(function(result) {
		let real = result.split(',')[1];
		const data = {'description_text': des,
			'src': real}
		//console.log(JSON.stringify(data));
		let url = standard_url + '/post/';
		fetch(url, {
  			method: 'POST',
  			body: JSON.stringify(data),
  			headers:{
    				'Content-Type': 'application/json',
				'Authorization' : 'Token '+window.localStorage.getItem('key')
  				}
		}).then(response => response.json())
		.then(response => {
			if (response.status == 400){
				alert ('Image could not be processed');
			}else{
				//const image = createElement('img',null,{ src:result });
				//document.body.appendChild(image);
				alert ('Your image uploaded successfully! With id: '+ response.post_id +' .');
			}
		})
		return

	});

}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}
