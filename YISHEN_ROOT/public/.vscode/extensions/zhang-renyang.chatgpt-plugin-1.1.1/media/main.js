// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
	const vscode = acquireVsCodeApi();

	// Handle messages sent from the extension to the webview
	window.addEventListener("message", (event) => {
		const message = event.data;
		const list = document.getElementById("qa-list");
		switch (message.type) {
			case "addQuestion":
				const html = message.code != null
					? marked.parseInline(message.value + "<br /> <br /><pre class='overflow-auto'><code>```" + message.code + "```</code></pre>")
					: message.value;
				list.innerHTML +=
					`<div class="p-4 self-end mb-4 w-screen">
              <p class="font-bold mb-5 flex">
                 ASK:
              </p>
              <div>${html}</div>
          </div>`;

				document.getElementById("in-progress")?.classList?.remove("hidden");
				break;
			case "addResponse":
				document.getElementById("in-progress")?.classList?.add("hidden");
				list.innerHTML +=
					`<div class="p-4 self-end mb-4 pb-8 w-screen">
							<p class="font-bold mb-5 flex">
                  Answer:
              </p>
							<code class="flex flex-wrap break-words pr-5 mr-2">${marked.parse(message.value)}</code>
           </div>`;

				break;
			default:
				break;
		}
	});

	document.getElementById("ask-button")?.addEventListener("click", function (e) {
		const input = document.getElementById("question-input");
		if (input.value?.length > 0) {
			vscode.postMessage({
				type: "askChatGPT",
				value: input.value,
			});

			input.value = "";
		}
	});
})();
