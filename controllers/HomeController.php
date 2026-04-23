<?php
namespace Controllers;

use Utils\Response;

class HomeController
{
    public function home()
    {
        Response::html("../../frontend/goaltrip.html");
    }
}