/*!
 * laaCarousel (jQuery Plugin)
 * Original author: Yann Vignolet
 * Comments: Yann Vignolet
 * Date : 13/01/2012
 * http://www.yannvignolet.fr
 * Version : 1.4.4
 *
 * Ce plugin affiche en diaporama les images d'un conteneur avec des effets de transition.
 *
 * Dépend de la librarie: jQuery
 */




(function ( $, window, document, undefined ) {



    /**
    * defaults sont les reglages que l'utilisateur peut faire varier
    * settings sont les variables attachées à chaque carousel
    *
    * event 'reload' sur le conteneur relancera l'execution du carousel en cas de changement de contenu
    */
    var pluginName = 'laaCarousel',
    defaults = {
        delay: "3000", //délais en milliseconde (par defaut 3000)
        mode : "fade", //mode de transition (par defaut fade)
        fleche : false,//afficher des flêches pour passé à l'image suivante ou precedente (par defaut false)
        selecteur : false, //afficher une serie de bouton pour passé d'une image à l'autre (par defaut false)
        preload : true, //gestion du prechargement des images (par defaut true)
        legende : null, //affichage ou non d'une legende sur chaque image (par defaut null)
        vignette : false, //ajout une serie de vignette pour passer d'une image à l'autre (par defaut false)
        vignetteHauteur : 50, //hauteur des vignettes (par defaut 50)
        vignetteLargeur : 50 //largeur des vignettes (par defaut 50)
    },
    settings = {
        nbElement : null, //nombre d'image composant le carousel
        elementCourant : 0, //index de l'image encourt d'execution
        elementPrecedent : null, //index de l'image précèdement executée
        largeur : null, //largeur de l'affichage du carousel
        hauteur:null, //hauteur de l'affichage du carousel
        click : false,
        survole : false,
        slideTimer : null, //temps qui defini le rythme du carousel
        archive : null //contenu initiale avant changement par ce Plugin

    };

    /**
     *Constructeur
     *
     */
    function Plugin( element, options ) {
        this.element = element;



        this.options = $.extend( {}, defaults, options,settings) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }
    /**
     *  Méthode d'initialisation du plugin
     */
    Plugin.prototype.init = function () {


        var self = this;
        this.options.archive=$(this.element).html();
        $(this.element).addClass('carouselcontainer loaderCarousel').append('<div class="animationCarousel"></div>');
        $(this.element).find("img").addClass('carousel').appendTo('.animationCarousel');

        $(this.element).find('.animationCarousel').height($(this.element).height()).width($(this.element).width());

        this.options.largeur = $(this.element).width();
        this.options.hauteur = $(this.element).height();
        this.options.nbElement = $(this.element).find('.carousel').length;

        this.options.elementPrecedent = this.options.nbElement;

        $(this.element).find(".carousel").each(function(index) {
            $(this).attr('data', index);
        });

        if(this.options.preload){
            this.precharger_image();
        }
        else{
            self.setCarousel();
        }




        $(self.element).one('reload',function(event){
            event.stopPropagation();

            $(self.element).find('.carousel').stop(true,true);
            self.options.slideTimer =clearTimeout(self.options.slideTimer);

            self.options.preload=false;
            self.options.nbElement = null;
            self.options.elementCourant = 0;
            self.options.elementPrecedent = null;
            self.options.largeur = null;
            self.options.hauteur=null;
            self.options.click = false;
            self.options.survole = false;

            $(self.element).removeClass('carouselcontainer');
            if($(self.element).find("img").hasClass('carousel')){
                $(self.element).html(self.options.archive);
            }

            self.init();

        });



    };
    /**
     *  Méthode qui vérifie le chargment de toutes les images.
     *
     */
    Plugin.prototype.precharger_image = function () {
        var self = this,
        _done=function() {
            self.setCarousel();
            return true;
        },i = 0;


        $(self.element).find(".carousel").each(function() {
            var _img = this,
            _checki=function(e) {
                if((_img.complete) || (_img.readyState==='complete'&&e.type==='readystatechange') )
                {
                    if( ++i>=self.options.nbElement ){
                        _done();
                    }
                }
                else if( _img.readyState === undefined ) // dont for IE
                {
                    $(_img).attr('src',$(_img).attr('src')); // re-fire load event
                }
            }; // _checki \\

            $(_img).bind('load readystatechange', function(e){
                _checki(e);
            });
            _checki({
                type:'readystatechange'
            }); // bind to 'load' event...
        });
    };
    /**
     * Méthode qui lance les différentes methodes qui vont construire le carousel avec tous les éléments voulus.
     *
     */
    Plugin.prototype.setCarousel = function(){
        var self = this;
        $(self.element).removeClass("loaderCarousel");


        if(self.options.nbElement>1){
            if(self.options.fleche){
                self.fleches();

            }
            if(self.options.selecteur){
                self.selecteur();
            }
            if(self.options.legende!==null){
                self.fleches();

            }

            if(self.options.vignette){
                self.vignette();
            }

            self.startCarousel();
        }else{
            $(self.element).find('.carousel').css({
                "top":0,
                "left":0
            });//place l'unique image au centre du container
        }
    };
    /**
     * Méthode qui ajout des fleches pour passer à l'image suivante ou précèdente
     */
    Plugin.prototype.fleches = function(){
        var self = this;
        $(self.element).append("<div class='flecheGauche flechesCarousel'></div><div class='flecheDroite flechesCarousel'></div>");

        $(self.element).find('.flecheGauche').live('click', function(event) {
            event.stopPropagation();

            $(self.element).find('.carousel').stop(true,true);


            self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));
            self.options.elementCourant =((self.options.elementPrecedent-1)<0)?(self.options.nbElement-1):(self.options.elementPrecedent-1);


            self.options.slideTimer =clearTimeout(self.options.slideTimer);
            self.options.click=true;
            self.startCarousel();


        });
        $(self.element).find('.flecheDroite').live('click', function(event) {
            event.stopPropagation();


            $(self.element).find('.carousel').stop(true,true);


            self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


            self.options.elementCourant =((self.options.elementPrecedent+1)>=(self.options.nbElement))?0:(self.options.elementPrecedent+1);


            self.options.slideTimer =clearTimeout(self.options.slideTimer);
            self.options.click=true;
            self.startCarousel();
        });
    };
    /**
     * Méthode qui ajout un serie de bouton pour passer à l'image de son choix
     */
    Plugin.prototype.selecteur = function(){
        var self = this;
        $(self.element).append("<div class='selecteurCarousel'></div>");
        for (var i = 0; i < self.options.nbElement; i++) {
            $(self.element).find(".selecteurCarousel").append("<span data='"+i+"'>&bull;</span>");
        }
        $(self.element).find(".selecteurCarousel").find("span:first").addClass('select');
        $(self.element).find(".selecteurCarousel").find("span").live('click', function(event) {
            event.stopPropagation();


            $(self.element).find('.carousel').stop(true,true);


            self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


            self.options.elementCourant =Number($(this).attr('data'));

            self.options.slideTimer =clearTimeout(self.options.slideTimer);




            self.options.click=true;
            self.startCarousel();



        });
    };
    /**
     * Méthode qui ajout une legende tiré de l'attribut 'alt' de l'image
     */
    Plugin.prototype.legendes = function(){
        var self = this;

        $(self.element).append("<div class='legendCarousel'><p></p></div>");
    };
    /**
     * Méthode qui ajout un serie de vignette pour passer à l'image de son choix
     */
    Plugin.prototype.vignette = function(){
        var self = this;
        var vignetteRatio = self.options.vignetteHauteur / self.options.vignetteLargeur;
        $(self.element).append("<div class='vignetteCarousel'></div>");
        $(self.element).find(".carousel").each(function(index){
            var carouselRatio =  $(this).height() / $(this).width(), hauteur,largeur,style;

            if (vignetteRatio > carouselRatio)
            {
                hauteur=self.options.vignetteHauteur;
                largeur=self.options.vignetteHauteur / carouselRatio;


                style="margin-left:"+(  (self.options.vignetteLargeur - self.options.vignetteHauteur / carouselRatio) / 2)+"px";

            }
            else {
                largeur=self.options.vignetteLargeur;
                hauteur=self.options.vignetteLargeur * carouselRatio;
                style="margin-top:"+( (self.options.vignetteHauteur - self.options.vignetteLargeur * carouselRatio) / 2)+"px";

            }
            var thumbImage="<div><img src='"+$(this).attr('src')+"' height='"+hauteur+"' width='"+largeur+"' alt='"+$(this).attr('alt')+"' data='"+index+"' style='"+style+"'/></div>";
            $(self.element).find(".vignetteCarousel").append(thumbImage);

        });
        $(self.element).find(".vignetteCarousel").find("div").css({
            'height':self.options.vignetteHauteur+'px',
            'width':self.options.vignetteLargeur+'px'
        });
        var containerHauteur= $(self.element).find(".vignetteCarousel").children("div:first").outerHeight(true);
        var containerLargeur= $(self.element).find(".vignetteCarousel").children("div:first").outerWidth(true);

        containerLargeur=(parseInt(self.options.largeur/containerLargeur,10)>self.options.nbElement)?containerLargeur*self.options.nbElement:parseInt(self.options.largeur/containerLargeur,10)*containerLargeur;
        containerHauteur=Math.ceil(self.options.nbElement/(containerLargeur/$(self.element).find(".vignetteCarousel").children("div:first").outerWidth(true)))*containerHauteur;

        var centrage = (self.options.largeur-containerLargeur)/2;
        $(self.element).height(containerHauteur+$(self.element).height());
        $(self.element).find('.vignetteCarousel').css({
            'width':containerLargeur+'px',
            'height':containerHauteur+'px',
            'margin-left':centrage+'px'
        });
        $(self.element).find(".vignetteCarousel").find("div:first").addClass('select');
        $(self.element).find(".vignetteCarousel").find("img").live('click', function(event) {
            event.stopPropagation();


            $(self.element).find('.carousel').stop(true,true);
            $(self.element).find('.carousel').find('div').stop();

            self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


            self.options.elementCourant =Number($(this).attr('data'));

            self.options.slideTimer =clearTimeout(self.options.slideTimer);




            self.options.click=true;
            self.startCarousel();



        });
    };
    /**
     * Méthode qui lance l'animation du carousel
     */
    Plugin.prototype.startCarousel = function(){
        var self = this;

        self.update();

        switch (self.options.mode) {
            case 'fade':
                if(!self.options.click){
                    $(self.element).find(".carousel").addClass("fadeCarousel").stop().fadeOut(0);
                    $(self.element).find(".carousel:first").stop().show().addClass('active');
                }
                self.fade();

                break;
            case 'slide':
                if(!self.options.click){
                    $(self.element).find('.animationCarousel').prepend("<div class='slideCarousel'></div>");
                    $(self.element).find(".slideCarousel").css({
                        "width": (self.options.largeur*self.options.nbElement)+"px"
                    });
                    $(self.element).find(".slideCarousel").append($(self.element).find(".carousel"));
                    $(self.element).find(".carousel").each(function(index){
                        $(this).css({
                            'float':"left",
                            'position':"relative"
                        });

                    });
                    $(self.element).find(".carousel:first").addClass('active');
                }
                self.slide();
                break;
            case 'vague':
                if(!self.options.click){

                    $(self.element).find(".carousel").stop().fadeOut(0);
                    self.splitCarousel(50);
                    $(self.element).find(".carousel:first").addClass('active');

                }

                self.vague();
                break;
            case 'smooth':
                if(!self.options.click){

                    $(self.element).find(".carousel").stop().fadeOut(0);
                    self.splitCarousel(50);
                    $(self.element).find('.splitCarousel').css({
                        'z-index':1
                    }).find('div').animate({
                        'opacity':0
                    },0);
                    $(self.element).find(".carousel:first").addClass('active').find('div').animate({
                        'opacity':1
                    },0);
                }

                self.smooth();
                break;
        }
    };
    /**
     * Méthode qui est utilisé en amont des effets de transition 'vague' et 'smooth'
     * elle passe les images dans le background de plusieurs div qui mise bout a bout reforme l'image
     * @nbrSplit : le nbr de div voulu
     */
    Plugin.prototype.splitCarousel = function(nbrSplit){
        var self = this,
        urlImage,
        largeurSplit  = (self.options.largeur/nbrSplit),
        i = 0;
        $(self.element).children('.animationCarousel').find('img.carousel').each(function(index){

            if((index+1)<=self.options.nbElement){/* patch pour un bug avec de multi carousel sur un meme page : le each passe aussi sur les images des autres carousel*/

                urlImage = $(this).attr('src');
                $(self.element).children('.animationCarousel').append("<div class='splitCarousel carousel' data='"+$(this).attr('data')+"' alt='"+$(this).attr('alt')+"'></div>");

                if(self.options.mode==='vague'){
                    for (i = 0; i < nbrSplit; i++) {
                        $(self.element).children('.animationCarousel').find('.splitCarousel').eq(index).append("<div style='left:"+(i*largeurSplit-1)+"px;top:"+self.options.hauteur+"px;width:"+(largeurSplit+1)+"px;height:"+self.options.hauteur+"px;background : url("+urlImage+") "+((largeurSplit*i-1)*-1)+"px top no-repeat;'></div>");
                    }
                }
                if(self.options.mode==='smooth'){
                    for (i = 0; i < nbrSplit; i++) {
                        $(self.element).children('.animationCarousel').find('.splitCarousel').eq(index).append("<div style='left:"+(i*largeurSplit-1)+"px;top:0;width:"+(largeurSplit+1)+"px;height:"+self.options.hauteur+"px;background : url("+urlImage+") "+((largeurSplit*i-1)*-1)+"px top no-repeat;'></div>");
                    }

                }
            }//*fin du patch*/
            $(self.element).find('img.carousel').remove();

        });



    };
    /**
     * Méthode qui gere la transition fade. Alpha de 0 à 1 sur chaque image de maniere alterné.
     */
    Plugin.prototype.fade = function(){
        var self = this;

        if(!self.options.click){
            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=self.suivant();
        }

        $(self.element).find('.carousel').eq(self.options.elementCourant).delay((self.options.click)?10:self.options.delay).fadeIn('slow', function() {

            $(this).addClass('active');
            self.options.click =false;
            $(this).siblings(".carousel").removeClass('active').filter(":visible").fadeOut('slow');
            self.update();
            self.fade();
        });

    };
    /**
     * Méthode qui gere la transition vague. Mouvement en vague de chaque image.
     */
    Plugin.prototype.vague = function(){
        var self = this;
        self.options.slideTimer =clearTimeout(self.options.slideTimer);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        }).find('div').css({
            'top':$(self.element).find('.splitCarousel').height()
        });
        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=self.suivant();
        }else{
            $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
                'z-index':1
            }).find('div').stop().css({
                'top':0
            });
            $(self.element).find('.carousel').eq(self.options.elementPrecedent).siblings(".carousel").find('div').stop().css({
                'top':$(self.element).find('.splitCarousel').height()
            });
        }


        var delais= 300;

        $(self.element).find('.splitCarousel').eq(self.options.elementCourant).css({
            'z-index':2
        }).find('div').each(function(index){

            $(this).stop().animate({
                'top':0
            },delais);
            delais= delais+10;

        });
        $(self.element).find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active').css({
            'z-index':1
        });
        self.update();
        self.options.click =false;
        self.options.slideTimer= setTimeout( function() {
            self.vague();
        },self.options.delay);

    };
    /**
     * Méthode qui gere la transition smooth. Apparition de gauche à droite de chaque image.
     */
    Plugin.prototype.smooth = function(){
        var self = this, delais= 300;
        self.options.slideTimer =clearTimeout(self.options.slideTimer);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        }).find('div').animate({
            'opacity':0
        },0);
        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=self.suivant();
        }else{
            $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
                'z-index':1
            }).find('div').stop().animate({
                'opacity':1
            },0);
            $(self.element).find('.carousel').eq(self.options.elementPrecedent).siblings(".carousel").find('div').stop().animate({
                'opacity':0
            },0);
        }




        $(self.element).find('.splitCarousel').eq(self.options.elementCourant).css({
            'z-index':2
        }).find('div').each(function(){


            $(this).stop().delay(delais).animate({
                'opacity':1
            },'slow');
            delais= delais+10;

        });
        $(self.element).find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
        self.update();
        self.options.click =false;
        self.options.slideTimer= setTimeout( function() {
            self.smooth();
        },self.options.delay);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        });
    };
    /**
     * Méthode qui gere la transition slide. Les images défile les une à la suite des autre en horizontale.
     */
    Plugin.prototype.slide = function(){
        var self = this;
        self.options.slideTimer =clearTimeout(self.options.slideTimer);


        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=self.suivant();

        }





        $(self.element).find(".slideCarousel").stop().animate({
            'left': '-'+(self.options.largeur* self.options.elementCourant)+'px'
        }, 'slow' , function() {
            self.update();
            $(self.element).find(".slideCarousel").find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
            self.options.click =false;
        });
        self.options.slideTimer= setTimeout( function() {
            self.slide();
        },self.options.delay);
    };
    /**
     * Méthode qui gere le decompte de chaque image pour chaque transition.
     */
    Plugin.prototype.suivant = function(){
        var self = this;
        var num = 0;
        num  = Number(self.options.elementCourant) + 1;
        if(num  === self.options.nbElement) {
            num  = 0;
        }

        return num;
    };
    /**
     * Méthode qui gere la mise à jour de chaque element du carousel à chaque fin de transition.
     */
    Plugin.prototype.update = function(){
        var self = this;

        if(self.options.selecteur){
            $(self.element).children(".selecteurCarousel").find("span").eq(self.options.elementCourant).addClass('select').siblings("span").removeClass('select');
        }
        if(self.options.vignette){
            $(self.element).children(".vignetteCarousel").find("div").eq(self.options.elementCourant).addClass('select').siblings("div").removeClass('select');

        }
        if(self.options.fleche){
            $(self.element).find(".flechesCarousel").stop().animate({
                'opacity':1
            },'fast');
            if(self.options.elementCourant===0){
                $(self.element).find(".flecheGauche").stop().animate({
                    'opacity':0
                },'fast');
            }else{
                $(self.element).find(".flecheGauche").stop().animate({
                    'opacity':1
                },'fast');
            }
            if(self.options.elementCourant===(self.options.nbElement-1)){
                $(self.element).find(".flecheDroite").stop().animate({
                    'opacity':0
                },'fast');
            }else{
                $(self.element).find(".flecheDroite").stop().animate({
                    'opacity':1
                },'fast');
            }
        }
        if(self.options.legende!==null){

            var legende = $(self.element).find(".carousel").eq(self.options.elementCourant).attr(self.options.legende);

            $(self.element).find(".legendCarousel>p").html(legende);
        }
    };



    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window);