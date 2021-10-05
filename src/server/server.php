<?php

    // if($_SERVER["REQUEST_METHOD"] == "GET"){

    //     sleep(3);
    //     echo json_encode('Joö');

    // }

    header("Content-Type:application/json");

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

                $headline = getNavByArticleId($articleId);
                response(200,"found_article","<h1>".$headline."</h1><p>This is a text for article " .$articleId. "</p>");
            
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

    function getNav(){
        return array(
            "/"=>"1",
            "/somewhere-to-a"=>"2",
            "/somewhere-to-b"=>"3",
            "/somewhere-to-b/and-to-the-b1"=>"4",
            "/somewhere-to-b/and-to-the-b2-with-spice"=>"5",
            "/somewhere-to-c"=>"6",
            "/somewhere-to-d"=>"7"
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