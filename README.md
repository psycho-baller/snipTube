# SnipTube

## Prerequisites

- run `yarn` in the root folder to install all the node dependencies.
- run `cd llm-api` to go to the `llm-api` folder and create a virtual environment with `python3 -m venv venv` and activate it with `source venv/bin/activate` then run `pip install -r requirements.txt` to install all the python dependencies.
- use `.env.example` to create a `.env` file in the root folder and fill in the values.

## Development

To run the browser extension, run `yarn dev` in the root folder, then you will find the extension in the `build/chrome-mv3-dev` folder. You can then load the extension in chrome by going to `chrome://extensions` and clicking on `Load unpacked` and selecting that folder.

## Current Focus

**Getting ready to go to production**

## TODO

### Frontend

- [X] add css and style the snips
- [X] make everything get updated instantly (e.g: when we make a new snip, reflect that in the video bar)
- [X] build the popup.tsx file
- [ ] style the tags in the popup and put them in tab 2 too
- [ ] make the tags clickable in the popup and make them filter the snips
- [X] add notes and play button for both tabs
- [X] add a delete button for the snips
- [ ] add a way users can change the name (AI generated title) of the snip
  - [ ] before submitting the snip
  - [ ] after submitting the snip (in the popup)
- [X] Try out [plasmo](https://www.plasmo.com/)
- [X] Investigate different OSS LLMs to see which one is the best for this project
- [X] The snip summary now has context to the whole video instead of just the snip
- [ ] Options?
- [ ] Settings page
  - [ ] Change default snip duration
  - [ ] Set if you want to edit your notes or tags before submitting the snip
  - [ ] Users can choose which llm they want to use
    - [ ] If gpt3.5, monthly subscription
    - [ ] If open source llm, free
    - [ ] They can also input their own OpenAI API key
  - [ ] Change default snip title length
  - [ ] Light mode
- [ ] When a snip is clicked, it will expand and show all info about the snip
- [ ] Use framer motion for animations
- [X] Add a js backend to get transcript and video details and separate the storage stuff from the backend
- [ ] You can now export your snips as json or md

### Backend

- [X] Move the backend to the nextjs app
- [ ] handle the case where the backend has not yet completed summarizing the whole video (do we even want that feature??? How would others do it to get the best summary possible?)
- [ ] What is stopping me from moving the FastAPI backend to the NextJS backend?
  - pros:
    - Probably faster
    - Easier to deploy
  - cons:
    - Python is easier to work with
    - Python has more libraries
    - LangChain is more mature in python
- [ ] What LLM am I using? Cohere looks promising but it's not open source and idk bout using it for commercial purposes and if it can handle multiple users and also long videos. CHatGPT seems like the fastest and best option but also HG looks good too but I gotta do some more prompting to get it to acc work.

### Both

- [ ] Tags can be used to find public snips by other users (database needed)
  - [ ] Feat: Users can choose to make their snips public or private (settings page)
