pwd
cd ./vocals
echo 'Segmenting vocals.'
ffmpeg -i video-voice.wav -f segment -segment_time 10 -c copy vocal%03d.wav
echo 'Segmenting completed.'
echo 'Process terminated.'
