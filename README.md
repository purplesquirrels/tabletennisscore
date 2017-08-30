# TT Score (front-end)
A simple table tennis scoring app 

This is the front-end for the app built with React and Redux.

Enter the player names on your left and right, then select who is serving first. The app will display who is serving when and who starts serving on each set, and when players swap ends this will be reflected by swapping the players on screen i.e. the player on your left will be always on the left of the screen.

Tap the end set button to save the result and start a new set.

Scores can be broadcast over a websocket to allow other clients to connect and watch the game scores in real-time.
Note: scores are currently not persisted anywhere. When you refresh you will lose the results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).