// ==UserScript==
// @name         scrap.tf-item-information
// @version      0.1.13
// @description  Add Backpack.tf and Marketplace.tf links in a menu when middle clicking items on scrap.tf
// @author       Netroscript
// @match        https://*.scrap.tf/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.min.js
// @downloadURL  https://github.com/NetroScript/scrap.tf-item-information/raw/master/scrap.tf-item-information.user.js
// @updateURL    https://github.com/NetroScript/scrap.tf-item-information/raw/master/scrap.tf-item-information.meta.js
// @run-at       document-end
// ==/UserScript==


(function () {

	let defindexes = JSON.parse(localStorage.getItem("tf2_defindexes") || "{}");
	
	async function updateDefindexes() {
		let last_update = parseInt(localStorage.getItem("tf2_defindexes_last_update") || "0", 10);
		if (Date.now() - last_update < 24 * 60 * 60 * 1000) {
			return;
		}
		
		// Set it immediately to prevent multiple rapid trigger calls
		localStorage.setItem("tf2_defindexes_last_update", Date.now().toString());
		
		try {
			let response = await fetch("https://sku.pricedb.io/api/schema");
			let data = await response.json();
			let items = data.raw.schema.items;
			let new_defindexes = {};
			for (let item of items) {
				new_defindexes[item.defindex] = item.item_name || item.name;
			}
			defindexes = Object.assign({}, defindexes, new_defindexes);
			localStorage.setItem("tf2_defindexes", JSON.stringify(defindexes));
		} catch (err) {
			console.error("Could not fetch schema", err);
		}
	}
	
	async function getDefindexName(defindex, fallback) {
		if (!defindexes[defindex]) {
			await updateDefindexes();
		}
		return defindexes[defindex] || fallback;
	}

	// Map quality ID to quality name
	const qualities = {
		"quality0": "Normal",
		"quality1": "Genuine",
		"quality3": "Vintage",
		"quality5": "Unusual",
		"quality7": "Community",
		"quality8": "Valve",
		"quality9": "Self-Made",
		"quality10": "Customized",
		"quality11": "Strange",
		"quality12": "Completed",
		"quality13": "Haunted",
		"quality14": "Collector's",
	};

	//https://stackoverflow.com/a/13070569 ##########################
	function componentFromStr(numStr, percent) {
		var num = Math.max(0, parseInt(numStr, 10));
		return percent ?
			Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
	}

	function rgbToHex(rgb) {
		var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
		var result, r, g, b, hex = "";
		if ((result = rgbRegex.exec(rgb))) {
			r = componentFromStr(result[1], result[2]);
			g = componentFromStr(result[3], result[4]);
			b = componentFromStr(result[5], result[6]);

			hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
		return hex;
	}
	//https://stackoverflow.com/a/13070569 ########################## //


	async function extractSkinAndWear(itemname, defindex) {
		let defindexitemname = await getDefindexName(defindex, itemname);
		let tmp = itemname.split(" " + defindexitemname + " ");
		if (tmp.length >= 2) {
			let wear = tmp[1].replace(/\(|\)/g, "");
			// A warpaint called Haunted Ghosts exists, we have an additional check to make sure we don't confuse that with the weapon quality
			let skin = tmp[0].replace(/Collector's |Decorated Weapon |Genuine |Haunted (?!Ghosts\b)|Normal |Self-Made |Strange |Unique |Unusual |★Unusual |Vintage /g, "");
			return [skin, wear];
		}
		return ["", ""];
	}

	async function backpacksearchquery(ite, s_quality = true, s_aussi = true, s_classes = false, s_killstreak = true, s_sheen = false, s_killstreakeffect = false, s_particleeffect = true, s_paint = false, s_skin = true, s_wear = false, s_level = false) {
		let query = "?item=";
		let it = $(ite);

		let defindex = it.attr("data-defindex");

		if (it.is("tr")){
			query += await getDefindexName(defindex, "");
			query += "&quality=" + it.attr("data-quality");


			if (it.attr("data-quality") == "11" && $($(it).find("td")[1]).text().includes("Strange Australium")){
				query += "&australium=1";
			}

			return query;
		}

		let itemname = $($.parseHTML(it.attr("data-title"))).text();
		let defindexitemname = await getDefindexName(defindex, itemname);
		query += defindexitemname;
		let classes = it.attr("class");
		if (s_quality) {
			let qu = /(?:quality)[0-9]+/g;
			let quals = classes.match(qu);
			if (quals.length > 0) query += "&quality=";
			for (let i = 0; i < quals.length; i++) {
				quals[i] = quals[i].replace("quality", "");
				query += quals[i] + "%2C";
			}
			query = query.replace(/%2C$/g, "");
		}
		if (s_aussi && (query.includes("quality=11"))) (itemname.toLowerCase().indexOf("australium") !== -1) ? query += "&australium=1" : query += "&australium=-1";

		if (s_killstreak) (classes.indexOf("killstreak1") !== -1) ? query += "&killstreak_tier=1" : (classes.indexOf("killstreak2") !== -1) ? query += "&killstreak_tier=2" : (classes.indexOf("killstreak3") !== -1) ? query += "&killstreak_tier=3" : query += "&killstreak_tier=0";

		if (s_classes) {
			let tfclasses = it.attr("data-classes");
			if (tfclasses.split(" ").length <= 1)
				query += "&class=" + tfclasses.replace(/ /g, "%2C");
		}
		if (s_paint) {

			it.find(".paintcolor").css("background-color");
			let paint = rgbToHex(it.find(".paintcolor").css("background-color"));
			let paintint = parseInt(paint.split("#")[1], 16);
			if (paintint > 0) query += "&paint=" + paintint;
		}
		if (s_particleeffect) {
			let effectid = it.css("background-image").match(/particles_440\/([0-9]+)_380/g);
			if (effectid !== null) {
				effectid = effectid[0].split("particles_440/")[1].split("_380")[0];
				query += "&particle=" + effectid;
			}
		}
		if (s_sheen || s_killstreakeffect) {
			let sheenid = classes.match(/fx([0-9]+)/g);
			if (sheenid !== null) {
				for (let i = 0; i < sheenid.length; i++) {
					sheenid[i] = parseInt(sheenid[i].replace("fx", ""));
					if (sheenid[i] > 2000)
						if (s_killstreakeffect) query += "&killstreaker=" + sheenid[i];
						else
						if (s_sheen) query += "&sheen=" + sheenid[i];
				}
			}
		}
		if (s_skin || s_wear) {

			let [skin, wear] = await extractSkinAndWear(itemname, defindex);
			if (skin+wear != "") {
				if (s_skin) query += "&texture_name=" + skin;
				let weartypes = ["", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle Scarred"];
				if (s_wear) query += "&wear_tier=" + weartypes.indexOf(wear);

				// Unusual or Decorated with elevated quality Unusual detection is a bit wonky, so we just remove the unusual quality
				query = query.replace("&quality=5", "");

			}

		}
		if (s_level) {
			let level = it.attr("data-content").match(/Level ([0-9]+)/g);
			if (level != null) query += "&numeric=level&value=" + level[0].split("Level ")[1];

		}
		return query.replace(/ /g, "+");

	}


	$("head").append("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.min.css\" crossorigin=\"anonymous\">");



	$(".items-container").on("mousedown", ".item", function (e) {

		if (e.which == 2) {
			e.preventDefault();
			$(e.target).contextMenu();
		}

	});

	$("#itembanking-list").on("mousedown", "tr", function (e) {

		if (e.which == 2) {
			e.preventDefault();
			$(e.target).contextMenu();
		}

	});


	const menuList = {
		history: { name: "Item History", callback: function () { window.open("https://backpack.tf/item/" + $(this).attr("data-id")); } },
		classifieds: {
			name: "Check Classifieds", callback: async function () {

				let query = "https://backpack.tf/classifieds" + await backpacksearchquery(this);
				window.open(query);



			}
		},
		classifieds2: {
			name: "Check Classifieds (Accurate)", callback: async function () {
				let query = "https://backpack.tf/classifieds" + await backpacksearchquery(this, true, true, true, true, true, true, true, true, true, true);

				window.open(query);

			}
		},
		premsearch: {
			name: "Premium Search", callback: async function () {

				let query = "https://backpack.tf/premium/search" + await backpacksearchquery(this);
				window.open(query);



			}
		},
		premsearch2: {
			name: "Premium Search (Accurate)", callback: async function () {
				let query = "https://backpack.tf/premium/search" + await backpacksearchquery(this, true, true, true, true, true, true, true, true, true, true, true);

				window.open(query);

			}
		},
		marketplace: {
			name: "Item on Marketplace.tf", callback: function () {
				let query = "https://marketplace.tf/items/tf2/";
				let it = $(this);
				let defindex = it.attr("data-defindex");
				//Item
				query += defindex;


				if (it.is("tr")){
					query += ";" + it.attr("data-quality");

					if (it.attr("data-quality") == "11" && $($(it).find("td")[1]).text().includes("Strange Australium")){
						query += ";australium";
					}

					window.open(query);
					return;
				}

				let classes = it.attr("class");
				let qu = /(?:quality)[0-9]+/g;
				let quals = classes.match(qu);
				//Quality
				query += ";" + quals[0].replace("quality", "");

				if (quals[0] == "quality11" && $($.parseHTML(it.attr("data-title"))).text().includes("Australium")) query += ";australium";

				let effectid = it.css("background-image").match(/particles_440\/([0-9]+)_380/g);
				if (effectid !== null) {
					effectid = effectid[0].split("particles_440/")[1].split("_380")[0];
					//Effect
					query += ";u" + effectid;
				}

				(classes.indexOf("killstreak1") !== -1) ? query += ";kt-1" : (classes.indexOf("killstreak2") !== -1) ? query += ";kt-2" : (classes.indexOf("killstreak3") !== -1) ? query += ";kt-3" : query += "";





				let skininfo = it.css("background-image").match(/warpaint\/[0-9]+_[0-9]+_[0-9]+_[0-9]+\.png/g);
				if (skininfo !== null) {
					let skin = skininfo[0].split("_")[1];
					let wear = skininfo[0].split("_")[2];
					query += ";w" + wear + ";pk" + skin;
				}

				if (it.attr("data-content").indexOf("Strange Stat Clock") !== -1) query += ";strange";
				if (classes.indexOf("uncraft") !== -1) query += ";uncraftable";

				window.open(query);

			}
		},
		steam: {
			name: "Steam Community Market", callback: async function () {
				let query = "https://steamcommunity.com/market/listings/440/";
				let it = $(this);

				if (it.is("tr")){
					query += $($(it).find("td")[1]).text();

					window.open(query);
					return;
				}

				let defindex = it.attr("data-defindex");
				let itemname = $($.parseHTML(it.attr("data-title"))).text();
				let defindexitemname = await getDefindexName(defindex, itemname);
				let classes = it.attr("class");
				let qu = /(?:quality)[0-9]+/g;
				let quals = classes.match(qu);

				if (it.attr("data-content").indexOf("Strange Stat Clock") !== -1) query += "Strange ";
				else if (qualities.hasOwnProperty(quals[0]))
					query += qualities[quals[0]] + " ";



				(classes.indexOf("killstreak1") !== -1) ? query += "Killstreak " : (classes.indexOf("killstreak2") !== -1) ? query += "Specialized Killstreak " : (classes.indexOf("killstreak3") !== -1) ? query += "Professional Killstreak " : query += "";

				// Check if it is an australium, if so, add australium to the query
				if (itemname.startsWith("Strange Australium")) {
					query += "Australium ";
				}

				let [skin, wear] = await extractSkinAndWear(itemname, defindex);
				if (skin.length > 0) {
					query += skin + " ";
				}
				query += defindexitemname + " ";
				if (wear.length > 0) query += "(" + wear + ")";
				window.open(query);

			}
		},
		stn: {
			name: "Item on stntrading.eu", callback: async function () {
				let query = "https://stntrading.eu/item/tf2/";
				let it = $(this);

				let defindex = it.attr("data-defindex");
				let itemname = $($.parseHTML(it.attr("data-title"))).text();
				let defindexitemname = await getDefindexName(defindex, itemname);
				let classes = it.attr("class");
				let qu = /(?:quality)[0-9]+/g;
				let quals = classes.match(qu);

				// Add Non-Craftable to the query if it is non-craftable
				if (classes.indexOf("uncraft") !== -1) query += "Non-Craftable ";

				if (it.attr("data-content").indexOf("Strange Stat Clock") !== -1) query += "Strange ";
				else if (qualities.hasOwnProperty(quals[0]))
					query += qualities[quals[0]] + " ";
				
				// It seems there is no support for killstreak items on stntrading.eu

				// If it is an unusual, add the effect
				let effectid = it.css("background-image").match(/particles_440\/([0-9]+)_380/g);
				// Use this to just check if is is an unusual
				if (effectid !== null) {
					// If it is, obtain the effect name
					let effect_name = it.attr("data-content").match(/<br\/>Effect: ([^<]*)<br\/>/)[1];
					// And add it to the query
					query += effect_name + " ";
				}

				// Check if it is an australium, if so, add australium to the query
				if (itemname.startsWith("Strange Australium")) {
					query += "Australium ";
				}

				let [skin, wear] = await extractSkinAndWear(itemname, defindex);
				if (skin.length > 0) {
					query += skin + " ";
				}
				query += defindexitemname + " ";
				if (wear.length > 0) query += "(" + wear + ")";

				// So far this is exactly the same as the Steam Community Market URL, now we just need to replace space with +
				query = query.replace(/ /g, "+");
				// Remove a trailing + if there is one
				if (query.endsWith("+")) query = query.slice(0, -1);

				window.open(query);
			}
		}
	};

	if (window.location.pathname.startsWith("/items")){
		delete menuList["history"];
	}

	$.contextMenu({
		// define which elements trigger this menu
		selector: window.location.pathname.startsWith("/items") ? "tr" : ".item",
		trigger: "none",
		// define the elements of the menu
		items: menuList
	});


})();
