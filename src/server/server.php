<?php

    require 'content.php';
    global $articlesDefault, $articleRooms, $articleRoomItems, $articleNavigation;

    header("Content-Type:application/json; charset=UTF-8");

    if(!empty($_GET['article_id'])){

        $articleId = $_GET['article_id'];
        
        if($articleId == '' || $articleId == null || !$articleId){
            response(404,"found_no_article",NULL);
        }
        else if($articleId == '3'){
            sleep(0.5);
            // case where to forward to another article url
            header("Access-Control-Expose-Headers: Location");
            header("HTTP/1.1 301 Moved Permanently");
            //header("Location: /rooms/room1");
            header("Location: ?article_id=4&article_type=room");

            exit();
        }
        else{
			sleep(1);
            if($articleId == '1'){

                $text = '<div class="gallery-transition"></div>
                <div class="claim-wrapper">
                    <div class="claim-item claim-item-1">
                        <h2>enter</h2>
                    </div>
                    <div class="claim-item claim-item-2">
                        <h2>the</h2>
                    </div>
                    <div class="claim-item claim-item-3">
                        <h2>BRICK</h2>
                    </div>
                    <div class="claim-item sub-claim">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua</p>
                    </div>
                </div>
                <div class="gallery-bottom-transition"></div>
                <div class="perspective-bottom inactive"></div>';

                $responseArr = array();
                $responseArr["name"] = "Start";
                $responseArr["article_id"] = "1";
                $responseArr["text"] = $text;

                response(200, "found_article", $responseArr);

            }else{

                $responseArr = array();

                $text = "";
                $name = "";

                // ROOM
                if($_GET['article_type'] == 'room'){
                    $room = getRoomByArticleId($articleId);
                    if($room["text"]){
                        $text = $room["text"];
                    }
                    if($room["name"]){
                        $name = $room["name"];
                    }
                    $responseArr["items"] = $room["items"];
                }elseif($_GET['article_type'] == 'roomitem'){
                // ROOMITEM
                    $roomItem = getRoomItemByArticleId($articleId);
                    if($room["text"]){
                        $text = $roomItem["text"];
                    }
                    if($room["name"]){
                        $name = $roomItem["name"];
                    }
                    if($roomItem["img"]){
                        $responseArr["img"] = $roomItem["img"];
                    }
                    if($roomItem["specs"]){
                        $responseArr["specs"] = $roomItem["specs"];
                    }
                    $responseArr["items"] = $roomItem["items"];
                }else{
                    $headline = getNavByArticleId($articleId);
                    $text = "<h1>".$headline."</h1><p>This is a text for article " .$articleId. "</p>";
                }

                $articleProperties = array();
                foreach(getNav() as $x => $item){
                    if($articleId == $item["article_id"]){
                        $articleProperties = $item;
                    }
                }

                if(sizeof($articleProperties) <= 0){
                    response(404, "found_no_article", $responseArr);
                }

                $responseArr["name"] = $name;
                $responseArr["article_id"] = $articleProperties["article_id"];
                $responseArr["text"] = $text;

                response(200, "found_article", $responseArr);
            } 
        }
        
    }elseif(!empty($_GET['get_aid_by_nav'])){

        $nav = $_GET['get_aid_by_nav'];

        if(substr($_GET['get_aid_by_nav'], strlen($_GET['get_aid_by_nav'])-1) == '/'){
            $nav = substr($_GET['get_aid_by_nav'], 0, strlen($_GET['get_aid_by_nav'])-1);
        }
        
		$id = getArticleIdByNav($nav);

        //$responseArr["name"] = '';
        $responseArr["article_id"] = $id;

		if($id == 'Nothing found'){
			response(404,"found_no_article_id",NULL);
		}else{
			response(200,"found_article_id",$responseArr);
		}

	}else{
        response(400,"Invalid Request",NULL);
    }

    function response($status,$status_message,$data){

        // header("Content-Type:application/json; charset=UTF-8");
        header("HTTP/1.1 ".$status);
        
        $response['status']=$status;
        $response['status_message']=$status_message;
        $response['data']=sizeof($data)>0?$data:NULL;

        $json_response = json_encode($response);
        echo $json_response;
        exit();
    }

    function getRoomByArticleId($article_id){

        foreach($GLOBALS['articleRooms'] as $item){
            //print_r($item);
            if($item['article_id'] == $article_id){
                return $item;
            }
        }

        return "Nothing found";
    }

    function getRoomItemByArticleId($article_id){

        foreach($GLOBALS['articleRoomItems'] as $item){
            //print_r($item);
            if($item['article_id'] == $article_id){
                return $item;
            }
        }

        return "Nothing found";
    }

    function getNav(){
        return $GLOBALS['articleNavigation'];
    }

	function getArticleIdByNav($path){

		foreach(getNav() as $x => $item){
			if($path == $x){
				return $item["article_id"];
			}
		}

		return "Nothing found";

	}

    function getNavByArticleId($id){
        foreach(getNav() as $x => $item){
			if($id == $item["article_id"]){
				return $x;
			}
		}

		return "Nothing found";
    }

?>