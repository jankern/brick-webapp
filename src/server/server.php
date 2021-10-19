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
        
        if($articleId == '' || $articleId == null || !$articleId){
            response(404,"found_no_article",NULL);
        }
        else if($articleId == '3'){
            sleep(0.5);
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

                // ROOM
                if($_GET['article_type'] == 'room'){
                    $room = getRoomByArticleId($articleId);
                    $text = $room["text"];
                    $responseArr["items"] = $room["items"];
                }elseif($_GET['article_type'] == 'roomitem'){
                // ROOMITEM
                    $roomItem = getRoomItemByArticleId($articleId);
                    $text = $roomItem["text"];
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

                $responseArr["name"] = $articleProperties["name"];
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

        $rooms = [
            [
                "article_id" => "4",
                "text" => "This the room for the first few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"1M", "img"=>"/img/brick1.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"2M", "img"=>"/img/brick2.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"3M", "img"=>"/img/brick3.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"4M", "img"=>"/img/brick4.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"5M", "img"=>"/img/brick5.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"6M", "img"=>"/img/brick6.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"7M", "img"=>"/img/brick7.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"8M", "img"=>"/img/brick8.png", "name"=>"This is the eighth Brick"]
                ]
            ],
            [
                "article_id" => "5",
                "text" => "This the room for the second few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"9M", "img"=>"/img/brick9.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"10M", "img"=>"/img/brick10.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"11M", "img"=>"/img/brick11.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"12M", "img"=>"/img/brick12.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"13M", "img"=>"/img/brick13.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"14M", "img"=>"/img/brick14.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"15M", "img"=>"/img/brick15.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"16M", "img"=>"/img/brick16.png", "name"=>"This is the eighth Brick"]
                ]
            ],
            [
                "article_id" => "6",
                "text" => "This the room for the third few crazy Lego bricks.",
                "items" => [
                    ["article_id"=>"17M", "img"=>"/img/brick17.png", "name"=>"This is the first Brick"],
                    ["article_id"=>"18M", "img"=>"/img/brick18.png", "name"=>"This is the second Brick"],
                    ["article_id"=>"19M", "img"=>"/img/brick19.png", "name"=>"This is the third Brick"],
                    ["article_id"=>"20M", "img"=>"/img/brick20.png", "name"=>"This is the fourth Brick"],
                    ["article_id"=>"21M", "img"=>"/img/brick21.png", "name"=>"This is the fifth Brick"],
                    ["article_id"=>"22M", "img"=>"/img/brick22.png", "name"=>"This is the sixth Brick"],
                    ["article_id"=>"23M", "img"=>"/img/brick23.png", "name"=>"This is the seventh Brick"],
                    ["article_id"=>"24M", "img"=>"/img/brick24.png", "name"=>"This is the eighth Brick"]
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

    function getRoomItemByArticleId($article_id){

        $roomItems = [
            [
                "article_id" => "1M", // media category id
                "text" => "Brick 1 text",
                "items" => [
                    ["img"=>"/img/brick1-1.png", "name"=>"Brick 1 perspective 1"],
                    ["img"=>"/img/brick1-2.png", "name"=>"Brick 1 perspective 2"],
                    ["img"=>"/img/brick1-3.png", "name"=>"Brick 1 perspective 3"]
                ]
            ],
            [
                "article_id" => "2M", // media category id
                "text" => "Brick 2 text",
                "items" => [
                    ["img"=>"/img/brick2-1.png", "name"=>"Brick 2 perspective 1"],
                    ["img"=>"/img/brick2-2.png", "name"=>"Brick 2 perspective 2"],
                    ["img"=>"/img/brick2-3.png", "name"=>"Brick 2 perspective 3"]
                ]
            ],
            [
                "article_id" => "3M", // media category id
                "text" => "Brick 3 text",
                "items" => [
                    ["img"=>"/img/brick3-1.png", "name"=>"Brick 3 perspective 1"],
                    ["img"=>"/img/brick3-2.png", "name"=>"Brick 3 perspective 2"],
                    ["img"=>"/img/brick3-3.png", "name"=>"Brick 3 perspective 3"]
                ]
            ],
            [
                "article_id" => "4M", // media category id
                "text" => "Brick 4 text",
                "items" => [
                    ["img"=>"/img/brick4-1.png", "name"=>"Brick 4 perspective 1"],
                    ["img"=>"/img/brick4-2.png", "name"=>"Brick 4 perspective 2"],
                    ["img"=>"/img/brick4-3.png", "name"=>"Brick 4 perspective 3"]
                ]
            ],
            [
                "article_id" => "5M", // media category id
                "text" => "Brick 5 text",
                "items" => [
                    ["img"=>"/img/brick5-1.png", "name"=>"Brick 5 perspective 1"],
                    ["img"=>"/img/brick5-2.png", "name"=>"Brick 5 perspective 2"],
                    ["img"=>"/img/brick5-3.png", "name"=>"Brick 5 perspective 3"]
                ]
            ],
            [
                "article_id" => "6M", // media category id
                "text" => "Brick 6 text",
                "items" => [
                    ["img"=>"/img/brick6-1.png", "name"=>"Brick 6 perspective 1"],
                    ["img"=>"/img/brick6-2.png", "name"=>"Brick 6 perspective 2"],
                    ["img"=>"/img/brick6-3.png", "name"=>"Brick 6 perspective 3"]
                ]
            ],
            [
                "article_id" => "7M", // media category id
                "text" => "Brick 7 text",
                "items" => [
                    ["img"=>"/img/brick7-1.png", "name"=>"Brick 7 perspective 1"],
                    ["img"=>"/img/brick7-2.png", "name"=>"Brick 7 perspective 2"],
                    ["img"=>"/img/brick7-3.png", "name"=>"Brick 7 perspective 3"]
                ]
            ],
            [
                "article_id" => "8M", // media category id
                "text" => "Brick 8 text",
                "items" => [
                    ["img"=>"/img/brick8-1.png", "name"=>"Brick 8 perspective 1"],
                    ["img"=>"/img/brick8-2.png", "name"=>"Brick 8 perspective 2"],
                    ["img"=>"/img/brick8-3.png", "name"=>"Brick 8 perspective 3"]
                ]
            ],
            [
                "article_id" => "9M", // media category id
                "text" => "Brick 9 text",
                "items" => [
                    ["img"=>"/img/brick9-1.png", "name"=>"Brick 9 perspective 1"],
                    ["img"=>"/img/brick9-2.png", "name"=>"Brick 9 perspective 2"],
                    ["img"=>"/img/brick9-3.png", "name"=>"Brick 9 perspective 3"]
                ]
            ],
            [
                "article_id" => "10M", // media category id
                "text" => "Brick 10 text",
                "items" => [
                    ["img"=>"/img/brick10-1.png", "name"=>"Brick 10 perspective 1"],
                    ["img"=>"/img/brick10-2.png", "name"=>"Brick 10 perspective 2"],
                    ["img"=>"/img/brick10-3.png", "name"=>"Brick 10 perspective 3"]
                ]
            ],
            [
                "article_id" => "11M", // media category id
                "text" => "Brick 11 text",
                "items" => [
                    ["img"=>"/img/brick11-1.png", "name"=>"Brick 11 perspective 1"],
                    ["img"=>"/img/brick11-2.png", "name"=>"Brick 11 perspective 2"],
                    ["img"=>"/img/brick11-3.png", "name"=>"Brick 11 perspective 3"]
                ]
            ],
            [
                "article_id" => "12M", // media category id
                "text" => "Brick 12 text",
                "items" => [
                    ["img"=>"/img/brick12-1.png", "name"=>"Brick 12 perspective 1"],
                    ["img"=>"/img/brick12-2.png", "name"=>"Brick 12 perspective 2"],
                    ["img"=>"/img/brick12-3.png", "name"=>"Brick 12 perspective 3"]
                ]
            ],
            [
                "article_id" => "13M", // media category id
                "text" => "Brick 13 text",
                "items" => [
                    ["img"=>"/img/brick13-1.png", "name"=>"Brick 13 perspective 1"],
                    ["img"=>"/img/brick13-2.png", "name"=>"Brick 13 perspective 2"],
                    ["img"=>"/img/brick13-3.png", "name"=>"Brick 13 perspective 3"]
                ]
            ],
            [
                "article_id" => "14M", // media category id
                "text" => "Brick 14 text",
                "items" => [
                    ["img"=>"/img/brick14-1.png", "name"=>"Brick 14 perspective 1"],
                    ["img"=>"/img/brick14-2.png", "name"=>"Brick 14 perspective 2"],
                    ["img"=>"/img/brick14-3.png", "name"=>"Brick 14 perspective 3"]
                ]
            ],
            [
                "article_id" => "15M", // media category id
                "text" => "Brick 15 text",
                "items" => [
                    ["img"=>"/img/brick15-1.png", "name"=>"Brick 15 perspective 1"],
                    ["img"=>"/img/brick15-2.png", "name"=>"Brick 15 perspective 2"],
                    ["img"=>"/img/brick15-3.png", "name"=>"Brick 15 perspective 3"]
                ]
            ],
            [
                "article_id" => "16M", // media category id
                "text" => "Brick 16 text",
                "items" => [
                    ["img"=>"/img/brick16-1.png", "name"=>"Brick 16 perspective 1"],
                    ["img"=>"/img/brick16-2.png", "name"=>"Brick 16 perspective 2"],
                    ["img"=>"/img/brick16-3.png", "name"=>"Brick 16 perspective 3"]
                ]
            ],
            [
                "article_id" => "17M", // media category id
                "text" => "Brick 17 text",
                "items" => [
                    ["img"=>"/img/brick17-1.png", "name"=>"Brick 17 perspective 1"],
                    ["img"=>"/img/brick17-2.png", "name"=>"Brick 17 perspective 2"],
                    ["img"=>"/img/brick17-3.png", "name"=>"Brick 17 perspective 3"]
                ]
            ],
            [
                "article_id" => "18M", // media category id
                "text" => "Brick 18 text",
                "items" => [
                    ["img"=>"/img/brick18-1.png", "name"=>"Brick 18 perspective 1"],
                    ["img"=>"/img/brick18-2.png", "name"=>"Brick 18 perspective 2"],
                    ["img"=>"/img/brick18-3.png", "name"=>"Brick 18 perspective 3"]
                ]
            ],
            [
                "article_id" => "19M", // media category id
                "text" => "Brick 19 text",
                "items" => [
                    ["img"=>"/img/brick19-1.png", "name"=>"Brick 19 perspective 1"],
                    ["img"=>"/img/brick19-2.png", "name"=>"Brick 19 perspective 2"],
                    ["img"=>"/img/brick19-3.png", "name"=>"Brick 19 perspective 3"]
                ]
            ],
            [
                "article_id" => "20M", // media category id
                "text" => "Brick 20 text",
                "items" => [
                    ["img"=>"/img/brick20-1.png", "name"=>"Brick 20 perspective 1"],
                    ["img"=>"/img/brick20-2.png", "name"=>"Brick 20 perspective 2"],
                    ["img"=>"/img/brick20-3.png", "name"=>"Brick 20 perspective 3"]
                ]
            ],
            [
                "article_id" => "21M", // media category id
                "text" => "Brick 21 text",
                "items" => [
                    ["img"=>"/img/brick21-1.png", "name"=>"Brick 21 perspective 1"],
                    ["img"=>"/img/brick21-2.png", "name"=>"Brick 21 perspective 2"],
                    ["img"=>"/img/brick21-3.png", "name"=>"Brick 21 perspective 3"]
                ]
            ],
            [
                "article_id" => "22M", // media category id
                "text" => "Brick 22 text",
                "items" => [
                    ["img"=>"/img/brick22-1.png", "name"=>"Brick 22 perspective 1"],
                    ["img"=>"/img/brick22-2.png", "name"=>"Brick 22 perspective 2"],
                    ["img"=>"/img/brick22-3.png", "name"=>"Brick 22 perspective 3"]
                ]
            ],
            [
                "article_id" => "23M", // media category id
                "text" => "Brick 23 text",
                "items" => [
                    ["img"=>"/img/brick23-1.png", "name"=>"Brick 23 perspective 1"],
                    ["img"=>"/img/brick23-2.png", "name"=>"Brick 23 perspective 2"],
                    ["img"=>"/img/brick23-3.png", "name"=>"Brick 23 perspective 3"]
                ]
            ],
            [
                "article_id" => "24M", // media category id
                "text" => "Brick 24 text",
                "items" => [
                    ["img"=>"/img/brick24-1.png", "name"=>"Brick 24 perspective 1"],
                    ["img"=>"/img/brick24-2.png", "name"=>"Brick 24 perspective 2"],
                    ["img"=>"/img/brick24-3.png", "name"=>"Brick 24 perspective 3"]
                ]
            ]
        ];

        foreach($roomItems as $item){
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
            "/rooms/room1"=>["article_id"=>"4", "name"=>"Room 1*"],
            "/rooms/room1/brick1"=>["article_id"=>"1M", "name"=>"Brick 1"],
            "/rooms/room1/brick2"=>["article_id"=>"2M", "name"=>"Brick 2"],
            "/rooms/room1/brick3"=>["article_id"=>"3M", "name"=>"Brick 3"],
            "/rooms/room1/brick4"=>["article_id"=>"4M", "name"=>"Brick 4"],
            "/rooms/room1/brick5"=>["article_id"=>"5M", "name"=>"Brick 5"],
            "/rooms/room1/brick6"=>["article_id"=>"6M", "name"=>"Brick 6"],
            "/rooms/room1/brick7"=>["article_id"=>"7M", "name"=>"Brick 7"],
            "/rooms/room1/brick8"=>["article_id"=>"8M", "name"=>"Brick 8"],
            "/rooms/room2"=>["article_id"=>"5", "name"=>"Room 2"],
            "/rooms/room2/brick9"=>["article_id"=>"9M", "name"=>"Brick 9"],
            "/rooms/room2/brick10"=>["article_id"=>"10M", "name"=>"Brick 10"],
            "/rooms/room2/brick11"=>["article_id"=>"11M", "name"=>"Brick 11"],
            "/rooms/room2/brick12"=>["article_id"=>"12M", "name"=>"Brick 12"],
            "/rooms/room2/brick13"=>["article_id"=>"13M", "name"=>"Brick 13"],
            "/rooms/room2/brick14"=>["article_id"=>"14M", "name"=>"Brick 14"],
            "/rooms/room2/brick15"=>["article_id"=>"15M", "name"=>"Brick 15"],
            "/rooms/room2/brick16"=>["article_id"=>"16M", "name"=>"Brick 16"],
            "/rooms/room3"=>["article_id"=>"6", "name"=>"Room 3"],
            "/rooms/room3/brick17"=>["article_id"=>"17M", "name"=>"Brick 17"],
            "/rooms/room3/brick18"=>["article_id"=>"18M", "name"=>"Brick 18"],
            "/rooms/room3/brick19"=>["article_id"=>"19M", "name"=>"Brick 19"],
            "/rooms/room3/brick20"=>["article_id"=>"20M", "name"=>"Brick 20"],
            "/rooms/room3/brick21"=>["article_id"=>"21M", "name"=>"Brick 21"],
            "/rooms/room3/brick22"=>["article_id"=>"22M", "name"=>"Brick 22"],
            "/rooms/room3/brick23"=>["article_id"=>"23M", "name"=>"Brick 23"],
            "/rooms/room3/brick24"=>["article_id"=>"24M", "name"=>"Brick 24"],
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