<?php

    require 'content.php';
    global $articlesDefault, $articleRooms, $articleRoomItems, $articleNavigation;
    global $articles, $articlesTranslation;
    $lang = 'en';

    header("Content-Type:application/json; charset=UTF-8");

    if(!empty($_GET['article_id'])){

        $articleId = $_GET['article_id'];
        
        if($articleId == '' || $articleId == null || !$articleId){
            response(404, "found_no_article", NULL);
        }else{

            $responseArr = array();

            $article = getArticleById($articleId);

            if(!isset($article)){
                response(404, "found_no_article", NULL);
            }

            if(isset($_GET['lang'])){
                $lang = $_GET['lang'];
            }

            if(isset($article['redirect'])){
                // case where to forward to another article url
                header("Access-Control-Expose-Headers: Location");
                header("HTTP/1.1 301 Moved Permanently");
                header("Location: ?article_id=".$article['redirect']."&article_type=".$article['article_type']."&lang=".$lang);
                exit();
            }

            // print_r($article);

            // prepare and fill the response array
            if(isset($articlesTranslation[$article['article_id']][$lang]['name'])){
                $responseArr['name'] = $articlesTranslation[$article['article_id']][$lang]['name'];
            }

            if(isset($articlesTranslation[$article['article_id']][$lang]['text'])){
                $responseArr['text'] = $articlesTranslation[$article['article_id']][$lang]['text'];
            }

            if(isset($article['img'])){
                $responseArr['img'] = $article['img'];
            }

            if(isset($articlesTranslation[$article['article_id']][$lang]['specs'])){
                $responseArr['specs'] = $articlesTranslation[$article['article_id']][$lang]['specs'];
            }

            $responseArr['article_id'] = $article['article_id'];

            if(isset($article['items'])){
                foreach($article['items'] as $key => $item){

                    // if translation for items exist
                    if(isset($articlesTranslation[$article['article_id']][$lang]['items'])){
                        // assign name translation to the response array
                        if(isset($articlesTranslation[$article['article_id']][$lang]['items'][$key]['name'])){
                            $responseArr['items'][$key]['name'] = 
                                $articlesTranslation[$article['article_id']][$lang]['items'][$key]['name'];
                        }
                        // assign text translation to the response array
                        if(isset($articlesTranslation[$article['article_id']][$lang]['items'][$key]['text'])){
                            $responseArr['items'][$key]['text'] = 
                                $articlesTranslation[$article['article_id']][$lang]['items'][$key]['text'];
                        }
                    }

                    // assign others
                    if(isset($item['img'])){
                        $responseArr['items'][$key]['img'] = $item['img'];
                    }

                    if(isset($item['article_id'])){
                        $responseArr['items'][$key]['article_id'] = $item['article_id'];
                    }

                }
            }

            // Add name and text attributes to the room items, taken from the room item translation
            if(isset($article['article_type'])){
                if($article['article_type'] == "room"){

                    $roomItemArticleReferences = getRoomItemReferencesByArticleId($article['article_id']);

                    if(isset($roomItemArticleReferences) && sizeof($roomItemArticleReferences) > 0){

                        foreach($roomItemArticleReferences as $key => $refValue){
                            if(isset($articlesTranslation[$refValue][$lang]['items'][$key]['name'])){ // example: 9M en items 0 name
                                $responseArr['items'][$key]['name'] = 
                                 $articlesTranslation[$refValue][$lang]['items'][$key]['name'];
                            }

                            if(isset($articlesTranslation[$refValue][$lang]['items'][$key]['text'])){ 
                                $responseArr['items'][$key]['text'] = 
                                 $articlesTranslation[$refValue][$lang]['items'][$key]['text'];
                            }
                        }
                        
                    }
                }
            }

            m_sleep(600);
            response(200, "found_article", $responseArr);
        }

    }elseif(!empty($_GET['get_aid_by_nav'])){

        $nav = $_GET['get_aid_by_nav'];

        if(substr($_GET['get_aid_by_nav'], strlen($_GET['get_aid_by_nav'])-1) == '/'){
            $nav = substr($_GET['get_aid_by_nav'], 0, strlen($_GET['get_aid_by_nav'])-1);
        }
        
		$articleId = getArticleIdByNav($nav);

        if(!isset($articleId)){
            response(404, "found_no_article_id", NULL);
        }

        $responseArr["article_id"] = $articleId;
        response(200,"found_article_id",$responseArr);

	}else{
        response(400,"Invalid Request",NULL);
    }

    function response($status,$status_message,$data){

        // header("Content-Type:application/json; charset=UTF-8");
        header("HTTP/1.1 ".$status);
        
        $response['status']=$status;
        $response['status_message']=$status_message;
        if(isset($data)){
            $response['data']=sizeof($data)>0?$data:NULL;
        }
        $json_response = json_encode($response);
        echo $json_response;
        exit();
    }

    function getRoomItemReferencesByArticleId($id){

        $roomItemReferences = array();

        foreach($GLOBALS['articles'] as $article){
            if($id == $article['article_id']){
                $roomItemReferences = $article['articles'];
                return $roomItemReferences;
            }
        }

        return;
    }

    function getArticleById($id){
        foreach($GLOBALS['articles'] as $article){
            if($id == $article['article_id']){
                return $article;
            }
        }

        return;
    }

    function getArticleIdByNav($path){

        foreach($GLOBALS['articles'] as $article){
            if($path == $article['path']){
                return $article['article_id'];
            }
        }

        return;

	}

    function getNavByArticleId($id){

        foreach($GLOBALS['articles'] as $article){
            if($id == $article['article_id']){
                return $article['path'];
            }
        }

        return;

    }

    function m_sleep($milliseconds) {
        return usleep($milliseconds * 1000); // Microseconds->milliseconds
    }

?>