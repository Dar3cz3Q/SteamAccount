// JavaScript Document
var steamid;

function alert() {
	for (alert = 0; alert < 100; alert++) {
		console.log(
			`There is nothing interesting here so you can leave the console (${alert})`
		);
	}
}

function start() {
	$("nav").slideUp(750);
	$(".form").slideDown({
			start: function () {
				$(this).css({
					display: "flex"
				});
			}
		},
		750
	);
}

function convertenter() {
	if (
		(event.which && event.which == 13) ||
		(event.keyCode && event.keyCode == 13)
	) {
		document.getElementById("convert").click();
		return false;
	} else {
		return true;
	}
}

function checkenter() {
	if (
		(event.which && event.which == 13) ||
		(event.keyCode && event.keyCode == 13)
	) {
		document.getElementById("check").click();
		return false;
	} else {
		return true;
	}
}

function convert() {
	var customurl = document.getElementById("customurl").value;
	if (customurl.replace(/ /g, "") === "") {
		$(".error_place").addClass("easychange_error");
		setTimeout(function () {
			$(".error_place").removeClass("easychange_error");
		}, 1000);
		$(".error_place").html(`<div class="error"><i class="icon-cancel-1"></i>&nbsp;PLEASE WRITE CUSTOM URL</div>`);
		$(".form_convert").addClass("error_input");
	} else {
		$(".convert_button_text").addClass("convert_button_text--clicked");
		$(".convert_button_text").html(
			`<i class="icon-spin5 spin animate-spin"></i>`
		);
		$(".convert_overlay").css("display", "block");
		$(".form_overlay").css("display", "block");
		$(".error_place").html(`<div class="error"></div>`);
		$.ajax({
			method: "GET",
			url: "apiconvert.php",
			contentType: "application/json",
			dataType: "JSON",
			data: {
				customurl: $("#customurl").val()
			},
			success: function (url) {
				urlsuccess(url);
			},
			error: function (url) {
				urlerror(url);
			}
		});

		function urlsuccess(url) {
			var steamidcheck = url.response.success;
			var steamiddownload = url.response.steamid;
			if (steamidcheck === 1) {
				$(".form_userid").removeClass("error_input");
				$(".form_userid").addClass("distraction");
				setTimeout(function () {
					$(".form_userid").removeClass("distraction");
				}, 300);
				document.getElementById("userid").value = steamiddownload;
				$(".convert_button_text").removeClass("convert_button_text--clicked");
				$(".convert_button_text").html(`<i class="icon-ok"></i>`);
				$(".convert_overlay").css("display", "none");
				$(".form_overlay").css("display", "none");
				$(".form_convert").removeClass("error_input");
			} else {
				$(".error_place").addClass("easychange_error");
				setTimeout(function () {
					$(".error_place").removeClass("easychange_error");
				}, 1000);
				$(".error_place").html(
					`<div class="error"><i class="icon-cancel-1"></i>&nbsp;ACCOUNT DOES NOT EXIST</div>`
				);
				$(".convert_button_text").removeClass("convert_button_text--clicked");
				$(".convert_button_text").html(`<i class="icon-ok"></i>`);
				$(".convert_overlay").css("display", "none");
				$(".form_overlay").css("display", "none");
				$(".form_convert").addClass("error_input");
			}
		}
	}
}

function submit() {
	var userid = document.getElementById("userid").value;
	if (userid.replace(/ /g, "") === "") {
		$(".error_place").addClass("easychange_error");
		setTimeout(function () {
			$(".error_place").removeClass("easychange_error");
		}, 1000);
		$(".error_place").html(`<div class="error"><i class="icon-cancel-1"></i>&nbsp;PLEASE WRITE USER ID</div>`);
		$(".form_userid").addClass("error_input");
	} else {
		$(".form_button_text").html(`<i class="icon-spin4 spin animate-spin">`);
		$(".error_place").html(`<div class="error"></div>`);
		$(".form_button_text").addClass("form_button_text--clicked");
		$(".form_overlay").css("display", "block");
		$(".convert_overlay").css("display", "block");
		grecaptcha.execute();
	}
}

function getStats() {
	$.ajax({
		method: "GET",
		url: "captcha.php",
		contentType: "application/json",
		dataType: "JSON",
		data: {
			responseKey: grecaptcha.getResponse()
		},
		success: function (res) {
			captchasuccess(res);
		},
		error: function (res) {
			captchaerror(res);
		}
	});
}

function captchasuccess() {
	$.ajax({
		method: "GET",
		url: "apiplayer.php",
		data: {
			user: $("#userid").val()
		},
		contentType: "application/json",
		dataType: "JSON",
		success: function (dataplayer) {
			resultssuccess(dataplayer),
				steamid = (dataplayer.response.players[0].steamid);
		},
		error: function (dataplayer) {
			resultserror(dataplayer);
		}
	});
}

function resultssuccess(dataplayer) {
	var userid = parseInt(dataplayer.response.players.length);
	if (userid === 0) {
		grecaptcha.reset();
		$(".error_place").addClass("easychange_error");
		setTimeout(function () {
			$(".error_place").removeClass("easychange_error");
		}, 1000);
		$(".error_place").html(`<div class="error"><i class="icon-cancel-1"></i>&nbsp;ACCOUNT DOES NOT EXIST</div>`);
		$(".form_button_text").removeClass("form_button_text--clicked");
		$(".form_button_text").html(`<i class="icon-ok"></i>`);
		$(".form_userid").addClass("error_input");
		$(".form_overlay").css("display", "none");
		$(".convert_overlay").css("display", "none");

		document.getElementsByClassName('load_progress')[0].value = "0";
	} else {
		var loadprogress_place = document.querySelector('header'),
			loadprogress = document.createElement('progress');

		loadprogress.classList.add('load_progress');
		loadprogress.value = 5;
		loadprogress.max = 100;

		loadprogress_place.appendChild(loadprogress);
		$(".form_userid").removeClass("error_input");
		var steamid = dataplayer.response.players[0].steamid;

		document.getElementsByClassName('load_progress')[0].value = "10";
		$.ajax({
			method: "GET",
			url: "apilevel.php",
			data: {
				user: steamid
			},
			contentType: "application/json",
			dataType: "JSON",
			success: function (datalevel) {
				resultsuccess(datalevel);
			},
			error: function (datalevel) {
				resulterror(datalevel);
			}
		});

		document.getElementsByClassName('load_progress')[0].value = "20";

		function resultsuccess(datalevel) {
			$.ajax({
				method: "GET",
				url: "apirecentlygames.php",
				data: {
					user: steamid
				},
				contentType: "application/json",
				dataType: "JSON",
				success: function (recentlygames) {
					resultsuccess(recentlygames);
				},
				error: function (recentlygames) {
					resulterror(recentlygames);
				}
			});

			document.getElementsByClassName('load_progress')[0].value = "30";

			function resultsuccess(recentlygames) {
				$.ajax({
					method: "GET",
					url: "apigames.php",
					data: {
						user: steamid
					},
					contentType: "application/json",
					dataType: "JSON",
					success: function (datagames) {
						resultsuccess(datagames);
						console.log(datagames);
					},
					error: function (datagames) {
						resultserror(datagames);
						console.log(datagames);
					}
				});

				document.getElementsByClassName('load_progress')[0].value = "40";

				function resultsuccess(datagames) {
					$.ajax({
						method: "GET",
						url: "apifriends.php",
						data: {
							user: steamid
						},
						contentType: "application/json",
						dataType: "JSON",
						success: function (datafriends) {
							resultsuccess(datafriends);
						},
						error: function (datafriends) {
							resulterror(datafriends);
						}
					});

					document.getElementsByClassName('load_progress')[0].value = "50";

					function resultsuccess(datafriends) {
						$.ajax({
							method: "GET",
							url: "apibans.php",
							data: {
								user: steamid
							},
							contentType: "application/json",
							dataType: "JSON",
							success: function (databans) {
								resultsuccess(databans);
							},
							error: function (databans) {
								resulterror(databans);
							}
						});

						document.getElementsByClassName('load_progress')[0].value = "60";

						function resultsuccess(databans) {
							$.ajax({
								method: "GET",
								url: "steamlocation.php",
								data: {},
								contentType: "application/json",
								dataType: "JSON",
								success: function (datalocation) {
									resultsuccess(datalocation);
								},
								error: function (datalocation) {
									resulterror(datalocation);
								}
							});

							document.getElementsByClassName('load_progress')[0].value = "70";

							function resultsuccess(datalocation) {
								var nickname = dataplayer.response.players[0].personaname,
									realname = dataplayer.response.players[0].realname,
									state = dataplayer.response.players[0].personastate,
									avatar = dataplayer.response.players[0].avatarmedium,
									avataricon = dataplayer.response.players[0].avatar,
									profileurl = dataplayer.response.players[0].profileurl,
									countrycode = dataplayer.response.players[0].loccountrycode,
									locstatecode = dataplayer.response.players[0].locstatecode,
									citycode = dataplayer.response.players[0].loccityid,
									primaryclan = dataplayer.response.players[0].primaryclanid,
									lastlogoffcode = dataplayer.response.players[0].lastlogoff,
									acreated = dataplayer.response.players[0].timecreated,
									visibility =
									dataplayer.response.players[0].communityvisibilitystate,
									commentper =
									dataplayer.response.players[0].commentpermission,
									game = dataplayer.response.players[0].gameextrainfo,
									ownedgamescount = datagames.response.game_count,
									gameipcode = dataplayer.response.players[0].gameserverip,
									badges = datalevel.response.badges.length,
									levelcount = datalevel.response.player_level,
									levelpoints = datalevel.response.player_xp,
									nextlevel = datalevel.response.player_xp_needed_to_level_up;

								document.getElementsByClassName('load_progress')[0].value = "80";

								function datestamp(acreated) {
									var months_arr = [
										"Jan",
										"Feb",
										"Mar",
										"Apr",
										"May",
										"Jun",
										"Jul",
										"Aug",
										"Sep",
										"Oct",
										"Nov",
										"Dec"
									];
									var date = new Date(acreated * 1000);
									var year = date.getFullYear();
									var month = months_arr[date.getMonth()];
									var day = date.getDate();
									var hours = date.getHours();
									var minutes = "0" + date.getMinutes();
									var seconds = "0" + date.getSeconds();
									return (
										month +
										"-" +
										day +
										"-" +
										year +
										" " +
										hours +
										":" +
										minutes.substr(-2) +
										":" +
										seconds.substr(-2)
									);
								}
								if (levelcount === undefined) {
									var level = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`,
										points = "";
								} else {
									var level = `<span class="tile_info easychange">Level:&nbsp;${levelcount}</span>`,
										levelneed = nextlevel + levelpoints,
										points = `<span class="tile_info--sub easychange">${levelpoints}&nbsp;XP&nbsp;/&nbsp;${levelneed}&nbsp;XP</span><span class="tile_info--sub points_sub easychange">Need:&nbsp;${nextlevel}&nbsp;XP&nbsp;to&nbsp;next&nbsp;level</span>`;
								}
								if (acreated === undefined) {
									var createdtime = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
								} else {
									var createdtime = `<span>Created:&nbsp;${datestamp(
                    acreated
                  )}</span>`;
								}
								if (lastlogoffcode === undefined) {
									var logoff = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
								} else {
									var logoff = `<span>Last log off:&nbsp;${lastlogoffcode}</span>`;
								}
								if (primaryclan === undefined) {
									var primaryclanid = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
								} else {
									var primaryclanid = `<span>Clan ID:&nbsp;${primaryclan}</span>`;
								}
								if (game != undefined) {
									var avataroverlay = "avatar_Ingame",
										usernameoverlay = "text_Ingame",
										state = `<span class="tile_info currently_game easychange">${game}</span>`;
									if (gameipcode != undefined) {
										var gameip = `<span class="tile_info--sub gameip easychange">${gameipcode}</span>`;
									} else if (gameip === "0.0.0.0:0") {
										var gameip = `<span class="tile_info--sub gameip easychange">Official Steam Server</span>`;
									} else {
										var gameip = `<span class="tile_info--sub gameip private_content easychange"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
									}
								} else {
									var gameip = "";
									switch (state) {
										case 0:
											var state = `<span class="text_Offline">Offline&nbsp;<i class="icon-toggle-off"></i></span>`,
												avataroverlay = "avatar_Offline",
												usernameoverlay = "text_Offline";
											break;
										case 1:
											var state = `<span class="text_Online">Online&nbsp;<i class="icon-toggle-on"></i></span>`,
												avataroverlay = "avatar_Online",
												usernameoverlay = "text_Online";
											break;
										case 2:
											var state = `<span class="text_Busy">Busy&nbsp;<i class="icon-bell-off"></i></span>`,
												avataroverlay = "avatar_Busy",
												usernameoverlay = "text_Busy";
											break;
										case 3:
											var state = `<span class="text_Away">Away</span>`,
												avataroverlay = "avatar_Away",
												usernameoverlay = "text_Away";
											break;
										case 4:
											var state = `<span class="text_Snooze">Snooze<i class="icon-moon-inv"></i></span>`,
												avataroverlay = "avatar_Snooze",
												usernameoverlay = "text_Snooze";
											break;
										case 5:
											var state = `<span class="text_Looktotrade">Looking to trade</span>`,
												avataroverlay = "avatar_Looktotrade",
												usernameoverlay = "text_Looktotrade";
											break;
										case 6:
											var state = `<span class="text_Looktoplay">Looking to play</span>`,
												avataroverlay = "avatar_Looktoplay",
												usernameoverlay = "text_Looktoplay";
											break;
									}
								}
								if (avatar === undefined) {
									var avatarshow = '';
								} else {
									var avatarshow = `<img class="avatar ${avataroverlay}" src="${avatar}"></img>`;
								}
								if (realname === undefined) {
									var nick = `<span class="nick tile_info easychange_first"><a class="link ${usernameoverlay} easychange_first" href="${profileurl}" target="_blank"><i class="icon-user"></i>&nbsp;${nickname}</a></span>`,
										name = `<span class="nick tile_info--sub easychange"><a class="link" href="${profileurl}" target="_blank"><span class="link private_content easychange"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span></a></span>`;
								} else {
									var nick = `<span class="nick tile_info easychange_first"><a class="link ${usernameoverlay} easychange_first" href="${profileurl}" target="_blank"><i class="icon-user"></i>&nbsp;${nickname}</a></span>`,
										name = `<span class="nick tile_info--sub easychange"><a class="link ${usernameoverlay} easychange" href="${profileurl}" target="_blank"><i class="icon-user"></i>&nbsp;${realname}</a></span>`;
								}
								switch (visibility) {
									case 1:
										var visibility = `<span>Profile:&nbsp;<i class="icon-user-1"></i>&nbsp;Private</span>`;
										break;
									case 2:
										var visibility = `<span>Profile:&nbsp;<i class="icon-user-times"></i>&nbsp;Friends Only</span>`;
										break;
									case 3:
										var visibility = `<span>Profile:&nbsp;<i class="icon-user-plus"></i>&nbsp;Public</span>`;
										break;
								}
								switch (commentper) {
									case 1:
										var commentper = `<span>Commenting:&nbsp;<i class="icon-user-plus"></i>&nbsp;Public</span>`;
										break;
									case 2:
										var commentper = `<span>Commenting:&nbsp;<i class="icon-user-1"></i>&nbsp;Private</span>`;
										break;
									case 3:
										var commentper = `<span>Commenting:&nbsp;<i class="icon-user-times"></i>&nbsp;Friends Only</span>`;
										break;
									case undefined:
										var commentper = `<span>Commenting:&nbsp;<i class="icon-users-1"></i>&nbsp;Private or Friends Only</span>`;
										break;
								}
								if (countrycode === undefined) {
									var countryname = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`,
										countrycoords = "";
								} else {
									var countrynamedecode = datalocation[countrycode]["name"],
										countrycoordsdecode =
										datalocation[countrycode]["coordinates"],
										countryname = `<span class="tile_info easychange"><i class="icon-location"></i>&nbsp;Country:&nbsp;${countrynamedecode}</span>`,
										countrycoords = `<span class="tile_info--sub easychange"><i class="icon-location"></i>&nbsp;${countrycoordsdecode}</span>`;
								}
								if (locstatecode === undefined) {
									var locstatename = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`,
										locstatecoords = "";
								} else {
									var locstatenamedecode =
										datalocation[countrycode]["states"][locstatecode]["name"],
										locstatecoordsdecode =
										datalocation[countrycode]["states"][locstatecode][
											"coordinates"
										],
										locstatename = `<span class="tile_info easychange"><i class="icon-location"></i>&nbsp;State:&nbsp;${locstatenamedecode}</span>`,
										locstatecoords = `<span class="tile_info--sub easychange"><i class="icon-location"></i>&nbsp;${locstatecoordsdecode}</span>`;
								}
								if (citycode === undefined) {
									var cityname = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`,
										citycoords = "";
								} else {
									var citynamedecode =
										datalocation[countrycode]["states"][locstatecode]["cities"][
											citycode
										]["name"],
										citycoordsdecode =
										datalocation[countrycode]["states"][locstatecode]["cities"][
											citycode
										]["coordinates"],
										cityname = `<span class="tile_info easychange"><i class="icon-location"></i>&nbsp;City:&nbsp;${citynamedecode}</span>`,
										citycoords = `<span class="tile_info--sub easychange"><i class="icon-location"></i>&nbsp;${citycoordsdecode}</span>`;
								}
								if (ownedgamescount != undefined) {
									var ownedgames = `<span class="tile_info easychange"><i class="icon-gamepad"></i>&nbsp;Games:&nbsp;${ownedgamescount}</span>`,
										playedtimecode = 0;
									for (var i = 0; i < ownedgamescount; i++) {
										playedtimecode =
											playedtimecode +
											datagames.response.games[i].playtime_forever;
									}
									var playedtime = playedtimecode / 60,
										playedtimenumbered =
										playedtime.toFixed(0) + "&nbsp;hours",
										playedtimeforever = `<span class="tile_info--sub easychange"><i class="icon-gamepad"></i>&nbsp;Played:&nbsp;${playedtimenumbered}</span>`;
								} else {
									var ownedgames = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`,
										playedtimeforever = "";
								}
								var friendsresponse = datafriends.friendslist;
								if (friendsresponse === undefined) {
									var friends = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
								} else {
									var friendscount = datafriends.friendslist.friends.length,
										friends = `<span><i class="icon-group"></i>&nbsp;Friends:&nbsp;${friendscount}</span>`;
								}
								var vacstatus = databans.players[0].NumberOfVACBans,
									vacstatusdate = databans.players[0].DaysSinceLastBan,
									communitystatus = databans.players[0].NumberOfGameBans;
								if (vacstatus > 0) {
									var vacbans = `<span class="tile_info banned easychange">VAC Bans:&nbsp;${vacstatus}&nbsp;|&nbsp;${vacstatusdate}&nbsp;days&nbsp;ago</span>`;
								} else {
									var vacbans = `<span class="tile_info easychange">VAC Bans:&nbsp;${vacstatus}</span>`;
								}
								if (communitystatus > 0) {
									var combans = `<span class="tile_info--sub banned easychange">Community Bans:&nbsp;${communitystatus}</span>`;
								} else {
									var combans = `<span class="tile_info--sub easychange">Community Bans:&nbsp;${communitystatus}</span>`;
								}
								if (badges === undefined) {
									var badgescount = `<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`;
								} else {
									var badgescount = `<span><i class="icon-id-badge"></i>&nbsp;Badges:&nbsp;${badges}</span>`;
								}
								var p = 0;
								$.each(datagames.response.games, function (i, item) {
									var played_count = item.playtime_forever;
									if (played_count > 0) {
										suma = p++;
									} else {}
								});
								var playedgames_count = suma,
									playedgames_percentage_count =
									(playedgames_count / ownedgamescount) * 100,
									playedgames_percentage = playedgames_percentage_count.toFixed(
										0
									);

								document.getElementsByClassName('load_progress')[0].value = "90";
								$(".form").slideUp(1500);
								$(".change").slideDown({
										start: function () {
											$(this).css({
												display: "flex"
											});
										}
									},
									1500
								);
								if (avataricon === undefined) {
									ocument.head.innerHTML = '';
								} else {
									document.head.innerHTML = `<link rel="apple-touch-icon" sizes="57x57" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="60x60" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="72x72" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="76x76" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="114x114" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="120x120" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="144x144" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="152x152" href="${avataricon}">
	<link rel="apple-touch-icon" sizes="180x180" href="${avataricon}">
	<link rel="icon" type="image/png" sizes="192x192"  href="${avataricon}">
	<link rel="icon" type="image/png" sizes="32x32" href="${avataricon}">
	<link rel="icon" type="image/png" sizes="96x96" href="${avataricon}">
	<link rel="icon" type="image/png" sizes="16x16" href="${avataricon}">`
								}
								document.title = `${nickname} - ${steamid}`;
								$(".change").html(
									`
<div class="title animated_items"><span>${avatarshow}&nbsp;${steamid}</span></div>
					<div class="account_infos">
						<div class="tile animated_items">${nick}${name}</div>
						<div class="tile animated_items">${level}${points}</div>
						<div class="tile animated_items">${state}${gameip}</div>
						<div class="tile animated_items">${countryname}${countrycoords}</div>
						<div class="tile animated_items">${locstatename}${locstatecoords}</div>
						<div class="tile animated_items">${cityname}${citycoords}</div>
						<div class="tile animated_items">${visibility}</div>
						<div class="tile animated_items">${commentper}</div>
						<div class="tile animated_items">${logoff}</div>
						<div class="tile animated_items">${ownedgames}${playedtimeforever}</div>
						<div class="tile animated_items">${vacbans}${combans}</div>
						<div class="tile animated_items">${friends}</div>
						<div class="tile animated_items">${badgescount}</div>
						<div class="tile animated_items">${primaryclanid}</div>
						<div class="tile animated_items">${createdtime}</div>
					</div>
					<div class="subtitle recently animated_items"><span>Recently played games</span></div>
					<div class="recently_played_games games animated_items"></div>
					<div class="subtitle owned animated_items"><span>Owned games</span></div>
					<div class="progress_section animated_items">
						<span>
							<span class="progress_info">Games:&nbsp;${ownedgamescount}</span>
							<span class="separator">&nbsp;|&nbsp;</span>
							<span class="progress_info">Played:&nbsp;${playedgames_count}</span>
							<span class="separator">&nbsp;|&nbsp;</span>
							<span class="progress_info">${playedgames_percentage}&nbsp;%</span>
						</span><br>
						<progress class="game_progress" value="${playedgames_count}" max="${ownedgamescount}"></progress>
					</div>
          <div class="owned_games games animated_items"></div>
			<div class="subtitle game_stats animated_items"><span title="Descriptions and values may not match">Check Statistics:</span></div>
			<div class="game_select animated_items">
			<select class="select_game" onchange="getGameStats()"></select>
		</div>
<div class="stats_for_game stats animated_items--without_delay"></div>
<div class="subtitle game_achievements animated_items"><span title="Descriptions and values may not match">Check Achievements:</span></div>
			<div class="game_select animated_items">
			<select class="select_game" onchange="getAchievements()"></select>
		</div>
<div class="achievements_progress animated_items--without_delay"></div>
<div class="achievements_for_game achievements animated_items--without_delay"></div>`
								);
								$(".feedback_button").css("display", "inline-block");
								document.getElementsByClassName('load_progress')[0].value = "95";
								var recentlyplayed = recentlygames.response.games;
								if (recentlyplayed === undefined) {
									$(".recently").html(
										`<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`
									);
								} else {
									$.each(recentlygames.response.games, function (i, item) {
										var appid = item.appid,
											gamename = item.name,
											playtimetwoweeks = item.playtime_2weeks,
											playtimeever = item.playtime_forever,
											image = item.img_icon_url;
										if (playtimetwoweeks < 60) {
											if (playtimetwoweeks === 1) {
												var playtimeweekfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimetwoweeks.toFixed(0) + "&nbsp;minute";
											} else if (playtimetwoweeks === 0) {
												var playtimeweekfix = `<span class="never"><i class="icon-attention"></i>&nbsp;Never</span>`;
											} else {
												var playtimeweekfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimetwoweeks.toFixed(0) + "&nbsp;minutes";
											}
										} else {
											var playtimeweek = playtimetwoweeks / 60;
											if (playtimeweek < 9) {
												if (playtimeweek === 1) {
													var playtimeweekfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeweek.toFixed(1) + "&nbsp;hour";
												} else {
													var playtimeweekfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeweek.toFixed(1) + "&nbsp;hours";
												}
											} else {
												var playtimeweekfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeweek.toFixed(0) + "&nbsp;hours";
											}
										}
										if (playtimeever < 60) {
											if (playtimeever === 1) {
												var playtimeforeverfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeever.toFixed(0) + "&nbsp;minute";
											} else if (playtimeever === 0) {
												var playtimeforeverfix = `<span class="never"><i class="icon-attention"></i>&nbsp;Never</span>`;
											} else {
												var playtimeforeverfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeever.toFixed(0) + "&nbsp;minutes";
											}
										} else {
											var playtimeforever = playtimeever / 60;
											if (playtimeforever < 9) {
												if (playtimeforever === 1) {
													var playtimeforeverfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeforever.toFixed(1) + "&nbsp;hour";
												} else {
													var playtimeforeverfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeforever.toFixed(1) + "&nbsp;hours";
												}
											} else {
												var playtimeforeverfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeforever.toFixed(0) + "&nbsp;hours";
											}
										}
										$(".recently_played_games").append(
											`<div class="game">
							<img alt="Image" class="game_image" src="http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${image}.jpg">
							<span><a class="game_name link" href="https://steamcommunity.com/app/${appid}" target="_blank"><i class="icon-link"></i>&nbsp;${gamename}</a><span>
							<span class="separator">&nbsp;-&nbsp;</span>
							<span class="time">Last two weeks:&nbsp;${playtimeweekfix}</span>
							<span class="separator">&nbsp;|&nbsp;</span>
							<span class="time">Forever:&nbsp;${playtimeforeverfix}</span>
						</div>`
										);
									})
								};
								var ownedgamesall = datagames.response;
								if (ownedgamesall === undefined) {
									$(".owned").html(
										`<span class="private_content"><i class="icon-minus-circle"></i>Private data<i class="icon-minus-circle"></i></span>`
									);
									$(".select_game").html(
										`<option value="0" selected disabled>Games not available</option>`
									);
								} else {
									$(".select_game").html(
										`<option value="0" selected disabled>Select game</option>`
									);
									$.each(datagames.response.games, function (i, item) {
										var appidall = item.appid,
											gamenameall = item.name;

										$(".select_game").append(
											`<option value="${appidall}">${gamenameall}</option>`
										);

									})
									$.each(datagames.response.games, function (i, item) {
										var appidall = item.appid,
											gamenameall = item.name,
											playtimeeverall = item.playtime_forever,
											imageall = item.img_logo_url;
										if (playtimeeverall < 60) {
											if (playtimeeverall === 1) {
												var playtimeforeverallfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeeverall.toFixed(0) + "&nbsp;minute";
											} else if (playtimeeverall === 0) {
												var playtimeforeverallfix = `<span class="never"><i class="icon-attention"></i>&nbsp;Never</span>`;
											} else {
												var playtimeforeverallfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeeverall.toFixed(0) + "&nbsp;minutes";
											}
										} else {
											var playtimeforeverall = playtimeeverall / 60;
											if (playtimeforeverall < 9) {
												if (playtimeforeverall === 1) {
													var playtimeforeverallfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeforeverall.toFixed(1) + "&nbsp;hour";
												} else {
													var playtimeforeverallfix = `<i class="icon-clock"></i>&nbsp;` +
														playtimeforeverall.toFixed(1) + "&nbsp;hours";
												}
											} else {
												var playtimeforeverallfix = `<i class="icon-clock"></i>&nbsp;` +
													playtimeforeverall.toFixed(0) + "&nbsp;hours";
											}
										}
										$(".owned_games").append(
											`<div class="game">
							<img alt="Image" class="game_image"src="http://media.steampowered.com/steamcommunity/public/images/apps/${appidall}/${imageall}.jpg">
							<span><a class="game_name link" href="https://steamcommunity.com/app/${appidall}" target="_blank"><i class="icon-link"></i>&nbsp;${gamenameall}</a><span>
							<span class="separator">&nbsp;-&nbsp;</span>
							<span class="time">${playtimeforeverallfix}</span>
						</div>`
										);
									});
								}

								document.getElementsByClassName('load_progress')[0].value = "100";
								setTimeout(function () {
									var loadprogress_place = document.querySelector('header');
									var loadprogress = document.getElementsByClassName('load_progress')[0];
									loadprogress.remove();
								}, 1400);
								setTimeout(function pagesetup() {
									var article = document.getElementsByClassName("change")[0],
										readprogressplace = document.querySelector('header'),
										windowHeight = window.innerHeight,
										articleHeight = article.clientHeight,
										maxScroll = (articleHeight - windowHeight) + 100,
										progress = document.createElement('progress');

									progress.classList.add('page_progress');
									progress.value = 0;
									progress.max = maxScroll;

									readprogressplace.appendChild(progress);

									var calculateProgress = function () {
										progress.value = window.scrollY;
									};

									var throttle = function (callback, limit) {
										var wait = false;
										return function () {
											if (!wait) {
												callback();
												wait = true;
												setTimeout(function () {
													wait = false;
												}, limit);
											}
										};
									};

									var debounce = function (callback, time) {
										var timeout;
										return function () {
											var context = this,
												args = arguments;
											clearTimeout(timeout);
											timeout = setTimeout(function () {
												callback.apply(context, args);
											}, time || 200);
										};
									};

									window.addEventListener('scroll', throttle(calculateProgress, 100));
									window.addEventListener('scroll', debounce(calculateProgress, 200));
								}, 1505);
							}
							setTimeout(function () {
								$(".logo").html(`<a href="https://steamaccount.ml/" title="Back to the main page"><div class="logo-banner"></div></a>`);
							}, 6000);

						}
					}
				}
			}
		}
	}
}

function getGameStats() {
	$(".stats").slideDown("slow");
	$(".stats").addClass("loading");
	$(".stats").html('<i class="icon-spin6 spin animate-spin">');
	var gameid = document.getElementsByClassName("select_game")[0].value;
	$.ajax({
		method: "GET",
		url: "apigamestats.php",
		data: {
			user: steamid,
			appid: gameid,
		},
		contentType: "application/json",
		dataType: "JSON",
		success: function (gamestats) {
			resultsuccess(gamestats);
			console.log(gamestats);
		},
		error: function (gamestats) {
			resulterror(gamestats);
			console.log(gamestats);
		}
	});

	function resultsuccess(gamestats) {
		$.ajax({
			method: "GET",
			url: "apigameshema.php",
			data: {
				appid: gameid,
			},
			contentType: "application/json",
			dataType: "JSON",
			success: function (gamestatsshema) {
				resultsuccess(gamestatsshema);
				console.log(gamestatsshema);
			},
			error: function (gamestatsshema) {
				resulterror(gamestatsshema);
				console.log(gamestatsshema);
			}
		});

		function resultsuccess(gamestatsshema) {
			var playerstat = gamestats;
			if (playerstat === null) {
				$(".stats").removeClass("loading");
				$(".stats").html('<div class="error"><i class="icon-cancel-1"></i>&nbsp;Requested app has no stats</div>');
			} else {
				$(".stats").html('');
				$(".stats").removeClass("loading");
				var gamestat = gamestats.playerstats.stats,
					gamestatshema = gamestatsshema.game.availableGameStats.stats,
					gamestatfull = _.zip(gamestat, gamestatshema);
				$.each(gamestatfull, function (i, item) {
					var statval = item[0].value,
						statcode = item[0].name,
						statname = item[1].displayName,
						nodata;
					if (statcode === undefined) {
						var statcode = `No data about code`,
							nodata = 'no_available_data';
					} else {}
					if (statname === undefined) {
						var statname = `No data about name`,
							nodata = 'no_available_data';
					} else if (statname === '') {
						var statname = `No data about name`,
							nodata = 'no_available_data';
					} else {}
					$(".stats").append(
						`<div class="game animated_items--without_delay" code="${statcode}">
						<span>
							<span class="stat_name ${nodata}">${statname}</span>
							<span>
								<span class="separator">&nbsp;-&nbsp;</span>
								<span class="stat_value">${statval}</span>
							</span>
						</span>
						</div>`
					);
				})
				var statsvalue = document.getElementsByClassName("stats")[0].value;
				if (statsvalue === '') {
					$(".stats").html('<div class="error"><i class="icon-cancel-1"></i>&nbsp;Requested app has no stats</div>');
				} else {}
			};
		}
	}
	setTimeout(function () {
		var maxScroll = (articleHeight - windowHeight) + 100;
	}, 2000);
}

function getAchievements() {
	$(".achievements").slideDown("slow");
	$(".achievements").addClass("loading");
	$(".achievements_progress").html('');
	$(".achievements").html('<i class="icon-spin6 spin animate-spin">');
	var gameid = document.getElementsByClassName("select_game")[1].value;
	$.ajax({
		method: "GET",
		url: "apigamesachievements.php",
		data: {
			user: steamid,
			appid: gameid,
		},
		contentType: "application/json",
		dataType: "JSON",
		success: function (gameachievements) {
			resultsuccess(gameachievements);
			console.log(gameachievements);
		},
		error: function (gameachievements) {
			resulterror(gameachievements);
			console.log(gameachievements);
		}
	});

	function resultsuccess(gameachievements) {
		$.ajax({
			method: "GET",
			url: "apigameshema.php",
			data: {
				appid: gameid,
			},
			contentType: "application/json",
			dataType: "JSON",
			success: function (gameachievementsshema) {
				resultsuccess(gameachievementsshema);
				console.log(gameachievementsshema);
			},
			error: function (gameachievementsshema) {
				resulterror(gameachievementsshema);
				console.log(gameachievementsshema);
			}
		});

		function resultsuccess(gameachievementsshema) {
			var playerachievement = gameachievements.playerstats.success;
			if (playerachievement === false) {
				$(".achievements").removeClass("loading");
				var playerachievementerrorcode = gameachievements.playerstats.error;
				$(".achievements_progress").html('');
				$(".achievements").html(`<div class="error"><i class="icon-cancel-1"></i>&nbsp;${playerachievementerrorcode}</div>`);
			} else {
				var a = 0;
				$.each(gameachievements.playerstats.achievements, function (i, item) {
					var achieved_count = item.achieved;
					if (achieved_count === 1) {
						suma = a++;
					} else {}
				});
				var achievements_count = gameachievements.playerstats.achievements.length,
					achievedgames_count = suma + 1,
					achievedgames_percentage_count =
					(achievedgames_count / achievements_count) * 100,
					achievedgames_percentage = achievedgames_percentage_count.toFixed(
						0
					);
				$(".achievements").html('');
				$(".achievements").removeClass("loading");
				var gameachievement = gameachievementsshema.game.availableGameStats.achievements,
					gameachievementshema = gameachievements.playerstats.achievements,
					gameachievementfull = _.zip(gameachievement, gameachievementshema);
				$(".achievements_progress").html('');
				$(".achievements_progress").slideDown("slow");
				$(".achievements_progress").html(`<div class="progress_section animated_items--without_delay">
						<span>
							<span class="progress_info">Achievements:&nbsp;${achievements_count}</span>
							<span class="separator">&nbsp;|&nbsp;</span>
							<span class="progress_info">Achieved:&nbsp;${achievedgames_count}</span>
							<span class="separator">&nbsp;|&nbsp;</span>
							<span class="progress_info">${achievedgames_percentage}&nbsp;%</span>
						</span><br>
						<progress class="game_progress" value="${achievedgames_count}" max="${achievements_count}"></progress>
					</div>`);
				$.each(gameachievementfull, function (i, item) {
					var achievvalcode = item[1].achieved,
						achievcode = item[1].apiname,
						achievtime = item[1].unlocktime,
						achiev = item[0].displayName,
						achievdesc = item[0].description,
						nodata = '';
					if (achievcode === undefined) {
						var achievcode = `No data about code`;
					} else {}
					if (achievtime === undefined) {
						var achievtime = `No data about unlock time`;
					} else {}
					if (achiev === undefined) {
						var achiev = `No data about name`,
							nodata = 'no_available_data';

					} else if (achiev === '') {
						var achiev = `No data about name`,
							nodata = 'no_available_data';
					} else {}
					if (achievdesc === undefined) {
						var achievdesc = `No data about description`;
					}
					switch (achievvalcode) {
						case 0:
							var achievval = `<span class="achievement_locked">Locked</span>`;
							break;
						case 1:
							var achievval = `<span class="achievement_unlocked" title="Unlocked:&nbsp;${achievtime}">Unlocked</span>`;
							break;
					}
					if (achievvalcode === 1) {
						var achievimg = item[0].icon,
							achievimgoverlay = 'game_shame--unlocked';
					} else {
						var achievimg = item[0].icongray,
							achievimgoverlay = 'game_shame--locked';
					}
					$(".achievements").append(
						`<div class="game animated_items--without_delay" code="${achievcode}">
							<img alt="Image" class="${achievimgoverlay}" src="${achievimg}">
							<span class="achievement_name ${nodata}" title="${achievdesc}">${achiev}</span>
							<span class="separator">&nbsp;-&nbsp;</span>
							${achievval}
						</div>`
					);
				});
			}
		}
	}
	setTimeout(function () {
		var maxScroll = (articleHeight - windowHeight) + 100;
	}, 3000);
}

function resulterror(gamestats, gamestatsshema) {
	$(".stats").html('<div class="error"><i class="icon-cancel-1"></i>&nbsp;SOMETHING GONE WRONG. TRY AGAIN LATER</div>');
}

function resulterror(gameachievements, gameachievementsshema) {
	$(".achievements").html('<div class="error"><i class="icon-cancel-1"></i>&nbsp;SOMETHING GONE WRONG. TRY AGAIN LATER</div>');
}

function captchaerror(res) {
	console.log(res);
	grecaptcha.reset();
	$(".error_place").addClass("easychange_error");
	setTimeout(function () {
		$(".error_place").removeClass("easychange_error");
	}, 1000);
	$(".form_button_text").removeClass("form_button_text--clicked");
	$(".form_button_text").html(`<i class="icon-ok"></i>`);
	$(".form_overlay").css("display", "none");
	$(".convert_overlay").css("display", "none");
	$(".error_place").html(
		`<div class="error"><i class="icon-cancel-1"></i>&nbsp;INCORRECLTY FILLED RECAPTCHA</div>`
	);
}

function resultserror(
	dataplayer,
	datagames,
	datafriends,
	databans,
	recentlygames,
	datalevel,
	datalocation
) {
	$(".error_place").addClass("easychange_error");
	setTimeout(function () {
		$(".error_place").removeClass("easychange_error");
	}, 1000);
	grecaptcha.reset();
	$(".form_button_text").removeClass("form_button_text--clicked");
	$(".form_userid").addClass("error_input");
	$(".form_button_text").html(`<i class="icon-ok"></i>`);
	$(".form_overlay").css("display", "none");
	$(".convert_overlay").css("display", "none");
	$(".error_place").html(
		`<div class="error"><i class="icon-cancel-1"></i>&nbsp;SOMETHING GONE WRONG. THE REASON MAY BE INCORRECTLY ENTERED SteamID64</div>`
	);
}

function urlerror(url) {
	$(".error_place").addClass("easychange_error");
	setTimeout(function () {
		$(".error_place").removeClass("easychange_error");
	}, 1000);
	$(".error_place").html(
		`<div class="error"><i class="icon-cancel-1"></i>&nbsp;SOMETHING GONE WRONG. THE REASON MAY BE INCORRECTLY ENTERED CUSTOM URL</div>`
	);
	$(".form_convert").addClass("error_input");
	$(".form_overlay").css("display", "none");
	$(".convert_overlay").css("display", "none");
}

function help() {
	if ($(".help_text").is(":hidden")) {
		$(".help_text").slideDown("slow");
		$(".help_button_frame").html(
			`<div class="help_button" onClick="help()">Now I Can Find It</div>`
		);
	} else {
		$(".help_text").slideUp("slow");
		$(".help_text").slideUp("slow");
		$(".help_button_frame").html(
			`<div class="help_button" onClick="help()">Can't Find My SteamID64</div>`
		);
	}
}

function feedback() {
	$(".animated_items").addClass("showed_items");
	$(".showed_items").removeClass("animated_items");
	if ($(".change").is(":hidden")) {
		$(".change").slideDown("slow");
		$(".feedback_form").slideUp({
				start: function () {
					$(this).css({
						display: "flex"
					});
				}
			},
			4000
		);
		$(".feedback_button").html(`<i class="icon-chat" title="Send feedback (not ready)"></i>`);
		$(".page_progress").removeClass("page_progress--hide");
	} else {
		$(".change").slideUp({
				start: function () {
					$(this).css({
						display: "flex"
					});
				}
			},
			4000
		);
		$(".feedback_form").slideDown("slow");
		$(".feedback_button").html(`<i class="icon-menu" title="Back to informations"></i>`);
		$(".page_progress").addClass("page_progress--hide");
	}
}
/*Not ready
function mail() {
  var feedbackname = document.getElementById("feedback_name").value;
  var mail = document.getElementById("feedback_mail").value;
  var feedbackmessage = document.getElementById("feedback_message").value;
  var emailvalidate =  /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,4}$/;
  var feedbackmail = emailvalidate.test(mail);
  
    $.ajax({
      method: "GET",
      url: "mail.php",
      data: {
        name: feedbackname,
        mail: feedbackmail,
        message: feedbackmessage
      },
      contentType: "application/json",
      dataType: "JSON",
      success: function(mail) {
      },
      error: function(mail) {
      }
    });
  }*/
