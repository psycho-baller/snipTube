# Contributing

## Prerequisites

- run `pnpm i` in the root folder to install all the node dependencies.
- create a virtual environment with `python3 -m venv venv` and activate it with `source venv/bin/activate` then run `pip install -r requirements.txt` to install all the python dependencies.
- run `cp .env.example .env` to create a `.env` file and fill in the required environment variables.

## Development

To run the browser extension, run `pnpm dev:plasmo` in the root folder, then you will find the extension in the `build/chrome-mv3-dev` folder. You can then load the extension in chrome by going to `chrome://extensions` and clicking on `Load unpacked` and selecting that folder.

To also run the backend alongside the extension, run `pnpm dev` in the root folder, this will start the Next.js and the FastAPI server.
