echo 'Attempting to Extract Vocals...'
cd ../../ML/music-source-separation/
pyenv activate tunescout-2.7
echo 'Virtual environment loaded, activating ML...'
python eval.py ../../server/tune_scout_server/pre-vocal-extraction/ ../../server/tune_scout_server/vocals
echo 'Propagation completed, packaging vocals...'
echo 'Process terminated.'
