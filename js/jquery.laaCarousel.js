/*!
 * jQuery lightweight plugin laaCarousel
 * Original author: Yann Vignolet
 * Comments: Yann Vignolet
 * Version : 1.3
 *
 * Ce plugin affiche en diaporama les images avec des effets de transition.
 */




(function ( $, window, document, undefined ) {



    /**
    * defaults sont les reglages que l'utilisateur peut faire varier
    * settings sont les variables attachées à chaque carousel
    * @delay: délai en milliseconde (par defaut 3000)
    * @mode : mode de transition (par defaut fade)
    * @fleche : afficher des flêches pour passé à l'image suivante ou precedente (par defaut false)
    * @selecteur : afficher une serie de bouton pour passé d'une image à l'autre (par defaut false)
    * @preload : gestion du prechargement des images (par defaut true)
    * @legende : affichage ou non d'une legende sur chaque image (par defaut null)
    * @vignette : ajout une serie de vignette pour passer d'une image à l'autre (par defaut false)
    */
    var pluginName = 'laaCarousel',
    defaults = {
        delay: "3000",
        mode : "fade",
        fleche : false,
        selecteur : false,
        preload : true,
        legende : null,
        vignette : false,
        vignetteHauteur : 50,
        vignetteLargeur : 50
    },
    settings = {
        nbElement : null,
        elementCourant : 0,
        elementPrecedent : null,
        largeur : null,
        click : false,
        survole : false,
        slideTimer : null

    };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;



        this.options = $.extend( {}, defaults, options,settings) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {

        var self = this;
        $(this.element).addClass('carouselcontainer loaderCarousel');
        $(this.element).children("img").addClass('carousel');



        this.options.largeur = $(this.element).width();
        this.options.nbElement = $(this.element).find('.carousel').length;

        this.options.elementPrecedent = this.options.nbElement;

        $(this.element).children(".carousel").each(function(index) {
            $(this).attr('data', index);
        });

        if(this.options.preload){
            precharger_image(this);
        }
        else{
            setCarousel(self);
        }

        $(this.element).bind('complete',function(){



            setCarousel(self);

        });






    };
    function setCarousel(self){
        $(self.element).removeClass("loaderCarousel");


        if(self.options.nbElement>1){




            //Activation des fleches
            if(self.options.fleche){
                $(self.element).append("<div class='flecheGauche flechesCarousel'></div><div class='flecheDroite flechesCarousel'></div>");

                $(self.element).find('.flecheGauche').live('click', function(event) {
                    event.stopPropagation();

                    $(self.element).children('.carousel').stop(true,true);
                    //$(self.element).children('.slideCarousel').stop(true,true);

                    self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));
                    self.options.elementCourant =((self.options.elementPrecedent-1)<0)?(self.options.nbElement-1):(self.options.elementPrecedent-1);


                    self.options.slideTimer =clearTimeout(self.options.slideTimer);
                    self.options.click=true;
                    startCarousel(self);


                });
                $(self.element).find('.flecheDroite').live('click', function(event) {
                    event.stopPropagation();


                    $(self.element).children('.carousel').stop(true,true);
                    //$(self.element).children('.slideCarousel').stop(true,true);

                    self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


                    self.options.elementCourant =((self.options.elementPrecedent+1)>=(self.options.nbElement))?0:(self.options.elementPrecedent+1);


                    self.options.slideTimer =clearTimeout(self.options.slideTimer);
                    self.options.click=true;
                    startCarousel(self);
                });

            }//fin if fleche
            //Activation du selecteur
            if(self.options.selecteur){
                $(self.element).append("<div class='selecteurCarousel'></div>");
                for (var i = 0; i < self.options.nbElement; i++) {
                    $(self.element).find(".selecteurCarousel").append("<span data='"+i+"'>&bull;</span>");
                }
                $(self.element).find(".selecteurCarousel").find("span:first").addClass('select');
                $(self.element).find(".selecteurCarousel").find("span").live('click', function(event) {
                    event.stopPropagation();


                    $(self.element).children('.carousel').stop(true,true);


                    self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


                    self.options.elementCourant =Number($(this).attr('data'));

                    self.options.slideTimer =clearTimeout(self.options.slideTimer);




                    self.options.click=true;
                    startCarousel(self);



                });
            }//fin if selecteur
            if(self.options.legende!==null){
                $(self.element).append("<div class='legendCarousel'><p></p></div>");

            }//fin if legend

            if(self.options.vignette){
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
                    var thumbImage="<div><img src='"+$(this).attr('src')+"' height='"+hauteur+"' width='"+largeur+"' alt='"+"' data='"+index+"' style='"+style+"'/></div>";
                    $(self.element).find(".vignetteCarousel").append(thumbImage);

                });

                var containerHauteur= $(self.element).find(".vignetteCarousel").children("div:first").outerHeight(true);
                var containerLargeur=$(self.element).find(".vignetteCarousel").children("div:first").outerWidth(true);

                containerLargeur=(parseInt(self.options.largeur/containerLargeur,10)>self.options.nbElement)?containerLargeur*self.options.nbElement:parseInt(self.options.largeur/containerLargeur,10)*containerLargeur;
                containerHauteur=Math.ceil(self.options.nbElement/(containerLargeur/$(self.element).find(".vignetteCarousel").children("div:first").outerWidth(true)))*containerHauteur;

                var centrage = (self.options.largeur-containerLargeur)/2;
                $(self.element).css({
                    'height':'+='+containerHauteur+'px'
                    });
                $(self.element).find('.vignetteCarousel').css({
                    'width':containerLargeur+'px',
                    'height':containerHauteur+'px',
                    'margin-left':centrage+'px'
                    });
                $(self.element).find(".vignetteCarousel").find("div:first").addClass('select');
                $(self.element).find(".vignetteCarousel").find("img").live('click', function(event) {
                    event.stopPropagation();


                    $(self.element).children('.carousel').stop(true,true);


                    self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


                    self.options.elementCourant =Number($(this).attr('data'));

                    self.options.slideTimer =clearTimeout(self.options.slideTimer);




                    self.options.click=true;
                    startCarousel(self);



                });
            }//fin if vignette

            startCarousel(self);


        }
    }
    function startCarousel(self){
        update(self);
        switch (self.options.mode) {
            case 'fade':
                if(!self.options.click){
                    $(self.element).find(".carousel").stop().fadeOut(0);
                    $(self.element).find(".carousel:first").stop().show().addClass('active');
                }
                fade(self);
                break;
            case 'slide':
                if(!self.options.click){
                    $(self.element).prepend("<div class='slideCarousel'></div>");
                    $(self.element).children(".slideCarousel").css({
                        "width": (self.options.largeur*self.options.nbElement)+"px"
                    });
                    $(self.element).children(".slideCarousel").append($(self.element).find(".carousel"));
                    $(self.element).find(".carousel").each(function(index){
                        $(this).css({
                            'float':"left",
                            'position':"relative"
                        });

                    });
                    $(self.element).find(".carousel:first").addClass('active');



                }
                slide(self);


                break;
        }
    }
    function fade(self) {
        if(!self.options.click){
            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);
        }

        $(self.element).children(".carousel").eq(self.options.elementCourant).delay((self.options.click)?10:self.options.delay).fadeIn('slow', function() {

            $(this).addClass('active');
            self.options.click =false;
            $(this).siblings(".carousel").removeClass('active').filter(":visible").fadeOut('slow');
            update(self);
            fade(self);
        });

    }
    function slide(self) {
        self.options.slideTimer =clearTimeout(self.options.slideTimer);


        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);

        }





        $(self.element).children(".slideCarousel").stop().animate({
            'left': '-'+(self.options.largeur* self.options.elementCourant)+'px'
        }, 'slow' , function() {
            update(self);
            $(self.element).children(".slideCarousel").find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
            self.options.click =false;



        });


        self.options.slideTimer= setTimeout( function() {
            slide(self);
        },self.options.delay);



    }

    function suivant(options) {
        var num = 0;
        num  = Number(options.elementCourant) + 1;
        if(num  === options.nbElement) {
            num  = 0;
        }

        return num;
    }
    function update(self){
        if(self.options.selecteur){
            $(self.element).children(".selecteurCarousel").find("span").eq(self.options.elementCourant).addClass('select').siblings("span").removeClass('select');
        }
        if(self.options.vignette){
            $(self.element).children(".vignetteCarousel").find("div").eq(self.options.elementCourant).addClass('select').siblings("div").removeClass('select');

        }
        if(self.options.fleche){
            if(self.options.elementCourant===0){
                $(self.element).find(".flecheGauche").fadeOut('fast');
            }else{
                $(self.element).find(".flecheGauche").fadeIn('fast');
            }
            if(self.options.elementCourant===(self.options.nbElement-1)){
                $(self.element).find(".flecheDroite").fadeOut('fast');
            }else{
                $(self.element).find(".flecheDroite").fadeIn('fast');
            }
        }
        if(self.options.legende!==null){

            var legende = $(self.element).find(".carousel").eq(self.options.elementCourant).attr(self.options.legende);

            $(self.element).find(".legendCarousel>p").html(legende);
        }
    }

    function precharger_image(self)
    {




        var _done=function() {
            $(self.element).trigger('complete');
        },i = 0;


        $(self.element).find(".carousel").each(function() {
            var _img = this,
            _checki=function(e) {
                if((_img.complete) || (_img.readyState==='complete'&&e.type==='readystatechange') )
                {
                    if( ++i===$(self.element).find(".carousel").length ) _done();
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




    }

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window);