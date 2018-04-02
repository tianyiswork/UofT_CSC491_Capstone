#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import httplib
import uuid
import json
import sys

class Microsoft_ASR():
    def __init__(self):
        self.sub_key = '931398b4600c4d4bb9925b60b4f349d8'
        self.token = None
        pass

    def get_speech_token(self):
        FetchTokenURI = "/sts/v1.0/issueToken"
        header = {'Ocp-Apim-Subscription-Key': self.sub_key}
        conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        body = ""
        conn.request("POST", FetchTokenURI, body, header)
        response = conn.getresponse()
        str_data = response.read()
        conn.close()
        self.token = str_data
        # print "Got Token: ", self.token
        return True

    def transcribe(self,speech_file):

        # Grab the token if we need it
        if self.token is None:
            print "No Token... Getting one"
            self.get_speech_token()

        endpoint = 'https://speech.platform.bing.com/recognize'
        request_id = uuid.uuid4()
        # Params form Microsoft Example
        params = {'scenarios': 'ulm',
                  'appid': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5',
                  'locale': 'en-US',
                  'version': '3.0',
                  'format': 'json',
                  'instanceid': '565D69FF-E928-4B7E-87DA-9A750B96D9E3',
                  'requestid': uuid.uuid4(),
                  'device.os': 'linux'}
        content_type = "audio/wav; codec=""audio/pcm""; samplerate=16000"
        f = open(speech_file, 'rb')
        data = f.read()

        # def stream_audio_file(speech_file, chunk_size=1024):
        #     with open(speech_file, 'rb') as f:
        #         while 1:
        #             data = f.read(1024)
        #             if not data:
        #                 break
        #             yield data

        headers = {'Authorization': 'Bearer ' + self.token,
                   'Content-Type': content_type}
        resp = requests.post(endpoint,
                            params=params,
                            data=data,
                            headers=headers)
        val = json.loads(resp.text)
        return val["results"][0]["name"], val["results"][0]["confidence"]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception("Please pass in a filename containing audio < 15s")
    ms_asr = Microsoft_ASR()
    ms_asr.get_speech_token()
    text, confidence = ms_asr.transcribe(sys.argv[1])
    print text
    # print "Confidence: ", confidence