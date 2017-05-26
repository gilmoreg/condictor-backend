#!/bin/bash
set -e # Abort script at first error
set -u # Disallow unset variables

# Only run when not part of a pull request and on the master branch
if [ $TRAVIS_PULL_REQUEST != "false" -o $TRAVIS_BRANCH != "master" ]
then
    echo "Skipping deployment on branch=$TRAVIS_BRANCH, PR=$TRAVIS_PULL_REQUEST"
    exit 0;
fi

# Install the toolbelt, and the required plugin.
# docker login -u=$DOCKER_USERNAME -p=$DOCKER_PASSWORD
docker build -f Dockerfile -t $DOCKER_IMAGE_NAME .
# if [ ! -z "$TRAVIS_TAG" ]; then 
#  docker tag $DOCKER_IMAGE_NAME:latest $DOCKER_IMAGE_NAME:$TRAVIS_TAG; 
# fi 
# if [ "$TRAVIS_BRANCH" == "master" ]; then 
#  docker push $DOCKER_IMAGE_NAME; 
# fi


