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
        let model = await toxicmodel.load(this.threashold)
        let res = await model.classify([message])
        return this.parseClassifiedMessage(res)
    }
    parseClassifiedMessage = results => {
        let resultObject = {}
        results.forEach(element => {
            resultObject[element.label] = element.results[0].match || false
        })
        return resultObject
    }
    static defaultThreashold(){
        return 0.65
    }
}

export {Classifier}
