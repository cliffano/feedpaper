#! /bin/sh

NAME="FeedTouch";
FILE="feedtouch-app.js";

get_pid() {
    pid=`ps -ef | sed -n '/node feedtouch-app.js/{/grep/!p;}' | awk '{print$2}'`;
    echo "$pid";
}

case $1 in
"start")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        echo "Starting $NAME in $2 environment."
        ENV=$2 nohup node $FILE > nohup.out 2> nohup.err < /dev/null &
        pid=$(get_pid)
        echo "$NAME is running on pid $pid."
    else
        echo "$NAME is already running on pid $pid."
    fi;;
"status")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        echo "$NAME is not running."
    else
        echo "$NAME is running on pid $pid."
    fi;;
"stop")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        echo "$NAME is not running."
    else
        echo "Stopping $NAME on pid $pid."
        kill -9 "$pid"
    fi;;
*)
    echo "Usage:\n\t$0 <start|stop|status>";;
esac