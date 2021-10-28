import '@tensorflow/tfjs-node'
import * as toxicmodel from '@tensorflow-models/toxicity'

class Classifier {
    constructor(threashold){
        if(isNaN(threashold)) throw new Error(`Threshold parameted must be a number! Got ${threashold} (${typeof(threashold)})`)
        this._threashold = threashold
    }
    get threashold(){
        return this._threashold
    }
    set threashold(newThreashold){
        this._threashold = newThreashold
    }

    classifyMessage = async message => {
        let timeTaken = process.hrtime()
        let model = await toxicmodel.load(this._threashold)
        let res = await model.classify([message])
        timeTaken = process.hrtime(timeTaken)
        return this.parseClassifiedMessage(res, message, timeTaken)
    }
    parseClassifiedMessage = (results, message, executionTime) => {
        let resultObject = {message: message, executionTime: {seconds: executionTime[0], milliseconds: Math.round(executionTime[1] / 1e6)}, flagged: false ,results: {}}
        results.forEach(element => {
            if (element.results[0].match) resultObject.flagged = true
            resultObject.results[element.label] = element.results[0].match || false
        })
        return resultObject
    }
    static defaultThreashold(){
        return 0.9
    }
}

export {Classifier}
