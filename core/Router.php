<?php
namespace Core;

class Router
{
    private $routes = [];

    public function add($route, $controller, $action, $method = 'GET')
    {
        $this->routes[] = [
            'route' => $route,
            'controller' => $controller,
            'action' => $action,
            'method' => strtoupper($method)
        ];
    }

    public function dispatch($url, $method)
    {
        $url = $this->removeQueryString($url);
        foreach ($this->routes as $route) {
            if ($route['method'] !== strtoupper($method)) {
                continue;
            }
            $pattern = $this->compilePattern($route['route']);
            if (preg_match($pattern, $url, $matches)) {
                array_shift($matches);
                $params = [];
                foreach ($matches as $key => $value) {
                    if (is_int($key)) {
                        $params[] = $value;
                    }
                }
                $controllerName = "Controllers\\" . $route['controller'];
                if (class_exists($controllerName)) {
                    $controller = new $controllerName();
                    $action = $route['action'];
                    if (is_callable([$controller, $action])) {
                        call_user_func_array([$controller, $action], $params);
                        return;
                    }
                }
            }
        }
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
    }

    private function compilePattern($route)
    {
        $route = preg_replace('/\//', '\\/', $route);
        $route = preg_replace('/\{([a-z]+)\}/', '(?P<\1>[a-zA-Z0-9\-_]+)', $route);
        $route = '/^' . $route . '$/';
        return $route;
    }

    private function removeQueryString($url)
    {
        if ($url != '') {
            $parts = explode('?', $url, 2);
            $url = $parts[0];
        }
        return $url;
    }
}