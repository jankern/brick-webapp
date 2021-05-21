/*
 *  Class addon
 */

class AddonRDPLBlogPost {

	constructor() {
		this.lid;
		this.isInitialListCall = true;
		this.hasMoreItems = true;
	}

	init() {

		$("#rdpl_blog_post_form").on("submit", (e) => {
			// remove leading and ending blanks from input fields
			$("#rdpl_blog_post_form").find('input, textarea').each((index, element) => {
				element.value = element.value.trim();
			});
			this.formSubmit(e);
		});

		let options = {
			root: null,
			rootMargins: "0px",
			threshold: 0.5
		};

		// detect internet explorer
		let ua = window.navigator.userAgent;
		let ieOlder11 = ua.indexOf('MSIE ');
		let ie11 = ua.indexOf('Trident/');

		// console.log(ieOlder11); // -1
		// console.log(ie11); // 37 ie11

		let isIE = ieOlder11 > 0 || ie11 > 0 ? true : false;

		if (!isIE){
			this.getListData({ mode: 'limit' });
			const observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
			observer.observe(document.querySelector("footer"));
		}else{
			// fetches the entire list and skips lazy/infinit loading
			// IEX does not understand IntersectionObserver
			this.getListData({ mode: 'all' });
		}
	}

	formSubmit(e) {
		
		e.preventDefault();
		
		// start preloader screen
		this.showInfinitScrollLoader(true);

		let postUrl = $(e.currentTarget).attr("action"); //get form action url
		let requestMethod = $(e.currentTarget).attr("method"); //get form GET/POST method
		let formData = ""; //new FormData(e.currentTarget); //Creates new FormData obje
		formData = $(e.currentTarget).serialize();

		$.ajax({
			url: postUrl,
			data: formData,
			// contentType: false,
			cache: false,
			type: requestMethod,
		})
			.done((response) => {
				// html element

				$("#rdpl_blog_post_response_container").html(response.html);
				$("#rdpl_blog_post_response_container").css({ display: "block" });
				$("#rdpl_blog_post_form_container").css({ display: "none" });
				$(".rdpl_menu_bar").css({ paddingTop: '20px' });
				$("#rdpl_blog_post_response_count").html(response.count);
				$("#rdpl_blog_post_response_msg").css({ display: "block" });
				$("#rdpl_blog_post_response_msg").html(response.msg);
				$("#rdpl_blog_post_response_msg").addClass(response.type);


				// Assign event to response form for post deletion
				$("#rdpl_blog_post_form_delete").on("submit", (e) => {
					this.formSubmit(e);
				});

				this.showInfinitScrollLoader(false);
			})
			.fail((error, status) => {
				if (error.status === 403) {
					$("#captcha_response").attr('data-error', error.responseText);
					let input = $("#captcha_response").parent().find('input');
					input.removeClass('valid');
					input.addClass('invalid');
					$("#rdpl_blog_post_response_msg").html("");
					$("#rdpl_blog_post_response_msg").css({ display: "none" });
				} else {
					$("#rdpl_blog_post_form_response_msg").html(error.responseText);
					$("#rdpl_blog_post_form_response_msg").css({ display: "block" });
				}
				this.showInfinitScrollLoader(false);
			});

	}

	handleIntersect(entries){
		if(entries[0].isIntersecting){
			if(this.hasMoreItems){
				this.getListData({ mode: 'limit' });
			}
		}
	}

	getListData(conf) {

		let lid = '';
		if (this.lid !== undefined){
			lid = '&lid='+this.lid;
		}

		let mode = "";
		if(conf.mode == 'all'){
			mode = '&mode=all';
		}

		if (this.isInitialListCall || this.lid !== undefined){

			this.isInitialListCall = false;
			if (!this.isInitialListCall && this.hasMoreItems){
				this.showInfinitScrollLoader(true);
			}
			let container = document.querySelector('#rdpl_blog_post_list_container');

			$.ajax({
				url: "index.php/?rex-api-call=rdpl_blog_post_get" + lid + mode, 
				contentType: 'application/json',
				success: (response) => {
					if (this.lid === null) {
						this.hasMoreItems = false;
					}

					this.lid = response.lid;
					container.innerHTML += response.html;
					this.showInfinitScrollLoader(false);
				},
				error: (err) => {
					// handle errors
					this.showInfinitScrollLoader(false);
				}
			});

			// fetch("index.php/?rex-api-call=rdpl_blog_post_get"+lid)
			// 	.then(response => response.json())
			// 	.then(response => {
			// 		// console.log(response);
			// 		if (this.lid === null){
			// 			this.hasMoreItems = false;
			// 		}
					
			// 		this.lid = response.lid;
			// 		container.innerHTML += response.html; 
			// 		this.showInfinitScrollLoader(false);
					
			// 	})
			// 	.catch(err => {
			// 		// handle errors
			// 		this.showInfinitScrollLoader(false);
			// 	});
		}

	}

	showProgressStatus(isHidden, callback) {
		if (isHidden) {
			$(".loader-layover").css({ display: "block" });
			$(".loader-layover").animate({ opacity: "1.0" }, 100);
		} else {
			$(".loader-layover").animate({ opacity: "0" }, 100, () => {
				$(".loader-layover").css({ display: "none" });
			});
		}
		// if calback function is present, execute
		if (callback) {
			callback();
		}
	}

	showInfinitScrollLoader(isHidden, callback) {
		if (isHidden) {
			$(".rdpl_blog_post_list_preloader").css({ display: "block" });
			$(".rdpl_blog_post_list_preloader").animate({ opacity: "1.0" }, 0);
		} else {
			$(".rdpl_blog_post_list_preloader").animate({ opacity: "0" }, 300, () => {
				$(".rdpl_blog_post_list_preloader").css({ display: "none" });
			});
		}
		// if calback function is present, execute
		if (callback) {
			callback();
		}
	}
}

$(function() {
	let addon = new AddonRDPLBlogPost();
	addon.init();
});