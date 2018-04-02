import sys
import json
from tswift import Song

def main():
    query = sys.argv[1]
    s = Song.find_song(query)
    data = {}
    if s:
        data['lyrics'] = s.lyrics.replace('\n', '')
        print(data['lyrics'])

if __name__ == '__main__':
    main()