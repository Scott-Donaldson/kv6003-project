import '@tensorflow/tfjs-node'
import * as toxicmodel from '@tensorflow-models/toxicity'

export default class Classifier {
    constructor(threashold){
        if(!threashold) throw new Error('No threashold found')
        if(isNaN(threashold)) throw new Error(`Threshold parameted must be a number! Got ${threashold} (${typeof(threashold)})`)
        this._threashold = threashold
    }
    /**
     * @return {float}
     */
    get threashold(){
        return this._threashold
    }
    /**
     * @param {float} newThreashold
     */
    set threashold(newThreashold){
        if(isNaN(threashold)) throw new Error(`Threshold parameted must be a number! Got ${threashold} (${typeof(threashold)})`)
        this._threashold = newThreashold
    }
    /**
     * Classifies a message with Tensorflow Toxicity Model
     * @param {String} message 
     * @returns {resultObject}
     */
    classifyMessage = async message => {
        let timeTaken = process.hrtime()
        let model = await toxicmodel.load(this._threashold)
        let res = await model.classify([message])
        timeTaken = process.hrtime(timeTaken)
        return this.parseClassifiedMessage(res, message, timeTaken)
    }
    /**
     * Takes set parameters and parses them into a result object to be used in other fucntions
     * @param {Model.Classify} results 
     * @param {Discord.Message} message 
     * @param {Process.hrtime} executionTime 
     * @returns 
     */
    parseClassifiedMessage = (results, message, executionTime) => {
        let resultObject = {message: message, executionTime: {seconds: executionTime[0], milliseconds: Math.round(executionTime[1] / 1e6)}, flagged: false ,results: {}}
        results.forEach(element => {
            if (element.results[0].match) resultObject.flagged = true
            resultObject.results[element.label] = element.results[0].match || false
        })
        return resultObject
    }
    /**
     * 
     * @returns {float} default value for threshold
     */
    static defaultThreashold(){
        return 0.9
    }
}