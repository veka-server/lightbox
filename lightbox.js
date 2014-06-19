// debut de la cage
(function (){

	var currentImg = '';
	var currentGalerie = '';

	function getImgSizeFromUrl(url){
    	document.body.insertAdjacentHTML('BeforeEnd', "<img id='getImgSizeFromUrl' src='"+url+"' />");
		var pic = document.getElementById('getImgSizeFromUrl');
 		var h = pic.offsetHeight;
		var w = pic.offsetWidth;
		pic.parentElement.removeChild(pic);
		return [w,h]
	} 

	function redimmenssionner(elem, taux){
		var dim = getImgSizeFromUrl(elem.src);
		var larg = (document.body.clientWidth);
		var haut = (document.body.clientHeight);

		var p = document.getElementById("lightboxJS").getElementsByTagName('img')[0];
		var style = p.currentStyle || window.getComputedStyle(p);
		var margeHorizontalImg = parseInt(style.marginRight.replace('px', ''))+parseInt(style.marginLeft.replace('px', ''))+parseInt(style.paddingRight.replace('px', ''))+parseInt(style.paddingLeft.replace('px', ''));
		var margeVerticalImg = parseInt(style.marginTop.replace('px', ''))+parseInt(style.marginBottom.replace('px', ''))+parseInt(style.paddingTop.replace('px', ''))+parseInt(style.paddingBottom.replace('px', ''));

		var width = Math.ceil(larg*taux) - margeHorizontalImg 
		var heightTmp = Math.ceil((width/dim[0])*dim[1]);
		var height = Math.ceil(haut*taux) - $('#lightboxJS h1').outerHeight(true) - $('#lightboxJS p').outerHeight(true) - margeVerticalImg
		var widthTmp = Math.ceil((height/dim[1])*dim[0]);
		var widthSecondePass = Math.ceil(larg*taux) - margeHorizontalImg

		if( (dim[0] > dim[1] && dim[0] > width && heightTmp <= height )) // panoramique
		{
			$('#lightboxJS img').css('width', width+'px');
		}

		if( (dim[0] <= dim[1] && dim[1] > height) || ( heightTmp > height && dim[1] > height) ) // portrait
		{
			if( widthTmp > width)
				$('#lightboxJS img').css('width', width+'px');
			else
				$('#lightboxJS img').css('height', height+'px');
		}

	}

	function centrer(){
		$('#lightboxJS h1').css('width',$('#lightboxJS h1').outerWidth());

		if($('#lightboxJS p').height() == 0 ) // si il n'y a pas de description
			$('#lightboxJS').css('width', 'auto' );
		else
			// applique la largeur la plus grande sur le block global pour pouvoir le centrer
			$('#lightboxJS').css('width', Math.max(($('#lightboxJS img').outerWidth(true)), $('#lightboxJS h1').outerWidth())+'px' );

		$('#lightboxJS').css('margin-top', '-'+Math.ceil($('#lightboxJS').outerHeight()/2)+'px' );
		$('#lightboxJS').css('margin-left', '-'+Math.ceil($('#lightboxJS').outerWidth()/2)+'px' );
	}

	function afficher(elem){

		currentImg = $(elem).attr('data-id');
		currentGalerie = $(elem).attr('data-galerie');

		// remplir les donnée
		$('#lightboxJS h1').text($(elem).attr('data-titre'));
		$('#lightboxJS p').text($(elem).attr('data-description'));
		$('#lightboxJS img').attr('src',elem.src);

		// afficher la box , doit etre fait avant le redimmenssionnement et le centrage
		$('#shadowJS').show();
		$('#lightboxJS').show();

		// redimmenssionner la box
		redimmenssionner(elem, 0.9) // le second parametre est un pourcentage de la largeur/hauteur de la fenetre, 0.9 = 90%

		// centrer la box
		centrer()

	}

	function fermer(){
		// afficher la box , doit etre fait avant le redimmenssionnement et le centrage
		$('#shadowJS').hide();
		$('#lightboxJS').hide();

		// remise en auto des dimmenssion
		$('#lightboxJS h1').css('width','auto');
		$('#lightboxJS').css('width', 'auto' );
		$('#lightboxJS img').css('width', 'auto');
		$('#lightboxJS img').css('height','auto');

		currentImg = '';
		currentGalerie = '';
	}

    if(!document.getElementById("lightboxJS"))
    	document.body.insertAdjacentHTML('BeforeEnd', "<div id='lightboxJS'><h1></h1><br><div id='lightboximgJS'><img/><div id='closeLightboxJS'></div></div><p></p></div><div id='shadowJS'></div>");			

    $('#closeLightboxJS').click(fermer)

	document.body.onclick = function(e)
	{
		var oElem = e ? e.target : event.srcElement;
		if(oElem.parentNode.id == 'lightboximgJS' || oElem.parentNode.id == 'lightboxJS' || oElem.className.indexOf('lightbox') > -1 ){return 0;}
		fermer()
	}

	function next(){
		$('.lightbox').each(function(){
			if($(this).attr('data-id') == (parseInt(currentImg)+1) && $(this).attr('data-galerie') == currentGalerie )
			{
				fermer()
				afficher(this);
				return false;
			}
		})
	}

	function prev(){
		$('.lightbox').each(function(){
			if($(this).attr('data-id') == (parseInt(currentImg)-1)  && $(this).attr('data-galerie') == currentGalerie )
			{
				fermer()
				afficher(this);
				return false;
			}
		})
	}

	document.body.onkeydown = function(e)
	{
	    switch(e.keyCode)
	    {
	    	case 27 : // echap
	    		fermer();
	    		break;
	    	case 32 : // espace
	    	case 39 : // fleche droite
	    		next();
	    		return false; // pour désactiver la fonction standart de la touche espace 
	    		break;
	    	case 37 : // fleche gauche
	    		prev();
	    		break;
	    }
	}
	
	var i = 1;
	$('.lightbox').each(function(){

		$(this).attr('data-id',i);
		i++;

		$(this).click(function(){
			afficher(this);
		})
	})

// Fin de la cage
} )();
