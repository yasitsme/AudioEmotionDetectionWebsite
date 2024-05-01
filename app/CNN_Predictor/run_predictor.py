from app.CNN_Predictor.model_loader import get_CNN
from app.CNN_Predictor.prediction import audio_to_img
from app.CNN_Predictor.prediction import make_prediction

import os

emotion_map = {0: 'anger', 1: 'boredom', 2: 'disgust', 3: 'fear', 4: 'happiness', 5: 'neutral', 6: 'sadness'}
model = get_CNN()

def get_prediction(image):

    list, predictions = make_prediction(image, model)
    predict_map = []

    print(list)
    print(predictions)

    for i in list:
        next = (emotion_map[i], predictions[i])
        predict_map.append(next)
    
    string = ""
    for i in predict_map:
        string += i[0] + ':' + str(round(i[1] * 100, 3)) + '%\n'
    print(string)
    
    return string

def test_prediction(path):
    ret = get_prediction(audio_to_img(os.path.join(path, 'test.wav')))
    return ret
