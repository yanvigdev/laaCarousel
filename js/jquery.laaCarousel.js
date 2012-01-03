/*!
 * jQuery lightweight plugin laaCarousel
 * Original author: Yann Vignolet
 * Comments: Yann Vignolet
 * Version : 1.4.1
 *
 * Ce plugin affiche en diaporama les images d'un conteneur avec des effets de transition.
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
        vignetteLargeur : 51
    },
    settings = {
        nbElement : null,
        elementCourant : 0,
        elementPrecedent : null,
        largeur : null,
        hauteur:null,
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
            precharger_image(this);
        }
        else{
            setCarousel(self);
        }

        $(this.element).one('complete',function(){



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

                    $(self.element).find('.carousel').stop(true,true);
                    //$(self.element).children('.slideCarousel').stop(true,true);

                    self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));
                    self.options.elementCourant =((self.options.elementPrecedent-1)<0)?(self.options.nbElement-1):(self.options.elementPrecedent-1);


                    self.options.slideTimer =clearTimeout(self.options.slideTimer);
                    self.options.click=true;
                    startCarousel(self);


                });
                $(self.element).find('.flecheDroite').live('click', function(event) {
                    event.stopPropagation();


                    $(self.element).find('.carousel').stop(true,true);
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


                    $(self.element).find('.carousel').stop(true,true);


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
                slide(self);


                break;
            case 'vague':
                if(!self.options.click){

                    $(self.element).find(".carousel").stop().fadeOut(0);
                    splitCarousel(self,50);
                    $(self.element).find(".carousel:first").addClass('active');

                }

                vague(self);
                break;
            case 'smooth':
                if(!self.options.click){

                    $(self.element).find(".carousel").stop().fadeOut(0);
                    splitCarousel(self,50);
                    $(self.element).find('.splitCarousel').css({
                        'z-index':1
                    }).find('div').animate({
                        'opacity':0
                    },0);
                    $(self.element).find(".carousel:first").addClass('active').find('div').animate({
                        'opacity':1
                    },0);
                }

                smooth(self);
                break;
        }
    }
    function splitCarousel(self,nbrSplit){

        if (!nbrSplit) {
            nbrSplit = 10;
        }
        var urlImage;
        var largeurSplit  = (self.options.largeur/nbrSplit);
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



    }
    function fade(self) {
        if(!self.options.click){
            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);
        }

        $(self.element).find('.carousel').eq(self.options.elementCourant).delay((self.options.click)?10:self.options.delay).fadeIn('slow', function() {

            $(this).addClass('active');
            self.options.click =false;
            $(this).siblings(".carousel").removeClass('active').filter(":visible").fadeOut('slow');
            update(self);
            fade(self);
        });

    }
    function vague(self){
        self.options.slideTimer =clearTimeout(self.options.slideTimer);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        }).find('div').css({
            'top':$(self.element).find('.splitCarousel').height()
        });
        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);
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
        update(self);
        self.options.click =false;
        self.options.slideTimer= setTimeout( function() {
            vague(self);
        },self.options.delay);
    /*$(self.element).find('.splitCarousel').eq(self.options.elementPrecedent)*/
    }
    function smooth(self){
        self.options.slideTimer =clearTimeout(self.options.slideTimer);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        }).find('div').animate({
            'opacity':0
        },0);
        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);
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


        var delais= 300;

        $(self.element).find('.splitCarousel').eq(self.options.elementCourant).css({
            'z-index':2
        }).find('div').each(function(index){

            //$(this).stop().delay(delais).fadeIn('slow');
            $(this).stop().delay(delais).animate({
                'opacity':1
            },'slow');
            delais= delais+10;

        });
        $(self.element).find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
        update(self);
        self.options.click =false;
        self.options.slideTimer= setTimeout( function() {
            smooth(self);
        },self.options.delay);
        $(self.element).find('.splitCarousel').eq(self.options.elementPrecedent).css({
            'z-index':1
        });
    }
    function slide(self) {
        self.options.slideTimer =clearTimeout(self.options.slideTimer);


        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);

        }





        $(self.element).find(".slideCarousel").stop().animate({
            'left': '-'+(self.options.largeur* self.options.elementCourant)+'px'
        }, 'slow' , function() {
            update(self);
            $(self.element).find(".slideCarousel").find(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
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
                    //console.log($(self.element).attr('class')+' load : '+(i+1)+'/'+self.options.nbElement)
                    if( ++i>=self.options.nbElement ){
                        //console.log($(self.element).attr('class')+' complete ')
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




    }

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window);