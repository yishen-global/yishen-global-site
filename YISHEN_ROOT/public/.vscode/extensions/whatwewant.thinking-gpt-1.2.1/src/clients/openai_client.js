const { Configuration, OpenAIApi } = require('openai');

const createOpenAiCompletion = async (apiKey, model, one_shot_prompt, temperature, maxTokens, apiServer) => {
    
    const configuration = new Configuration({
        apiKey: apiKey,
        basePath: apiServer,
    });
    const openai = new OpenAIApi(configuration);

    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-3.5-turbo-0301':
        {
          const completion = await openai.createChatCompletion({
            model: model,
            messages: [
              { role: "user", content: one_shot_prompt },
            ],
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["END"],
          });

          //OPENAI completion
          return completion;
        }
      default:
        {
          const completion = await openai.createCompletion({
            model: model,
            prompt: one_shot_prompt,
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["END"],
          });

          //OPENAI completion
          return completion;
        }
    }
}

module.exports = { createOpenAiCompletion }
