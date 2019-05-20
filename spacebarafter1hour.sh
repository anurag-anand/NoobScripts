sleep 25
OUTPUT=$(xprintidle)
if [ $OUTPUT -gt 10 ]
then
echo pressing space.
xdotool key space
fi

