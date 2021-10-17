<?php

    // if($_SERVER["REQUEST_METHOD"] == "GET"){

    //     sleep(3);
    //     echo json_encode('Joö');

    // }

    // echo '<pre>';
    // print_r($_GET);
    // echo '</pre>'

    header("Content-Type:application/json; charset=UTF-8");

    if(!empty($_GET['article_id'])){

        $articleId = $_GET['article_id'];
        
        if($articleId == ''){
            response(200,"found_no_article",NULL);
        }
        else if($articleId == '3'){
            sleep(1);
            // case where to forward to another article url
            // header("Content-Type:application/json; charset=UTF-8");
            // header("Access-Control-Expose-Headers:*");
            header("Access-Control-Expose-Headers: Location");
            header("HTTP/1.1 301 Moved Permanently");
            //header("Location: /rooms/room1");
            header("Location: ?article_id=4&article_type=room");

            exit();
        }
        else{
			sleep(1);
            if($articleId == '1'){

                $text = '<div class="gallery-transition"><div class="tmp-warn"><p>Gallery module will be loaded here ... once implemeneted!</p><p>Click on the logo to go back to start page</p></div></div>
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

                if(isset($_GET['article_type'])){

                    // ROOM
                    if($_GET['article_type'] == 'room'){
                        $room = getRoomByArticleId($articleId);
                        $text = $room["text"];
                        $responseArr["items"] = $room["items"];
                    }else{
                        // ROOMITEM

                    }

                    

                }else{
                    $headline = getNavByArticleId($articleId);
                    //response(200,"found_article","<h1>".$headline."</h1><p>This is a text for article " .$articleId. "</p>");
                    $text = "<h1>".$headline."</h1><p>This is a text for article " .$articleId. "</p>";
                }

                $articleProperties = array();
                foreach(getNav() as $x => $item){
                    if($articleId == $item["article_id"]){
                        $aricleProperties = $item;
                    }
                }

                $responseArr["name"] = $aricleProperties["name"];
                $responseArr["article_id"] = $aricleProperties["article_id"];
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
			response(200,"found_no_article_id",NULL);
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
        $response['data']=$data;

        $json_response = json_encode($response);
        echo $json_response;
    }

    function getRoomByArticleId($article_id){
        $rooms = [
            [
                "article_id" => "4",
                "text" => "This the room for the first few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"1M", "img"=>"./img/brick1.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"2M", "img"=>"./img/brick2.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"3M", "img"=>"./img/brick3.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"4M", "img"=>"./img/brick4.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"5M", "img"=>"./img/brick5.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"6M", "img"=>"./img/brick6.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"7M", "img"=>"./img/brick7.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"8M", "img"=>"./img/brick8.png", "name"=>"This is the eighth Brick"]
                ]
            ],
            [
                "article_id" => "5",
                "text" => "This the room for the second few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"9M", "img"=>"./img/brick9.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"10M", "img"=>"./img/brick10.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"11M", "img"=>"./img/brick11.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"12M", "img"=>"./img/brick12.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"13M", "img"=>"./img/brick13.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"14M", "img"=>"./img/brick14.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"15M", "img"=>"./img/brick15.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"16M", "img"=>"./img/brick16.png", "name"=>"This is the eighth Brick"]
                ]
            ],
            [
                "article_id" => "6",
                "text" => "This the room for the second few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"17M", "img"=>"./img/brick17.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"18M", "img"=>"./img/brick18.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"19M", "img"=>"./img/brick19.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"20M", "img"=>"./img/brick20.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"21M", "img"=>"./img/brick21.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"22M", "img"=>"./img/brick22.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"23M", "img"=>"./img/brick23.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"24M", "img"=>"./img/brick24.png", "name"=>"This is the eighth Brick"]
                ]
            ]
        ];

        foreach($rooms as $item){
            //print_r($item);
            if($item['article_id'] == $article_id){
                return $item;
            }
        }

        return "Nothing found";
    }

    function getNav(){
        return array(
            "/"=>["article_id"=>"1", "name"=>"Start"],
            "/somewhere-to-a"=>["article_id"=>"2", "name"=>"Somewhere to A"],
            "/rooms"=>["article_id"=>"3", "name"=>"Rooms"],
            "/rooms/room1"=>["article_id"=>"4", "name"=>"Room 1"],
            "/rooms/room2"=>["article_id"=>"5", "name"=>"Room 2"],
            "/rooms/room3"=>["article_id"=>"6", "name"=>"Room 3"],
            "/somewhere-to-c"=>["article_id"=>"7", "name"=>"Somewhere to C"],
            "/somewhere-to-d"=>["article_id"=>"8", "name"=>"Somewhere to D"]
        );
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