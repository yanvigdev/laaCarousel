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
            $hauteur = 400;
            $largeur = 600;
            ?>
            <div id='diaporama1' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">

                <?php
                for ($index = 1; $index < 40; $index++)
                    {
                    $letype = rand(1, 10);
                    $count = rand(1, 10);
                    ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[$letype]; ?>/<?php echo $count; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$letype]; ?>"/>
                <?php } ?>


            </div><!--Fin diaporama1 -->
            <div id='diaporama2' style="width: <?php echo $largeur ?>px;height: <?php echo $hauteur ?>px;">

                <?php
                for ($index = 1; $index < 10; $index++)
                    {
                    $letype = rand(1, 10);
                    $count = rand(1, 10);
                    ?>
                    <img src='http://lorempixel.com/<?php echo $largeur . '/' . $hauteur; ?>/<?php echo $type[$letype]; ?>/<?php echo $count; ?>' height="<?php echo $hauteur ?>" width='<?php echo $largeur ?>' alt="Lorem ipsum <?php echo $type[$letype]; ?>"/>
                <?php } ?>


            </div><!--Fin diaporama1 -->
        </div><!--Fin wrapper -->

        <script type="text/javascript">

            $(document).ready( function() {
                $('#diaporama1').laaCarousel({mode:'vague',vignette:true});
                $('#diaporama2').laaCarousel({mode:'vague',vignette:true});


            });
        </script>
    </body>
</html>