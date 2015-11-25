var encyId;
//var geturl = "http://192.168.1.18:8080/V1/qrcoderest/";
//var uploadFeedbackUrl = "http://192.168.1.18:8080/V1/qrcoderest/upload/feedbacks";
var starValue;
var questions=
	[
	 {
	   "additionalFeedbackComment": "Have additional feedback? Tap here.",
	   "worstQuestion": "Which experience could we improve?",
	   "commentsLabel": "Please leave your comments here... We value them.",
	   "overallQuestion2": "Overall Experience",
	   "overallQuestion1": "Tap to rate your overall experience.",
	   "rating": "Poor,Fair,Average,Good,Excellent",
	   "categoryQuestion": "Tap on a category to rate it.",
	   "subCategoryQuestion": "What could we improve in",
	   "emailPlaceholder": "Enter your email address...",
	   "summaryText": "We appreciate you taking time to give us your feedback.",
	   "emailQuestion": "Give us a chance to get back to you.",
	   "changeLanguageText": "Select your language",
	   "categoryQuestionTapped": "Tap on a number to rate the category.\n5 being Excellent; 1 Being Poor",
	   "placeholder": "Please leave your comments here...",
	   "lang": "en",
	   "emailHint": "We protect and value your personal information."
	 }
	];
var leastVal;
var ratedCategory;
var category;
var catforsubcat;
var ratingChange = false;
var roomNumber = false;
var mailid;
var feedback = {
	catg5 : undefined,
	catg4 : undefined,
	catg3 : undefined,
	catg2 : undefined,
	catg1 : undefined
};

var subCategory;
var selectedSubCategoryCounter = 0;
var worstCategoryCounter = 0;
var subCategorySelected = [];
var selectCat;
var animationDuration = 300;
var animationDelay = 50;
var maxCategorySelection = 2;
var data={
	 "Cleanliness": "Utensils,Furniture,Washroom,Garbage Handling,Pest Control",
	 "Wait Time": "Reservation Management,Queue Management,Bar Facility",
	 "Service": "Friendliness,Courteousness,Attentiveness,Menu Knowledge,Grooming Standards",
	 "Ambience": "Lighting,Seating Arrangement,Decor,Parking,Theme",
	 "category": "Food,Cleanliness,Service,Ambience,Wait Time",
	 "Food": "Taste,Availability,Presentation,Freshness"
	};
subCategory = data;
category = data.category.split(',');
// Over All Rating selection
function Overallrating(rating) {
	console.log(rating.id + ", " + starValue);
	if (rating.id == starValue) {
		ratingChange = false;
	} else {
		ratingChange = true;
	}
	console.log(ratingChange);
	$(".star").each(function(index) {
		if ($(this).children().hasClass("checkboxes")) {
			$(this).children().slice(1, 2).remove();
		}
	});
	$(rating).append('<div class="checkboxes vertical-align"> <i class="font-size icon-checked"></i></div>');
	starValue = rating.id;
	if (rating.id != 5) {
		$("#additional_feedback").html(
				'<div class="vertical-align" style="width:89%;text-align:center;color:#212121;" >' + questions[0].additionalFeedbackComment + '</div>'
						+ '<div style="width:10%;float:right" id="first-icons"></div>');
		$("#first-icons").html("");
		var lengthfade;
		if(category.length<=5){
			lengthfade=category.length;
		}else{
			lengthfade=5
		}
		var fadeheight = 100 / lengthfade;
		for (var i = 0; i < lengthfade; i++) {
			var iconName = ClassNames(category[i]);
			$("#first-icons").append("<div class='defaultbar fade va-parent' style='height:" + fadeheight + "%;'><i class=' vertical-align center  icon-" + iconName + "'></i></div>");
		}
		Reset();
		$('.screen_1').nextAll('div').remove();
		$("#submit").attr("onclick", "EmailPageDone(1)");
		$("#submit").css("color", "#000");
		$("#submit").css("cursor", "pointer");
		$("#additional_feedback").css("cursor", "pointer");
		$("#additional_feedback").attr("onclick", "CreateCategory()");
		$("#submit").css("color", "#000");
		$("#additional_feedback").parent().removeClass("commentpadding");
	} else {
		$("#additional_feedback").parent().addClass("commentpadding");
		$('.screen_1').nextAll('div').remove();
		if ($(".comment-text").val()) {
			var commentvalue = $(".comment-text").val();
			$("#additional_feedback").html((commentvalue.replace(/\r?\n/g, '<br/>')));
		} else {
			$("#additional_feedback").html('Tap here to leave your comments');
		}
		$("#additional_feedback").attr("onclick", "Comments()");
		$("#submit").attr("onclick", "EmailPageDone(1)");
		$("#submit").css("color", "#000");
	}
}
function Reset() {
	feedback = {
		catg5 : undefined,
		catg4 : undefined,
		catg3 : undefined,
		catg2 : undefined,
		catg1 : undefined
	};
	selectedSubCategoryCounter = 0;
	worstCategoryCounter = 0;
	subCategorySelected = [];
}
function CreateCategory() {
	if (ratingChange) {
		screen_2_bar();
	}
	Navigation(1);
}
function AppendPage(currentPage) {
	if (currentPage == 2) {
		RatingCheck();
	}
	if (starValue == 5) {
		$(".content-frame").append(Emailscreen(2));
	}
	if (currentPage == 3 && worstCategoryCounter == 0) {
		$(".screen_4").remove();
		$(".content-frame").append(Emailscreen(4));
	}
	if (currentPage == 4 && worstCategoryCounter == 2) {
		$(".screen_5").remove();
		$(".content-frame").append(Emailscreen(5));
	}
}
// Page to page navigation animation
function Navigation(currentPage) {

	animationDelay = 50;
	AppendPage(currentPage);
	$(".screen_" + currentPage + "_bar").each(function(index) {
		animationDelay = animationDelay + 50;
		$(this).transition({
			x : '-200%',
			y : '0%',
			delay : animationDelay,
			duration : animationDuration
		});
	});

	$(".screen_" + (currentPage + 1) + "_bar").each(function(index) {
		animationDelay = animationDelay + 50;
		$(this).transition({
			x : '-100%',
			y : '0%',
			delay : animationDelay,
			duration : animationDuration
		});
	});
	animationDelay = 10;

	for (var i = 0; i < category.length; i++) {
		$(".slide [category='" + category[i] + "']").transition({
			x : '0%',
			delay : animationDelay,
			duration : 280
		});
	}
	;

	CommentCheck();
}
function Previous(currentPage) {
	ratingChange = false;
	animationDelay = 50;
	$(".screen_" + currentPage + "_bar").each(function(index) {
		animationDelay = animationDelay + 50;
		$(this).transition({
			x : '0%',
			y : '0%',
			delay : animationDelay,
			duration : 280
		});
	});
	var percent;
	currentPage == 2 ? percent = 0 : percent = -100;
	$(".screen_" + (currentPage - 1) + "_bar").each(function(index) {
		animationDelay = animationDelay + 50;
		$(this).transition({
			x : '' + percent + '%',
			y : '0%',
			delay : animationDelay,
			duration : 280
		});
	});
	animationDelay = 10;

	for (var i = 0; i < category.length; i++) {
		$(".slide [category='" + category[i] + "']").transition({
			x : '0%',
			delay : animationDelay,
			duration : 280
		});
	}
	;
}
// Catergory Rating page
function screen_2_bar() {
	var rated = "<div class='screen_2'>";
	rated = rated + Rating(2);
	var commentboxheightvalue = 100 - (9 * (category.length) + 9 * 3);
	rated = rated + "<div  class='question_2 font-size screen_2_bar va-parent '><div class='vertical-align center'  id='categoryRatingQuestion'>" + questions[0].categoryQuestion + "</div></div>";
	for (var i = 0; i < category.length; i++) {
		var check;
		var classname = ClassNames(category[i]);

		((i + 1) % 2 == 0) ? check = "even" : check = "odd";
		rated = rated + "<div onclick='RateCategory(this)' id='" + category[i] + "'  class='font-size bar screen_2_bar defaultbar va-parent'>"
				+ "<div class='category-name vertical-align'><div class='vertical-align cat-icon'><i class='icon icon-" + classname + "'></i></div><div class='vertical-align cat-name'> "
				+ category[i] + " </div></div></div>";
	}
	;
	rated = rated + "<div class='commentpadding screen_2_bar'><div class='comments_2  font-size' style='height:" + commentboxheightvalue
			+ "%' onclick='Comments()'>Tap here to leave your comments</div></div>";
	rated = rated
			+ "<div class='bar font-size screen_2_bar'><div class='done va-parent' onclick='EmailPageDone(2)'><div class='vertical-align center'>I'M DONE</div></div><div class='previous va-parent' onclick=Previous(2)><div class='vertical-align center'>Previous</div></div>"
			+ " <div class='next va-parent' onclick='Navigation(2)'><div class='vertical-align center'>Next</div></div></div>";
	rated = rated + "</div>";
	$(".content-frame").append(rated);
	var ratingSlide = "<div class='slide' >";
	for (var i = 0; i < category.length; i++) {
		ratingSlide = ratingSlide + "<div  category='" + category[i] + "'><div class='bar font-size'>"
				+ "<div class='rated5 rating va-parent'  onclick='SelectRating(5)'><div class='vertical-align center'>5</div></div>"
				+ "<div class='rated4 rating va-parent'  onclick='SelectRating(4)'><div class='vertical-align center'>4</div></div>"
				+ "<div class='rated3 rating va-parent'  onclick='SelectRating(3)'><div class=' vertical-align center'>3</div></div>"
				+ "<div class='rated2 rating va-parent'  onclick='SelectRating(2)'><div class=' vertical-align center'> 2</div></div>"
				+ "<div class='rated1 rating va-parent'  onclick='SelectRating(1)'><div class=' vertical-align center'> 1</div></div>" + "</div></div>";
	}
	;
	ratingSlide = ratingSlide + "</div>";
	$(".content-frame").append(ratingSlide);

}

function EmailPageDone(currentPage) {
	animationDelay = 50;
	$(".screen_" + currentPage + "_bar").each(function(index) {
		animationDelay = animationDelay + 50;
		$(this).transition({
			x : '-200%',
			y : '0%',
			delay : animationDelay,
			duration : animationDuration
		});
	});

	if ($(".content-frame").children('div [email="email"]').length == 0) {
		var last = $(".content-frame").children().last().attr("class");
		last == "slide" ? last = $(".content-frame").children().last().prev().attr("class") : last;
		var thenum = parseInt(last.match(/\d+/)[0]);
		$(".content-frame").append(Emailscreen(thenum + 1));
		$(".screen_" + (thenum + 1) + "_bar").each(function(index) {
			animationDelay = animationDelay + 50;
			$(this).transition({
				x : '-100%',
				y : '0%',
				delay : animationDelay,
				duration : animationDuration
			});
		});

	} else {
		var page = $(".content-frame").children('div [email="email"]').attr('page');
		$(".screen_" + page + "_bar").each(function(index) {
			animationDelay = animationDelay + 50;
			$(this).transition({
				x : '-100%',
				y : '0%',
				delay : animationDelay,
				duration : animationDuration
			});
		});
	}

}
// Over All rated div
function Rating(page) {
	var rated = "<div class='star" + starValue + " screen_" + page + "_bar bar font-size va-parent '  onclick='ChangeStar(" + page + ")'><div class='vertical-align center'> "
			+ questions[0].overallQuestion2 + " : " + starValue + "</div></div>"
	return rated;
}

// Icons
function ClassNames(str) {
	var lowerCase = str.toLowerCase();
	var trim = lowerCase.replace(/ /g, '');
	return trim;
}

// Rate Category
function RateCategory(categoryName) {
	var valueReplace = questions[0].categoryQuestionTapped;
	$("#categoryRatingQuestion").html(valueReplace.replace(/\\n/g, "<br />"));
	animationDelay = 10;
	for (var i = 0; i < category.length; i++) {
		$("[category='" + category[i] + "']").transition({
			x : '0%',
			delay : animationDelay,
			duration : 280
		});
	}
	;
	animationDelay = 10;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$("[category='" + categoryName.id + "']").transition({
			x : '-110%',
			delay : animationDelay,
			duration : 280
		});
		selectCat = categoryName;
	} else {
		$("[category='" + categoryName.id + "']").transition({
			x : '-114%',
			delay : animationDelay,
			duration : 280
		});
		selectCat = categoryName;
	}

}
// Select Rating

function SelectRating(value) {
	$("#categoryRatingQuestion").text(questions[0].categoryQuestion);
	jQuery.each(feedback, function(i, val) {
		if (val != undefined) {
			if (val.indexOf(selectCat.id) >= 0) {
				feedback[i] = val.replace(selectCat.id, '');
				var removeSpace = feedback[i].split(',');
				feedback[i] = cleanArray(removeSpace).toString();
			}
		}
	});
	if (feedback["catg" + value] == undefined) {
		feedback["catg" + value] = selectCat.id;
	} else {
		var ratedCat = feedback["catg" + value];
		if (!(ratedCat.indexOf(selectCat.id) >= 0)) {
			ratedCat = ratedCat + "," + selectCat.id;
			feedback["catg" + value] = ratedCat;
		}
	}
	animationDelay = 50;
	$("[category='" + selectCat.id + "']").transition({
		x : '0%',
		delay : animationDelay,
		duration : 280
	});
	$(selectCat).removeClass("defaultbar rated1 rated2 rated3 rated4 rated5");
	$(selectCat).addClass("rated" + value);
	var classname = ClassNames(selectCat.id);
	$(selectCat).children().html(
			"<div class='vertical-align cat-icon'><i class='icon icon-" + classname + "'></i></div><div class='vertical-align cat-name'>  " + selectCat.id + " : " + value + " </div>");
	// console.log(feedback)
}

// Check Category Rating with similar values

function RatingCheck() {
	leastVal;
	ratedCategory;
	var flag = true;
	jQuery.each(feedback, function(i, val) {
		if (val != undefined && val != '') {
			var categoryVal = val;
			if (categoryVal.indexOf(",") > -1) {
				categoryVal = categoryVal.split(",");
				categoryVal = cleanArray(categoryVal);
			} else {
				categoryVal = new Array(categoryVal);
			}

			if (leastVal != undefined) {
				var is_same = leastVal.length == categoryVal.length && leastVal.every(function(element, index) {
					return element === categoryVal[index];
				});
				console.log(is_same);
				if (is_same && ratedCategory == i.match(/\d+/)[0]) {
					flag = false;
				}
			}
			leastVal = categoryVal;
			ratedCategory = i.match(/\d+/)[0];// "3"
		}
	});
	if (flag) {
		selectedSubCategoryCounter = 0;
		subCategorySelected = [];
		$('.slide').nextAll('div').remove();
		if (leastVal == undefined) {
			$(".content-frame").append(Emailscreen(3));
			return;
		}
		if (ratedCategory != 5) {
			var worseCheck = leastVal;
			if (worseCheck.length > 1) {
				worstCategoryCounter = 2;
				WorseCategory(3, worseCheck, ratedCategory);
			} else {
				SubCategory(3, worseCheck, ratedCategory);
			}
		} else {
			$('.screen_2').nextAll('div').remove();
			$(".content-frame").append(Emailscreen(3));
		}
	}
}

function cleanArray(actual) {
	var newArray = new Array();
	for (var i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
}
function WorseCategory(page, worsecategory, ratedCategoryValue) {
	var subcat = worsecategory;
	var subCatPage = "<div class='screen_" + page + "' style='-webkit-transform: translate3d(100%, -" + (page) + "00%, 0px); transform: translate(100%, -" + (page) + "00%);height:100vh'>" + ""
			+ Rating(page) + "<div class='question_2 font-size screen_" + page + "_bar va-parent'><div class='vertical-align center'>" + questions[0].worstQuestion + "</div></div>";
	for (var i = 0; i < subcat.length; i++) {
		var check;
		var classname = ClassNames(subcat[i]);
		((i + 1) % 2 == 0) ? check = "even" : check = "odd";
		subCatPage = subCatPage + "<div  onclick='WorstCategorySelection(this," + ratedCategoryValue + ")' category='" + subcat[i] + "' class='font-size bar screen_" + page + "_bar star"
				+ ratedCategoryValue + " va-parent'>" + "<div class='category-name vertical-align'><div class='vertical-align cat-icon'><i class='icon icon-" + classname
				+ "'></i></div><div class='vertical-align cat-name'> " + subcat[i] + " </div></div>" + "<div class='checboxes-bg-" + ratedCategoryValue + "" + check
				+ " box' ><div class='checkboxes vertical-align center'> <i class='font-size icon-notchecked'></i></div></div></div>";
	}
	;
	var commentboxheightvalue = 100 - (9 * (subcat.length) + 9 * 3);
	subCatPage = subCatPage + "<div class='commentpadding screen_" + page + "_bar'><div class='comments_2  font-size' style='height:" + commentboxheightvalue
			+ "%;' onclick='Comments()' >Tap here to leave your comments</div></div>";
	subCatPage = subCatPage + "<div class='bar font-size screen_" + page + "_bar'><div class='done va-parent' onclick='EmailPageDone(" + page
			+ ")'><div class='vertical-align center'>I'M DONE</div></div><div class='previous va-parent' onclick=Previous(" + page + ")><div class='vertical-align center'>Previous</div></div>"
			+ " <div class='next va-parent' onclick='Navigation(" + page + ")'><div class='vertical-align center'>Next</div></div></div>";
	subCatPage = subCatPage + "</div>";
	subCatPage = subCatPage + Emailscreen(page + 1);
	$(".content-frame").append(subCatPage);
}

// SubCategory Page
function SubCategory(page, category, ratedCategoryValue) {
	catforsubcat = category;
	var subcat = subCategory["" + category + ""].split(",");
	var subCatPage = "<div class='screen_" + page + "' style='-webkit-transform: translate3d(100%, -" + (page) + "00%, 0px); transform: translate(100%, -" + (page) + "00%);height:100vh'>" + ""
			+ Rating(page) + "<div class='question_2 font-size screen_" + page + "_bar va-parent'><div class='vertical-align center'>" + questions[0].subCategoryQuestion + " " + category
			+ "?</div></div>";
	for (var i = 0; i < subcat.length; i++) {
		var check;
		var classname = ClassNames(subcat[i]);
		((i + 1) % 2 == 0) ? check = "even" : check = "odd";
		subCatPage = subCatPage + "<div id='" + subcat[i] + "' onclick='SelectSubCategory(this)' notselected='notselected' class='font-size bar screen_" + page + "_bar star" + ratedCategoryValue
				+ " va-parent'>" + "<div class='category-name vertical-align'><div class='vertical-align cat-icon'><i class='icon icon-" + classname
				+ "'></i></div><div class='vertical-align cat-name'> " + subcat[i] + " </div></div>" + "<div class='checboxes-bg-" + ratedCategoryValue + "" + check
				+ " box' ><div class='checkboxes vertical-align center'> <i class='font-size icon-notchecked'></i></div></div></div>";
	}
	;
	var commentboxheightvalue = 100 - (9 * (subcat.length) + 9 * 3);
	subCatPage = subCatPage + "<div class='commentpadding screen_" + page + "_bar'><div class='comments_2  font-size' style='height:" + commentboxheightvalue + "%' onclick='Comments()'>"
			+ questions[0].commentsLabel + "</div></div>";
	subCatPage = subCatPage + "<div class='bar font-size screen_" + page + "_bar'><div class='previous va-parent' onclick=Previous(" + page
			+ ")><div class='vertical-align center'>Previous</div></div>" + " <div class=' va-parent nextsub' onclick='Navigation(" + page
			+ ")'><div class='vertical-align center'>I'M DONE</div></div></div>";
	subCatPage = subCatPage + "</div>";
	subCatPage = subCatPage + Emailscreen(page + 1);
	$(".content-frame").append(subCatPage);
}

function SelectSubCategory(subCategory) {
	if (selectedSubCategoryCounter >= maxCategorySelection) {
		if ($(subCategory).children().last().find("i").hasClass("icon-checked")) {
			$(subCategory).children().last().find("i").toggleClass("icon-notchecked icon-checked");
			selectedSubCategoryCounter--;
			$(subCategory).attr("notselected", "notselected");
			$(subCategory).removeAttr("selected");
			var index = subCategorySelected.indexOf(subCategory.id);
			if (index >= -1) {
				subCategorySelected.splice(index, 1);
				if (subCategorySelected.length == 0) {
					// feedback["" +$(subCategory).attr("category")+
					// ""]=undefined;
				} else {
					// feedback["" +$(subCategory).attr("category")+
					// ""]=subCategorySelected.toString();
				}
			}
		}
		GreyOut($(subCategory).parent().attr("class"));
	} else {
		if ($(subCategory).children().last().find("i").hasClass("icon-checked")) {
			$(subCategory).children().last().find("i").toggleClass("icon-notchecked icon-checked");
			selectedSubCategoryCounter--;
			$(subCategory).attr("notselected", "notselected");
			$(subCategory).removeAttr("selected");
			var index = subCategorySelected.indexOf(subCategory.id);
			if (index >= -1) {
				subCategorySelected.splice(index, 1);

			}
			GreyOut($(subCategory).parent().attr("class"));
		} else {
			$(subCategory).children().last().find("i").toggleClass("icon-notchecked icon-checked");
			selectedSubCategoryCounter++;
			$(subCategory).attr("selected", "selected");
			$(subCategory).removeAttr("notselected");
			subCategorySelected.push(subCategory.id);
			// feedback["" +$(subCategory).attr("category")+
			// ""]=subCategorySelected.toString();
			GreyOut($(subCategory).parent().attr("class"));
			// selectedCategoryCounter==2? GreyOut(category):false;
		}
	}

	//
}
function WorstCategorySelection(category, ratedCategory) {
	$(".screen_3_bar").each(function(index) {
		$(this).children().last().find("i").removeClass("icon-checked");
		$(this).children().last().find("i").addClass("icon-notchecked");
	});
	$(category).children().last().find("i").toggleClass("icon-notchecked icon-checked");
	var cat = $(category).attr("category");
	$(".screen_4").remove();
	$(".screen_5").remove();
	SubCategory(4, cat, ratedCategory);

}
function GreyOut(pageClass) {
	if (subCategorySelected.length == maxCategorySelection) {
		$("." + pageClass + " [notselected]").each(function() {
			$(this).css("opacity", "0.5");
			$(this).children().css("opacity", "0.5");
			$(this).css("cursor", "default");
		});
	} else {
		$("." + pageClass + " [notselected]").each(function() {
			$(this).css("opacity", "1");
			$(this).children().css("opacity", "1");
			$(this).css("cursor", "pointer");
		});
	}
}
function Emailscreen(page) {
	var email = '<div email="email" page=' + page + ' class="screen_' + (page) + '" style="-webkit-transform: translate3d(100%, -' + (starValue == 5 || ratedCategory == 5 ? (page - 1) : page)
			+ '00%, 0px); transform: translate(100%, -' + (starValue == 5 || ratedCategory == 5 || page == 2 ? (page - 1) : page) + '00%);' + 'height:100vh">'
			+ '<div class="question_2 font-size screen_' + page + '_bar va-parent"><div class="vertical-align center">' + questions[0].summaryText + '</div></div>';
	var commentheight = 100 - 9;
	commentheight = commentheight - 31;
	if (mailid) {
		if (roomNumber == 'checked') {
			commentheight = commentheight + 4;
		} else {
			commentheight = commentheight + 4 + 18;
		}
	}
	email = email + '<div class="finalcomment  screen_' + (page) + '_bar" style="height:' + commentheight
			+ '%"><div onclick="ShowSummary()" class="btn-more font-size">Tap here to view a summary of your feedback</div> </div>';
	if (mailid) {
		if (roomNumber == 'checked') {
			email += '<input type="hidden" id="emailTextBox" value=' + mailid + '>';
			email += '<div class="question_2 font-size screen_' + page + '_bar va-parent"><div class="vertical-align center">Please Enter your Room Number</div></div>' + '<div class=" screen_'
					+ (page) + '_bar"><input class="bar emailid font-size" type="text" id="roomNumber" placeholder="Enter your Room Number" /></div>';
		} else {
			email += '<input type="hidden" id="emailTextBox" value=' + mailid + '>';
		}
	} else {
		email += '<div class="question_2 font-size screen_' + page + '_bar va-parent"><div class="vertical-align center">' + questions[0].emailQuestion + '</div></div>' + '<div class=" screen_'
				+ (page) + '_bar"><input class="bar emailid font-size" id="emailTextBox" type="email" placeholder="' + questions[0].emailPlaceholder + '" /></div>' + '<div class="casl screen_' + page
				+ '_bar va-parent"><div class="vertical-align center">' + questions[0].emailHint + '</div></div>';
	}
	email += '<div class="Submit bar screen_' + page + '_bar font-size va-parent" style="color:#000" onclick="Submit()"><div class="vertical-align center">SUBMIT FEEDBACK</div></div></div>';
	return email;
}
function ShowSummary() {
	$(".summary-overall").html("");
	$("#summary-details").html("");
	var ratedCategoryCounter = 0;
	jQuery.each(feedback, function(i, val) {
		if (val != undefined && val != "") {
			var checkcateg = val.split(",");
			for (var k = checkcateg.length - 1; k >= 0; k--) {
				ratedCategoryCounter++;
			}
		}
	});
	var division = [];
	if (ratedCategoryCounter != 0 && ratedCategoryCounter <= 4) {
		var widthSummaryIcon = 100 / ratedCategoryCounter;
		for (var jk = 0; jk < ratedCategoryCounter; jk++) {
			division.push(widthSummaryIcon);
		}
	} else if (ratedCategoryCounter == 5) {
		division = [ 33.333333333333336, 33.333333333333336, 33.333333333333336, 50, 50 ];
	} else if (ratedCategoryCounter == 6) {
		division = [ 33.333333333333336, 33.333333333333336, 33.333333333333336, 33.333333333333336, 33.333333333333336, 33.333333333333336 ];
	} else if (ratedCategoryCounter == 7) {
		division = [ 25, 25, 25, 25, 33.333333333333336, 33.333333333333336, 33.333333333333336 ];
	} else if (ratedCategoryCounter == 8) {
		division = [ 25, 25, 25, 25, 25, 25, 25, 25 ];
	}
	$(".summary-text").transition({
		x : '0%',
		y : '0%',
		delay : 10,
		duration : 400
	});
	$(".content-frame").css("opacity", "0.5");
	$(".summary-overall").text(questions[0].overallQuestion2 + ": " + starValue);
	var categoriesRated;
	console.log(feedback);
	var summary = '';
	ratedCategoryCounter = 0;
	jQuery.each(feedback, function(i, val) {
		if (val != undefined && val != "") {
			categ = val.split(",");
			for (var k = categ.length - 1; k >= 0; k--) {
				summary = summary + '<div class="font-size summary-icon" style="width:' + division[ratedCategoryCounter] + '%"><div class="icon icon-' + ClassNames(categ[k])
						+ '" ></div><div class="icon2Text">' + categ[k] + ' :' + i.match(/\d+/)[0] + '</div></div>';
				ratedCategoryCounter++;
			}
		}
	});
	if (catforsubcat != undefined && (subCategorySelected.length >= 1)) {
		summary += "<div class='summary-subcategory icon2Text'>Areas of Improvement in " + catforsubcat + ": " + subCategorySelected + "</div>"
	}
	if ($(".comment-text").val() != "") {
		summary += '<div class="summary-comments">Your Comments : ' + $(".comment-text").val().replace(/\r?\n/g, '<br/>') + '</div>';
	}
	$("#summary-details").append(summary);

}
// Email Screen

function Comments() {
	$(".comment-text").attr('placeholder', questions[0].placeholder);
	if ($(".comments").text() != questions[0].placeholder && $(".comments").text().indexOf("<div>") > -1) {
		$(".comment-text").val($(".comments").text());
	}
	// $(".comment-box").fadeIn();
	$(".comment-box").transition({
		x : '0%',
		y : '-240%',
		delay : animationDelay,
		duration : 400
	});
	$(".content-frame").css("opacity", "0.5");
	// $('.comment-text').focus();
}
function Submit() {
	var id = $("#emailTextBox").val();

	if (id) {
		var check;
		if (mailid) {
			check = true;
		} else {
			check = validateForm();
		}
		if (check) {
			SendFeedback();
			// $("body").find("img").css("height","100vh");
		}
	} else {
		SendFeedback();
	}

}
function validateForm() {
	var x = $("#emailTextBox").val();
	var atpos = x.indexOf("@");
	var dotpos = x.lastIndexOf(".");
	if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
		alert("Not a valid e-mail address");
		return false;
	} else {
		return true;
	}
}

$(document).ready(function() {
//	encyId = getParameterByName('id');
//	mailid = getParameterByName('mail');
//	$.ajax({
//		method : "POST",
//		url : geturl + "download/questions",
//		data : {
//			clientId : encyId
//		}
//	}).done(function(data) {
//		$("#overallQuestion1").text(data[0].overallQuestion1);
//		questions = data;
//	});
//	$.ajax({
//		method : "POST",
//		url : geturl + "download/thankyouimg",
//		data : {
//			clientId : encyId
//		}
//	}).done(function(data) {
//		$('#thankyou').attr('src', 'data:image/png;base64,' + data.thankyouimage + '');
//	});
//	$.ajax({
//		method : "POST",
//		url : geturl + "download/appcustom",
//		data : {
//			clientId : encyId
//		}
//	}).done(function(data) {
//		var head = document.getElementsByTagName('head')[0];
//		var link = document.createElement('link');
//		link.rel = 'stylesheet';
//		link.type = 'text/css';
//		link.href = 'css/' + data.selectedtheme + '.css'
//		link.media = 'all';
//		head.appendChild(link);
//		var head = document.getElementsByTagName('head')[0];
//		var link = document.createElement('link');
//		link.rel = 'stylesheet';
//		link.type = 'text/css';
//		link.href = 'css/main.css';
//		link.media = 'all';
//		head.appendChild(link);
//		$("body").css("font-family", data.selectedfont);
//		$(".done-comment").css("font-family", data.selectedfont + "-bold");
//		$("#thankyoumessage").html(data.thankingmsg);
//		roomNumber = data.roomNumber;
//	});
//	$.ajax({
//		method : "POST",
//		url : geturl + "download/survey",
//		data : {
//			clientId : encyId
//		}
//	}).done(function(data) {
//		subCategory = data;
//		category = data.category.split(',');
//	});
	$(".cancel-comment").click(function() {
		if ($(".comment-text").val() == "") {
			$(".comments").html(questions[0].commentsLabel);
			$(".comments_2").html(questions[0].commentsLabel);
			$(".comments").css('color', '#757575');
			$(".comments_2").css('color', '#757575');
			// $(".comment-box").fadeOut();
			$(".comment-box").transition({
				x : '0%',
				y : '200%',
				delay : animationDelay,
				duration : 400
			});
			$(".content-frame").css("opacity", "1");
		}
		$(".comment-box").transition({
			x : '0%',
			y : '200%',
			delay : animationDelay,
			duration : 400
		});
		// $(".content-frame").fadeIn();
		$(".content-frame").css("opacity", "1");

	});
	$("#next").click(function() {
		if (starValue != undefined) {
			animationDelay = 50;
			$(".screen_1_bar").each(function(index) {
				animationDelay = animationDelay + 50;
				$(this).transition({
					x : '-100%',
					y : '0%',
					delay : animationDelay,
					duration : 280
				});
			});
			$(".screen_2_bar").each(function(index) {
				animationDelay = animationDelay + 50;
				$(this).transition({
					x : '-100%',
					y : '0%',
					delay : animationDelay,
					duration : 280
				});
			});
		}
	});
	$(".done-comment").click(function() {
		if ($(".comment-text").val()) {
			var commentvalue = $(".comment-text").val();
			$(".comments_2").html(commentvalue.replace(/\r?\n/g, '<br/>'));
			$(".comments").html(commentvalue.replace(/\r?\n/g, '<br/>'));
			$(".comments").css('color', '#000');
			$(".comments_2").css('color', '#000');

			$(".comment-box").transition({
				x : '0%',
				y : '200%',
				delay : animationDelay,
				duration : 400
			});
			// $(".content-frame").fadeIn();
			$(".content-frame").css("opacity", "1");
		}
	});

	$(".comment-text").keyup(function() {
		if ($(".comment-text").val() == "") {
			$(".done-comment").css('color', '#757575');
			$(".done-comment").css('cursor', 'default');
		} else {
			$(".done-comment").css('color', '#303F9F');
			$(".done-comment").css('cursor', 'pointer');
		}
	});
	$('.close-summary').click(function() {
		$(".summary-text").transition({
			x : '0%',
			y : '-200%',
			delay : 10,
			duration : 400
		});
		$(".content-frame").css("opacity", "1");
	});
});

function CommentCheck() {
	if ($(".comment-text").val()) {
		var commentvalue = $(".comment-text").val();
		$(".comments_2").html(commentvalue.replace(/\r?\n/g, '<br/>'));
		$(".comments").html(commentvalue.replace(/\r?\n/g, '<br/>'));
		$(".comments").css('color', '#000');
		$(".comments_2").css('color', '#000');
	}
}

function SendFeedback() {
	$(".content-frame").hide();
	$("#thankyouDiv").show();
	var id = $("#emailTextBox").val();
	// feedback;
	var d = new Date();
	var n = d.toISOString();
	var date = n.substring(0, 10);
	var k = d.toTimeString();
	var time = k.substring(0, 9);
	var datetime = date + " " + time;
	for (var ijk = 0; ijk < subCategorySelected.length; ijk++) {
		subCategorySelected[ijk] = catforsubcat + "-" + subCategorySelected[ijk];
	}
	console.log($("#roomNumber").val());

	var result = {
		roomNo : $("#roomNumber").val(),
		Comments : $(".comment-text").val(),
		EmailID : id,
		Rating : starValue,
		subcat : subCategorySelected.toString(),
		deviceName : "WebSurvey",
		feedbackTime : datetime
	};
	console.log(result);
	Object.keys(feedback).forEach(function(k) {
		result["" + k.match(/\d+/)[0] + ""] = feedback["" + k + ""];
	});
	var uploadFeedback = [ result ];
	$.ajax({
		url : uploadFeedbackUrl,
		context : document.body,
		data : {
			feedBacks : JSON.stringify(uploadFeedback),
			clientId : encyId
		},
		// async : false,
		type : "POST",
		success : function(response) {
			//alert("Thank you for giving feedback");
		}
	}).fail(function() {
		alert("error");
	});
}
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
