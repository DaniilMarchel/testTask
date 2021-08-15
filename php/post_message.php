<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, GET');

    $password="290800";
    $connect_string = "host=localhost port=5432 dbname=testTask user=postgres password=".$password;
    $db = pg_connect($connect_string);

    $postData = json_decode(file_get_contents("php://input"), true);
    $postData = str_replace("'", "''", $postData);

    $query = "SELECT id_client FROM clients WHERE email='".$postData['email']."' AND phone='".$postData['phone']."'";
    $id_client = pg_fetch_result(pg_query($db, $query), 0);
    if(!$id_client){
        $query = "INSERT INTO clients (name_client, email, phone) 
                VALUES('".$postData['name']."', '".$postData['email']."', '".$postData['phone']."') RETURNING id_client;";
        $id_client = pg_fetch_result(pg_query($db, $query), 0); 
    }

    $query = "SELECT id_topic FROM message_topics WHERE name_topic='".$postData['topic']."'";
    $id_topic = pg_fetch_result(pg_query($db, $query), 0);

    $query = "INSERT INTO messages (text_message, id_topic, id_client) 
            VALUES('".$postData['text']."', ".$id_topic.", ".$id_client.") RETURNING id_message";
    $id_message = pg_fetch_result(pg_query($db, $query), 0);
  
    // Вернуть поля сохраненного сообщения пользователя
    $query = 'SELECT name_client, email, phone, name_topic, text_message FROM messages 
            INNER JOIN clients ON clients.id_client=messages.id_client 
            INNER JOIN message_topics ON message_topics.id_topic=messages.id_topic 
            WHERE messages.id_client='.$id_client.' AND messages.id_topic='.$id_topic.' AND id_message='.$id_message;
    $dataForm = pg_fetch_all(pg_query($db, $query));
    echo json_encode($dataForm);
?>