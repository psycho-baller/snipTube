# SnipTube

<a href="https://wakatime.com/badge/user/33addb7e-f5e6-470b-a55b-0a8babc62ebb/project/7432176a-d08e-48bd-96fb-6cba5c9f4fa2"><img src="https://wakatime.com/badge/user/33addb7e-f5e6-470b-a55b-0a8babc62ebb/project/7432176a-d08e-48bd-96fb-6cba5c9f4fa2.svg" alt="wakatime"></a>

## Prerequisites

- run `yarn` in the root folder to install all the node dependencies.
- run `cd llm-api` to go to the `llm-api` folder and create a virtual environment with `python3 -m venv venv` and activate it with `source venv/bin/activate` then run `pip install -r requirements.txt` to install all the python dependencies.
- use `.env.example` to create a `.env` file in the root folder and fill in the values.

## Development

To run the browser extension, run `yarn dev` in the root folder, then you will find the extension in the `build/chrome-mv3-dev` folder. You can then load the extension in chrome by going to `chrome://extensions` and clicking on `Load unpacked` and selecting that folder.
