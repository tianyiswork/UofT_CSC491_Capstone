cd ../../ML/music-source-separation/
echo 'Attempting to Extract Vocals...'
python eval.py ../../server/tune_scout_server/pre-vocal-extraction/ ../../server/tune_scout_server/vocals
echo 'Propagation completed, packaging vocals...'
echo 'Process terminated.'
