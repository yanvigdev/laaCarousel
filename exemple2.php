<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <title>Demo Plugin jQuery laaCarousel</title>
        <link rel="stylesheet" media="screen" href="css/base.css" />

        <link rel="stylesheet" media="screen" href="css/ecran.css" />

        <script type="text/javascript" src="js/jquery.js"></script>
        <link rel="stylesheet" media="screen" href="css/laacarousel.css" />
        <script type="text/javascript" src="js/jquery.laaCarousel.js"></script>

    </head>
    <body>
        <div class="wrapper">

            <?php
            $type = array('abstract', 'animals', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport');
            $hauteur = 300;
            $largeur = 980;
            ?>
            <div id='diaporama1' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">

                <?php for ($index = 1; $index < 10; $index++)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[$index]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>


            </div><!--Fin diaporama1 -->
            <?php
            $hauteur = 250;
            $largeur = 490;
            ?>
            <div id='diaporama2' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">
                <?php for ($index = 10; $index > 1; $index--)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[10]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>

            </div><!--Fin diaporama2 -->
            <div id='diaporama3' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">
                <?php for ($index = 10; $index > 1; $index--)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[0]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>

            </div><!--Fin diaporama3 -->
            <?php
            $hauteur = 300;
            $largeur = 980;
            ?>
            <div id='diaporama4' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">

                <?php for ($index = 1; $index < 10; $index++)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[$index]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>


            </div><!--Fin diaporama4 -->
            <?php
            $hauteur = 250;
            $largeur = 490;
            ?>
            <div id='diaporama5' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">
                <?php for ($index = 10; $index > 1; $index--)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[10]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>

            </div><!--Fin diaporama5 -->
            <div id='diaporama6' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">
                <?php for ($index = 10; $index > 1; $index--)
                    { ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[0]; ?>/<?php echo $index; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$index]; ?>"/>
                <?php } ?>

            </div><!--Fin diaporama6 -->
        </div><!--Fin wrapper -->

        <script type="text/javascript">

            $(document).ready( function() {
                $('#diaporama1').laaCarousel({mode:'slide'});
                $('#diaporama2').laaCarousel({delay:4000});
                $('#diaporama3').laaCarousel({legend : "alt"});
                $('#diaporama4').laaCarousel({fleche : true,vignette:true});
                $('#diaporama5').laaCarousel({selecteur:true});
                $('#diaporama6').laaCarousel({preload:false});

            });
        </script>
    </body>
</html>