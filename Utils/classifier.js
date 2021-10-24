import * as tf from '@tensorflow/tfjs'
import * as toxicmodel from '@tensorflow-models/toxicity'

tf.setBackend('cpu')

const classifyMessage = (message, threshold) => {
    message[0] = message;
    toxicmodel.load(threshold).then(model => {
        model.classify(message).then(output => {
            return output;
        })
    })
}


export {classifyMessage}
