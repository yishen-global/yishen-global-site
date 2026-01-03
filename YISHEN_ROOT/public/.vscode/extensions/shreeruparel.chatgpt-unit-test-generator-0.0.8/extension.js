// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const fetch = require('node-fetch');

const vscode = require('vscode');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const { spawnSync } = require('child_process');
  
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let api_key = context.globalState;

	let disposable = vscode.commands.registerCommand('chatgpt-unit-test-generator.main', function () {
		if(!api_key.get('key')) {
			vscode.window.showInformationMessage('Set the API key first using ChatGPT Unit Test Generator: Set OpenAI API Key');		
			console.log('invalid key')
		}
		console.log('process started')
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			console.log('inside if loop')
			let document = editor.document;
			let fileContent = document.getText();
			let fileName = path.basename(document.fileName);


			let words = fileContent.split(/\s+/);

			if(words.length > 1500) {
				vscode.window.showInformationMessage("Due to ChatGPT word limitations, use a file with less than 1500 words");	
			}
			else {
				console.log('process started2')
				const file_name = 'unit-tests-' + fileName; // Change the file name to whatever you want
				const editor = vscode.window.activeTextEditor;
				const path_ = editor.document.uri.path;
				const directory = path_.substring(0, path_.lastIndexOf('/'));
				const filePath = `${directory}/${file_name}`;
				
				if (fs.existsSync(filePath)) {
					vscode.window.showErrorMessage(`File ${file_name} already exists in ${directory}.`);
					console.log('exists')
					return;
				}


				let loadingStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100000);
				loadingStatusBarItem.text = "$(sync~spin) Generating Unit Tests For " + fileName + "...";
				loadingStatusBarItem.show();
				console.log('1')


				const { Configuration, OpenAIApi } = require("openai");
				// const openai = new OpenAI('YOUR_OPENAI_API_KEY');
				const configuration = new Configuration({
					apiKey: api_key.get('key'),
				});
				const openai = new OpenAIApi(configuration);


				// const prompt_main = "You are a helpful assistant that write unit tests for the code provided. You will only answer with a regular code block. Do not include any sort of explanation before or after the regular code block. Don't use language specific code blocks. If it is not possible to generate unit tests, just print out \"not possible00192\". \n\n";
			const prompt_main = "You are a highly professional unit test bot that can only do two things: print out code or print out \"not possible00192\" if it is not possible to generate unit tests. You will generate unit tests in the same language as the provided code. Don't include any explainations before or after the code. Be sure to include any import statements necessary to run the unit test code.\n\n REMEMBER: If it is not possible to generate unit tests, just print out \"not possible00192\" YOU SHALL NOT GIVE ANY OTHER EXPLAINATIONS WHATSOEVER. ONLY PRINT OUT \"not possible00192\"\n\n"
				
				
				
				// const prompt_main = "You are a helpful assistant that does not have the ability to speak english. You can only write code. Hence everything you write will be inside a code block. Your job is to write unit tests for any code provided in the SAME language as that code. You will include any import statements necessary to run the unit test code. DO NOT include any text before or after the code block since you do not have the ability to do so. If it is not possible to generate unit tests, just print out \"not possible00192\". \n\n"
				
				// helpful assistant that write unit tests for the code provided in the same language as the code given. You will include any import statements necessary to run the unit test code. You will only answer with a regular code block. DO NOT include any text before or after the code block. Don't use language specific code blocks. If it is not possible to generate unit tests, just print out \"not possible00192\". \n\n"
				const content = fileContent
				console.log(prompt_main);

				(async () => {
				try {
					console.log("inside try")
					const result = await openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: [
						{"role": "system", "content": prompt_main},
						{"role": "user", "content": content}
					]
					});
					console.log(result)

					let res = result.data.choices[0].message.content;
					res = res.trim();

					if (res.startsWith("```")) {
					res = res.substring(3);
					}
					if (res.startsWith("python")) {
					res = res.substring(6);
					}
					if (res.endsWith("```")) {
					res = res.slice(0, -3);
					}

					if (res.includes("not possible00192")) {
					vscode.window.showInformationMessage("Couldn't generate unit tests for this file. Try a different file.");

					loadingStatusBarItem.text = "Error Generating";
						setTimeout(() => {
						loadingStatusBarItem.hide();
					}, 1000);
					
					} else {
					console.log("js" + res);
					const pattern = /```(?:\w+\n?)?([\s\S]*?)(?=```|$)/;



					const match = res.match(pattern);
					if (match && match[1]) {
						// console.log("before: " + res);
						res = match[1].trim();
						// console.log("after: " + res);
					  }
					else {

					  }
					

					const editor = vscode.window.activeTextEditor;
						// const path = editor.document.uri.path;
						// const directory = path.substring(0, path.lastIndexOf('/'));
						const file_name = 'unit-tests-' + fileName; // Change the file name to whatever you want

						const filePath = `${directory}/${file_name}`;

						if (fs.existsSync(filePath)) {
							vscode.window.showErrorMessage(`File ${file_name} already exists in ${directory}.`);

							loadingStatusBarItem.text = "$(check) File already exists";
								setTimeout(() => {
								loadingStatusBarItem.hide();
							}, 1000); 
							return;
						}
						fs.writeFileSync(filePath, res); // Create the empty file
						vscode.workspace.openTextDocument(filePath).then((doc) => {
						vscode.window.showTextDocument(doc);

						vscode.window.showInformationMessage(file_name + " Generated");
						loadingStatusBarItem.text = "$(check) Generated!";
							setTimeout(() => {
							loadingStatusBarItem.hide();
						}, 1000);
						
						});
					}
				} catch (error) {
					if(error == "Error: Request failed with status code 401") {
						vscode.window.showInformationMessage("API Key Invalid");

						loadingStatusBarItem.text = "API Key Invalid";
							setTimeout(() => {
							loadingStatusBarItem.hide();
						}, 1000);
					}					
					else if(error == "Error: Request failed with status code 429") {
						vscode.window.showInformationMessage("Error due to billing issue. Check your billing plan on OpenAI");

						loadingStatusBarItem.text = "Billing Essue";
							setTimeout(() => {
							loadingStatusBarItem.hide();
						}, 1000);
					}	
					else {
						console.log(error);
						vscode.window.showInformationMessage("Unexpected Error. Try again later");

						loadingStatusBarItem.text = "Unexpected Error";
							setTimeout(() => {
							loadingStatusBarItem.hide();
						}, 1000);
					}
				}
				})();

			}
		}
		else {
			vscode.window.showInformationMessage('Open the file you want unit tests for and then run again');
		}
	});

	let disposable2 = vscode.commands.registerCommand('chatgpt-api-key-set.main', function () {
		vscode.window.showInputBox({
			prompt: "Please enter your API key",
			password: true
			}).then(value => {
			if (value) {
				api_key.update('key', value);
			} else {
				vscode.window.showErrorMessage("API key not entered, please try again");
			}
			});
	});


	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

