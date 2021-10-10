<?php

    // if($_SERVER["REQUEST_METHOD"] == "GET"){

    //     sleep(3);
    //     echo json_encode('Joö');

    // }

    header("Content-Type:application/json; charset=UTF-8");

    // echo '<pre>';
    // print_r($_GET);
    // echo '</pre>'

    if(!empty($_GET['article_id'])){

        $articleId = $_GET['article_id'];
        
        if($articleId == ''){
            response(200,"found_no_article",NULL);
        }
        else{
			sleep(1);
            if($articleId == '1'){

                $str = '<div class="gallery-transition"><div class="tmp-warn"><p>Gallery module will be loaded here ... once implemeneted!</p><p>Click on the logo to go back to start page</p></div></div>
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

                response(200, "found_article", $str);

            }else{

                if(isset($_GET['article_type'])){
                    response(200, "found_data", getRoomByArticleId($articleId));
                }else{
                    $headline = getNavByArticleId($articleId);
                    response(200,"found_article","<h1>".$headline."</h1><p>This is a text for article " .$articleId. "</p>");
                }
            } 
        }
        
    }elseif(!empty($_GET['get_aid_by_nav'])){

		$id = getArticleIdByNav($_GET['get_aid_by_nav']);
		if($id == 'Nothing found'){
			response(200,"found_no_article_id",NULL);
		}else{
			response(200,"found_article_id",$id);
		}

	}else{
        response(400,"Invalid Request",NULL);
    }

    function response($status,$status_message,$data){
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
                "name" => "Room 1",
                "article_id" => "4",
                "text" => "This the room for the first few crazy Lego bricks.",
                "items" => [
                    ["category_id"=>"1", "img"=>"./img/brick1.png", "name"=>"This is the first Brick"],
                    ["category_id"=>"2", "img"=>"./img/brick2.png", "name"=>"This is the second Brick"],
                    ["category_id"=>"3", "img"=>"./img/brick3.png", "name"=>"This is the third Brick"],
                    ["category_id"=>"4", "img"=>"./img/brick4.png", "name"=>"This is the fourth Brick"],
                    ["category_id"=>"5", "img"=>"./img/brick5.png", "name"=>"This is the fifth Brick"],
                    ["category_id"=>"6", "img"=>"./img/brick6.png", "name"=>"This is the sixth Brick"],
                    ["category_id"=>"7", "img"=>"./img/brick7.png", "name"=>"This is the seventh Brick"],
                    ["category_id"=>"8", "img"=>"./img/brick8.png", "name"=>"This is the eighth Brick"]
                ]
            ],
            [
                "name" => "Room 2",
                "article_id" => "5",
                "text" => "This the room for the second few crazy Lego bricks.",
                "items" => [
                    ["category_id"=>"9", "img"=>"./img/brick1.png", "name"=>"This is the first Brick"],
                    ["category_id"=>"8", "img"=>"./img/brick2.png", "name"=>"This is the second Brick"],
                    ["category_id"=>"10", "img"=>"./img/brick3.png", "name"=>"This is the third Brick"],
                    ["category_id"=>"11", "img"=>"./img/brick4.png", "name"=>"This is the fourth Brick"],
                    ["category_id"=>"12", "img"=>"./img/brick5.png", "name"=>"This is the fifth Brick"],
                    ["category_id"=>"13", "img"=>"./img/brick6.png", "name"=>"This is the sixth Brick"],
                    ["category_id"=>"14", "img"=>"./img/brick7.png", "name"=>"This is the seventh Brick"],
                    ["category_id"=>"15", "img"=>"./img/brick8.png", "name"=>"This is the eighth Brick"]
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
            "/"=>"1",
            "/somewhere-to-a"=>"2",
            "/rooms"=>"3",
            "/rooms/room1"=>"4",
            "/rooms/room2"=>"5",
            "/rooms/room3"=>"6",
            "/somewhere-to-c"=>"7",
            "/somewhere-to-d"=>"8"
        );
    }

	function getArticleIdByNav($path){

		foreach(getNav() as $x => $item){
			if($path == $x){
				return $item;
			}
		}

		return "Nothing found";

	}

    function getNavByArticleId($id){
        foreach(getNav() as $x => $item){
			if($id == $item){
				return $x;
			}
		}

		return "Nothing found";
    }

?>