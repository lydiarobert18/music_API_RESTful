function showTopArtists(response){
	//boucle sur les résultats
	//response   print_r;
	for(i in response.topartists.artist){
		//crée une balise image
		var img = $("<img>"); 
		//lui donne une source (src)
		img.attr("src", response.topartists.artist[i].image[2]['#text']);
		//lui donne une classe
		img.addClass("artist-img");
		//lui donne un attribut data-mbid, pour être capable de savoir quelle img a été cliquée
		img.attr("data-mbid", response.topartists.artist[i].mbid);
		
		//l'ajoute au #wrapper
		$("#wrapper").append(img);
	}
}


function showArtistDetails(response){
	$("#wrapper").html(""); //vide le contenu précédent

	if (response.topalbums['@attr'] != undefined){
		$("#wrapper").html(response.topalbums['@attr'].artist);
	}

	if (response.topalbums.album != undefined && response.topalbums.album.length > 0){
		//boucle sur les résultats
		for(i in response.topalbums.album){
			//crée une balise image
			var img = $("<img>"); 
			//lui donne une source (src)
			img.attr("src", response.topalbums.album[i].image[2]['#text']);
			//lui donne une classe
			img.addClass("album-img");
			//lui donne un attribut data-mbid, pour être capable de savoir quelle img a été cliquée
			img.attr("data-mbid", response.topalbums.album[i].mbid);
			
			//l'ajoute au #wrapper
			$("#wrapper").append(img);
		}
	}

}


function showAlbumDetails(response){
	$("#wrapper").html(""); //vide le contenu précédent

	var ul = $("<ul>").addClass("tracks-ul");

	//boucle sur les résultats
	for(i in response.album.tracks.track){
		//crée une balise li
		var li = $("<li>"); 
		//lui donne un contenu (le nom de la track)
		li.html(response.album.tracks.track[i].name);

		//lui donne un attribut data-name, pour être capable de savoir quelle li a été cliquée
		li.attr("data-name", response.album.tracks.track[i].name + " " + response.album.artist);
		
		//l'ajoute au #wrapper
		ul.append(li);
	}
	$("#wrapper").append(ul);
}

//http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=c87a6a99b204fa9f82637d7cf25fc7f1&format=json

function getTopArtists(){

	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/",
		data: {
			method: 	"geo.gettopartists",
			country: 	"france",
			api_key: 	"c87a6a99b204fa9f82637d7cf25fc7f1",
			format: 	"json"
		},
		success: showTopArtists
	});

}

function getArtistDetails(mbid){

	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/",
		data: {
			method: 	"artist.getTopAlbums",
			mbid: 		mbid,
			api_key: 	"c87a6a99b204fa9f82637d7cf25fc7f1",
			format: 	"json"
		},
		success: showArtistDetails
	});

}

function getAlbumDetails(mbid){

	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/",
		data: {
			method: 	"album.getInfo",
			mbid: 		mbid,
			api_key: 	"c87a6a99b204fa9f82637d7cf25fc7f1",
			format: 	"json"
		},
		success: showAlbumDetails
	});

}



//get and show video
function getAndShowVideo(name){
	$.ajax({
		url: "https://www.googleapis.com/youtube/v3/search",
		data: {
			key: "AIzaSyBa3BsHMug2jQg83fp_DMpbnDMSbk6sUhk",
			part: "snippet",
			q: name + " official",
			type: "video",
			videoEmbeddable: true
		},
		success: function(response){
			console.log(response);
			$("#wrapper").html('<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/'+response.items[0].id.videoId+'?autoplay=1&origin=http://example.com" frameborder="0"/>'
			);
		}
	});
}

//event listener de click sur les (futures) images de groupes
$("body").on("click", "img.artist-img", function(){
	//l'identifiant du groupe
	var clickedMbid = $(this).data("mbid"); 
	getArtistDetails(clickedMbid);
});

//event listener de click sur les (futures) images d'albums
$("body").on("click", "img.album-img", function(){
	//l'identifiant du groupe
	var clickedMbid = $(this).data("mbid"); 
	getAlbumDetails(clickedMbid);
});


$("body").on("click", ".tracks-ul li", function(){
	var videoName = $(this).text();
	getAndShowVideo(videoName);
});


getTopArtists();




