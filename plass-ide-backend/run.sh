mkdir answer
if ! g++ -o main /app/src/main.cpp
then
    echo "compile error"
    exit
else
    ./main
fi