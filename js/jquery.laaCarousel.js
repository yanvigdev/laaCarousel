/*!
 * jQuery lightweight plugin laaCarousel
 * Original author: Yann Vignolet
 * Comments: Yann Vignolet
 * Version : 1.1
 *
 * Ce plugin affiche en diaporama les images avec des effets de transition.
 */




(function ( $, window, document, undefined ) {



    /**
    * defaults sont les reglage qui l'utilisateur peut faire varier
    * settings sont les variables attaché à chaque carousel
    */
    var pluginName = 'laaCarousel',
    defaults = {
        delay: "3000",
        mode : "fade",
        btn : false,
        preload : false
    },
    settings = {
        nbElement : null,
        elementCourant : 0,
        elementPrecedent : null,
        largeur : null,
        click : false
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
        var count = 0;
        var self = this;
        $(this.element).addClass('carouselcontainer loaderCarousel');
        $(this.element).children("img").addClass('carousel');



        this.options.largeur = $(this.element).width();
        this.options.nbElement = $(this.element).find('.carousel').length;

        this.options.elementPrecedent = this.options.nbElement;

        $(this.element).children(".carousel").each(function(index) {
            $(this).attr('data', index);
        });

        precharger_image(this);

        $(this.element).bind('complete',function(){

            $(self.element).removeClass("loaderCarousel");


            if(self.options.nbElement>1){




                //Activation des Boutons
                if(self.options.btn){
                    $(self.element).append("<div class='flecheGauche flechesCarousel'></div><div class='flecheDroite flechesCarousel'></div>");
                    $(self.element).find('.flecheGauche').live('click', function(event) {
                        event.stopPropagation();

                        $(self.element).children('img').stop(true,true);

                        self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));
                        self.options.elementCourant =((self.options.elementPrecedent-1)<0)?(self.options.nbElement-1):(self.options.elementPrecedent-1);



                        self.options.click=true;
                        startCarousel(self);


                    });
                    $(self.element).find('.flecheDroite').live('click', function(event) {
                        event.stopPropagation();

                        $(self.element).children('img').stop(true,true);

                        self.options.elementPrecedent = Number($(self.element).find('.active').attr('data'));


                        self.options.elementCourant =((self.options.elementPrecedent+1)>=(self.options.nbElement))?0:(self.options.elementPrecedent+1);



                        self.options.click=true;
                        startCarousel(self);
                    });
                }


                startCarousel(self);


            }

        });






    };
    function startCarousel(self){

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

                    $(self.element).find(".carousel").each(function(index){
                        $(this).css({
                            'left':index*self.options.largeur
                        });

                    })
                    $(self.element).find(".carousel:first").css({
                        'left': 0
                    }).addClass('active');


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

            fade(self);
        });

    }
    function slide(self) {
        if(!self.options.click){

            self.options.elementPrecedent = self.options.elementCourant;
            self.options.elementCourant=suivant(self.options);
        }
        var deplacement = (self.options.elementCourant>0)?'-='+self.options.largeur+'px': '+='+(self.options.nbElement-1)*self.options.largeur+'px';
        var count = 0;


        $(self.element).children(".carousel").delay((self.options.click)?10:self.options.delay).animate({
            'left': deplacement
        }, 'slow' , function() {
            count++;
            if(count===self.options.nbElement){
                $(self.element).children(".carousel").eq(self.options.elementCourant).addClass('active').siblings(".carousel").removeClass('active');
                self.options.click =false;

                slide(self);
            }
        })

    }

    function suivant(options) {
        var num = 0;
        num  = Number(options.elementCourant) + 1;
        if(num  === options.nbElement) {
            num  = 0;
        }

        return num;
    }

    function precharger_image(self)
    {


        var _done=function() {
            $(self.element).trigger('complete');
        },i = 0;


        $(self.element).find(".carousel").each(function() {
            var _img = this,
            _checki=function(e) {
                if((_img.complete) || (_img.readyState=='complete'&&e.type=='readystatechange') )
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