<!DOCTYPE html>
<html>

<?php

  require 'content.php';
  global $articles, $articlesTraanslation;
  $lang = 'en';

  $articlesHirarchy = array();
  $hirarchyReferences = array(); 

  function generateArticleHirarchy($articles, $articlesHirarchy, $hirarchyReferences){

    if(!isset($articles[0])){
      $articles = array();
      $articles[0] = $articles;
    }

    foreach($articles as $key => $article){
      $articleIsAlreadyAssigned = false;
      foreach($hirarchyReferences as $reference){
        foreach($reference as $refKey => $refValue){
          if($refKey == $article['article_id']){
            $articleIsAlreadyAssigned = true;
          }
        }
      }

      if(!$articleIsAlreadyAssigned){
        $articlesHirarchy[$key] = $article;

        // Second level
        if(isset($article['articles'])){
          $subArticles = array();
          foreach($article['articles'] as $key2 => $subArtcileReferences){
            foreach($articles as $subArticle){
              if($subArtcileReferences == $subArticle['article_id']){

                if(isset($subArticle['articles'])){
                  $subSubArticles = array();
                  foreach($subArticle['articles'] as $key3 => $subSubArtcileReferences){
                    foreach($articles as $subSubArticle){
                      if($subSubArtcileReferences == $subSubArticle['article_id']){
                        $subSubArticles[$key3] = $subSubArticle;
                        array_push($hirarchyReferences, [$subSubArticle['article_id'] => $subArticle['article_id']]);
                      }
                    }
                  }
                  $subArticle['articles'] = $subSubArticles;
                }

                $subArticles[$key2] = $subArticle;
                array_push($hirarchyReferences, [$subArticle['article_id'] => $article['article_id']]);
              }
            }
          }
          $articlesHirarchy[$key]['articles'] = $subArticles;
        }
      }
    }

    // echo '<pre>';
    // print_r($hirarchyReferences);
    // echo '</pre>';

    return $articlesHirarchy;
  }

  $navigation = generateArticleHirarchy($GLOBALS['articles'], $articlesHirarchy, $hirarchyReferences);

  echo '<pre>';
  print_r($navigation);
  echo '</pre>';

  // $list = ['hallo' => ['das' => ['sind' => 'Werte']]];
  // $newList = array();
  // $rememberKeys = array();

  // function test($list, $newList, $rememberKeys){

  //   foreach($list as $k => $l){
  //     if($k == 'das'){
  //       array_push($rememberKeys, $k);
  //     }
  //     array_push($newList, $k);

  //     return test($l, $newList, $rememberKeys);
  //   }

  //   return $newList;
  // }

?>

<head>
  <meta charset="utf-8">
  <link rel="shortcut icon" type="image/x-icon" href="./static/favicon.ico">
  <base href="/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet"> 
  <title>Cole-Blaq - Enter the brick</title>
  <script>

    <?php

      $tplSideNavObj = '{';

      foreach($navigation as $navigationItem){

        $tplSideNavObj .= '"'.$navigationItem['article_id'].'":{';
        foreach($navigationItem as $key => $item){
          if($key == 'articles'){

            $tplSideNavObj .= '"'.$key.'":{';
            foreach($item as $key1 => $item1){
              $tplSideNavObj .= '"'.$item1['article_id'].'":{';
              foreach($item1 as $key2 => $item2){
                if($key2 == 'articles'){

                  $tplSideNavObj .= '"'.$key.'":{';
                  foreach($item2 as $key3 => $item3){
                    $tplSideNavObj .= '"'.$item3['article_id'].'":{';
                    foreach($item3 as $key4 => $item4){
                      if($key4 != 'items' && $key4 != 'articles' && $key4 != 'article_id'){
                        $tplSideNavObj .= '"'.$key4.'":"'.$item4.'", ';
                      }
                    }
                    $tplSideNavObj .= '},';
                  }
                  $tplSideNavObj .= '},';

                }elseif($key2 != 'items' && $key2 != 'article_id'){
                  $tplSideNavObj .= '"'.$key2.'":"'.$item2.'", ';
                }
              }
              $tplSideNavObj .= '},';
            }
            $tplSideNavObj .= '},';

          }elseif($key != 'items' && $key != 'article_id'){
            $tplSideNavObj .= '"'.$key.'":"'.$item.'", ';
          }
        }
        $tplSideNavObj .= '},';
      }

      $tplSideNavObj .= '};';

      echo 'var sideNavObj = '.$tplSideNavObj;

    ?>
    
  </script>
</head>

<body>

  <header>
    <div class="header-item">
      <a href="./" data-article-id="1" class="logo">&nbsp;
      </a>
    </div>
    <div class="header-item">
      <button type="button" class="burger-nav-btn">
        <div class="material-icons close">close</div>
        <div class="material-icons menu">menu</div>
      </button>
    </div>
  </header>
  <main>

    <div class="view-wrapper preload">
      <div class="preload-container" >
        <div class="preload-item preload-item-1" id="preload-item-1"></div>
        <div class="preload-item preload-item-2" id="preload-item-2"></div>
        <div class="preload-item preload-item-3" id="preload-item-3"></div>
        <div class="preload-item preload-item-4" id="preload-item-4"></div>
        <div class="preload-item preload-item-4" id="preload-item-5"></div>
        <div class="preload-item preload-item-3" id="preload-item-6"></div>
        <div class="preload-item preload-item-2" id="preload-item-7"></div>
        <div class="preload-item preload-item-1" id="preload-item-8"></div>
      </div>
    </div>

    <nav class="view-wrapper burger-nav">

        <ul class="nav-wrapper">
        <?php

            $tpl_nav = '';
            $usedArticles = array();
            foreach($navigation as $navigationItem){

              if((!isset($navigationItem['online']) || $navigationItem['online'] == true ) && $navigationItem['article_id'] != '1'){ 

                $tpl_nav .= '<li class="lev-1 nav-animation">';
                $tpl_nav .= '<a href="'.$navigationItem['path'].'" data-article-id="'.$navigationItem['article_id'].'">'.
                    $articlesTranslation[$navigationItem['article_id']][$lang]['name'].'</a>';

                if(isset($navigationItem['articles'])){

                  $i = 0;
                  $tpl_subnav = '';

                  foreach($navigationItem['articles'] as $navigationItemArticle){

                    if((gettype($navigationItemArticle['online']) == 'NULL' || $navigationItemArticle['online'] == true )){ 

                      $tpl_ul_open = '';
                      $tpl_ul_close = '';

                      if($i <= 0){
                        $tpl_ul_open = '<ul>';
                      }elseif($i == sizeof($navigationItemArticle['articles'])-1){
                        $tpl_ul_close = '</ul>';
                      }

                      $tpl_subnav .= $tpl_ul_open.'<li class="lev-2">';
                      $tpl_subnav .= '<a href="'.$navigationItemArticle['path'].'" data-article-id="'.$navigationItemArticle['article_id'].'">'.
                          $articlesTranslation[$navigationItemArticle['article_id']][$lang]['name'].'</a>';
                      $tpl_subnav .= '</li">'.$tpl_ul_close;
                
                      $i += 1;

                    }

                  }
                  $tpl_nav .= $tpl_subnav;
                }
                $tpl_nav .= '</li>'; 
              }

            }

            echo $tpl_nav;
        ?>
        </ul>
    </nav>

  </main>

  <footer></footer>

</body>

</html>