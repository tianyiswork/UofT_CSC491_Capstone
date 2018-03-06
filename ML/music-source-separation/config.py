# -*- coding: utf-8 -*-
#!/usr/bin/env python
'''
By Dabi Ahn. andabi412@gmail.com.
https://www.github.com/andabi
'''

import tensorflow as tf


# TODO tf arg
# Model
class ModelConfig:
    SR = 16000
    L_FRAME = 1024
    L_HOP = L_FRAME / 4
    SEQ_LEN = 4


# Train
class TrainConfig:
    CASE = str(ModelConfig.SEQ_LEN) + 'frames_ikala'
    CKPT_PATH = 'checkpoints/' + CASE
    GRAPH_PATH = 'graphs/' + CASE + '/train'
    DATA_PATH = 'dataset/mir-1k'
    LR = 0.0001
    FINAL_STEP = 100000
    CKPT_STEP = 500
    NUM_WAVFILE = 1
    SECONDS = 30
    RE_TRAIN = False
    session_conf = tf.ConfigProto(
        device_count={'CPU': 1, 'GPU': 1},
        log_device_placement=True,
        gpu_options=tf.GPUOptions(
            allow_growth=True,
            per_process_gpu_memory_fraction=0.25
        ),
    )


# TODO seperating model and case
# TODO config for each case
# Eval
class EvalConfig:
    # CASE = '1frame'
    # CASE = '4-frames-masking-layer'
    CASE = str(ModelConfig.SEQ_LEN) + 'frames_ikala'
    CKPT_PATH = 'checkpoints/' + CASE
    GRAPH_PATH = 'graphs/' + CASE + '/eval'
    # DATA_PATH = 'dataset/eval/kpop'
    # DATA_PATH = 'dataset/mir-1k/Wavfile'
    # DATA_PATH = 'dataset/ikala'
    DATA_PATH = 'dataset/test'
    GRIFFIN_LIM = False
    GRIFFIN_LIM_ITER = 1000
    NUM_EVAL = 1 
    SECONDS = 60
    RE_EVAL = True
    EVAL_METRIC = False
    WRITE_RESULT = True
    RESULT_PATH = 'results/' + CASE
    session_conf = tf.ConfigProto(
        device_count={'CPU': 1, 'GPU': 1},
        gpu_options=tf.GPUOptions(allow_growth=True),
        log_device_placement=False
    )
