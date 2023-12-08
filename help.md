Docker deploy

docker build -t my-react-app .
docker run -d -p 8800:80 --name my-react-app my-react-app

remove dangling <none> image files
docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)

https://medium.com/@tiangolo/react-in-docker-with-nginx-built-with-multi-stage-docker-builds-including-testing-8cc49d6ec305
